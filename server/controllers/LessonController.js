const { getDb } = require('../config/db');

module.exports = {
    // Fetches all lessons for a specific course, ordered by lesson_order
    getLessonsByCourse: async (req, res) => {
        const { courseId } = req.params;
        try {
            const db = getDb();
            const result = await db.query(
                'SELECT * FROM lessons WHERE course_id = $1 ORDER BY lesson_order ASC',
                [courseId]
            );
            res.json(result.rows);
        } catch (error) {
            console.error('FETCH LESSONS ERROR:', error);
            res.status(500).json({ message: 'Error fetching lessons' });
        }
    },

    // Adds a new lesson to a course
    addLesson: async (req, res) => {
        const { courseId, title, type, content_url, duration, lesson_order } = req.body;

        // Basic type validation based on schema constraint
        const validTypes = ['VIDEO', 'DOCUMENT', 'IMAGE', 'QUIZ'];
        if (type && !validTypes.includes(type.toUpperCase())) {
            return res.status(400).json({ message: 'Invalid lesson type' });
        }

        try {
            const db = getDb();
            const result = await db.query(
                `INSERT INTO lessons (course_id, title, type, content_url, duration, lesson_order) 
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [courseId, title, type ? type.toUpperCase() : 'VIDEO', content_url, duration || 0, lesson_order || 0]
            );
            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('ADD LESSON ERROR:', error);
            res.status(500).json({ message: 'Error adding lesson' });
        }
    },

    updateLesson: (req, res) => { /* Update lesson logic */ },
    deleteLesson: (req, res) => { /* Delete lesson logic */ },
};
