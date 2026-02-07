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
            const result = await db.query('SELECT * FROM courses WHERE id = $1', [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Course not found' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error('FETCH COURSE DETAILS ERROR:', error);
            res.status(500).json({ message: 'Error fetching course details' });
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

    updateCourse: (req, res) => { /* Update logic based on UUID */ },
    togglePublish: (req, res) => { /* Visibility toggle logic */ },
};
