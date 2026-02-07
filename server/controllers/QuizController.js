const { getDb } = require('../config/db');

module.exports = {
    // Fetches quiz details including questions and options
    getQuizDetails: async (req, res) => {
        const { quizId } = req.params;
        try {
            const db = getDb();

            // 1. Get Quiz info
            const quizRes = await db.query('SELECT * FROM quizzes WHERE id = $1', [quizId]);
            if (quizRes.rows.length === 0) {
                return res.status(404).json({ message: 'Quiz not found' });
            }

            // 2. Get Questions
            const questionsRes = await db.query('SELECT * FROM quiz_questions WHERE quiz_id = $1', [quizId]);
            const questions = questionsRes.rows;

            // 3. Get Options for each question
            for (let question of questions) {
                const optionsRes = await db.query('SELECT * FROM quiz_options WHERE question_id = $1', [question.id]);
                question.options = optionsRes.rows;
            }

            res.json({
                ...quizRes.rows[0],
                questions
            });
        } catch (error) {
            console.error('FETCH QUIZ DETAILS ERROR:', error);
            res.status(500).json({ message: 'Error fetching quiz details' });
        }
    },

    submitAttempt: async (req, res) => {
        // This would call the stored procedure sp_submit_quiz_attempt
    }
};
