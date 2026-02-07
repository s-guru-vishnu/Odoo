const { getDb } = require('../config/db');

module.exports = {
    // Fetches only published courses for learners using robust filtering logic
    getCourses: async (req, res) => {
        try {
            const db = getDb();
            const { category, search, type, minPrice, maxPrice, rating: minRating, duration, sortBy } = req.query;

            // Base query with subqueries for stats
            let query = `
                SELECT 
                    c.id, 
                    c.title, 
                    c.description, 
                    c.image_url, 
                    c.price, 
                    c.created_at, 
                    u.full_name as instructor,
                    (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) as students,
                    (SELECT COALESCE(AVG(rating), 0) FROM reviews r WHERE r.course_id = c.id) as rating,
                    (SELECT json_agg(tag) FROM course_tags ct WHERE ct.course_id = c.id) as tags,
                    (SELECT COALESCE(SUM(duration), 0) FROM lessons l WHERE l.course_id = c.id) as total_duration
                FROM courses c 
                LEFT JOIN users u ON c.course_admin = u.id 
                WHERE c.published = true
            `;

            const params = [];
            let paramCount = 1;

            if (search) {
                query += ` AND (c.title ILIKE $${paramCount} OR c.description ILIKE $${paramCount})`;
                params.push(`%${search}%`);
                paramCount++;
            }

            if (category && category !== 'All') {
                query += ` AND EXISTS (SELECT 1 FROM course_tags ct WHERE ct.course_id = c.id AND ct.tag = $${paramCount})`;
                params.push(category);
                paramCount++;
            }

            if (type === 'free') {
                query += ` AND c.price = 0`;
            } else if (type === 'paid') {
                query += ` AND c.price > 0`;
            }

            if (minPrice) {
                query += ` AND c.price >= $${paramCount}`;
                params.push(minPrice);
                paramCount++;
            }
            if (maxPrice) {
                query += ` AND c.price <= $${paramCount}`;
                params.push(maxPrice);
                paramCount++;
            }

            if (minRating && minRating !== 'all') {
                query += ` AND (SELECT COALESCE(AVG(rating), 0) FROM reviews r WHERE r.course_id = c.id) >= $${paramCount}`;
                params.push(minRating);
                paramCount++;
            }

            if (duration === 'short') {
                query += ` AND (SELECT COALESCE(SUM(duration), 0) FROM lessons l WHERE l.course_id = c.id) < 120`;
            } else if (duration === 'medium') {
                query += ` AND (SELECT COALESCE(SUM(duration), 0) FROM lessons l WHERE l.course_id = c.id) BETWEEN 120 AND 600`;
            } else if (duration === 'long') {
                query += ` AND (SELECT COALESCE(SUM(duration), 0) FROM lessons l WHERE l.course_id = c.id) > 600`;
            }

            // Add Sorting
            switch (sortBy) {
                case 'price-low': query += ` ORDER BY c.price ASC`; break;
                case 'price-high': query += ` ORDER BY c.price DESC`; break;
                case 'rating': query += ` ORDER BY rating DESC`; break;
                case 'popular': query += ` ORDER BY students DESC`; break;
                case 'newest':
                default: query += ` ORDER BY c.created_at DESC`;
            }

            const result = await db.query(query, params);

            const courses = result.rows.map(course => {
                const totalMins = parseInt(course.total_duration) || 0;
                const hours = Math.floor(totalMins / 60);
                const mins = totalMins % 60;
                const durationStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

                return {
                    id: course.id,
                    title: course.title,
                    instructor: course.instructor || 'Unknown Instructor',
                    image_url: course.image_url,
                    rating: parseFloat(parseFloat(course.rating).toFixed(1)),
                    students: parseInt(course.students),
                    duration: durationStr,
                    price: parseFloat(course.price),
                    description: course.description
                };
            });

            res.json(courses);
        } catch (error) {
            console.error('FETCH COURSES ERROR:', error);
            res.status(500).json({ message: 'Error fetching courses' });
        }
    },

    // Fetches full details for a single course
    getCourseDetails: async (req, res) => {
        const { id } = req.params;
        try {
            const db = getDb();
            const result = await db.query(`
                SELECT c.*, u.full_name as instructor_name 
                FROM courses c
                LEFT JOIN users u ON c.course_admin = u.id
                WHERE c.id = $1 AND c.published = true
            `, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Course not found' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error('FETCH COURSE DETAILS ERROR:', error);
            res.status(500).json({ message: 'Error fetching course details' });
        }
    },

    getCourseReviews: async (req, res) => {
        const { id } = req.params;
        try {
            const db = getDb();

            // Fetch reviews with user details
            const reviewsRes = await db.query(`
                SELECT r.rating, r.review, r.created_at, u.full_name, u.role_id 
                FROM reviews r
                JOIN users u ON r.user_id = u.id
                WHERE r.course_id = $1
                ORDER BY r.created_at DESC
            `, [id]);

            // Calculate average
            const avgRes = await db.query(`
                SELECT AVG(rating) as average_rating, COUNT(*) as total_reviews
                FROM reviews
                WHERE course_id = $1
            `, [id]);

            res.json({
                reviews: reviewsRes.rows,
                stats: {
                    average: parseFloat(avgRes.rows[0].average_rating || 0).toFixed(1),
                    total: parseInt(avgRes.rows[0].total_reviews || 0)
                }
            });
        } catch (error) {
            console.error('GET REVIEWS ERROR:', error);
            res.status(500).json({ message: 'Error fetching reviews' });
        }
    },

    createCourse: async (req, res) => {
        const { title, description, price, access_rule } = req.body;
        const adminId = req.user.id;
        try {
            const db = getDb();
            const result = await db.query(
                `INSERT INTO courses (title, description, price, access_rule, course_admin) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [title, description, price || 0, access_rule || 'OPEN', adminId]
            );
            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('CREATE COURSE ERROR:', error);
            res.status(500).json({ message: 'Error creating course' });
        }
    },

    addReview: async (req, res) => {
        const { id } = req.params;
        const { rating, review } = req.body;
        const userId = req.user.id;

        try {
            const db = getDb();
            // Check if user is enrolled
            const enrollment = await db.query(
                'SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2',
                [userId, id]
            );

            if (enrollment.rows.length === 0) {
                return res.status(403).json({ message: 'You must be enrolled in this course to leave a review.' });
            }

            // Insert or Update review
            await db.query(`
                INSERT INTO reviews (user_id, course_id, rating, review)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (user_id, course_id) 
                DO UPDATE SET rating = EXCLUDED.rating, review = EXCLUDED.review, created_at = now()
            `, [userId, id, rating, review]);

            res.status(201).json({ message: 'Review submitted successfully' });
        } catch (error) {
            console.error('ADD REVIEW ERROR:', error);
            res.status(500).json({ message: 'Error submitting review' });
        }
    },

    updateCourse: (req, res) => { /* Update logic based on UUID */ },
    togglePublish: (req, res) => { /* Visibility toggle logic */ },
};
