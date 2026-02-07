const { getDb } = require('../config/db');

module.exports = {
    // Fetches only published courses for learners using the view
    getCourses: async (req, res) => {
        try {
            const db = getDb();
            const result = await db.query('SELECT * FROM v_learner_courses');
            res.json(result.rows);
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
