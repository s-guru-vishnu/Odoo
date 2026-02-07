const { getDb } = require('../config/db');

module.exports = {
    // Fetches all quizzes for courses the user is enrolled in
    getMyQuizzes: async (req, res) => {
        try {
            const db = getDb();
            const userId = req.user.id;

            const query = `
                SELECT 
                    q.id, 
                    q.title, 
                    c.title as course_title,
                    c.id as course_id,
                    l.id as lesson_id,
                    qa.score,
                    qa.attempt_no,
                    qa.attempted_at
                FROM quizzes q
                JOIN courses c ON q.course_id = c.id
                JOIN enrollments e ON e.course_id = c.id
                LEFT JOIN lessons l ON l.content_url = q.id::text AND l.type = 'QUIZ'
                LEFT JOIN (
                    SELECT DISTINCT ON (quiz_id) * 
                    FROM quiz_attempts 
                    WHERE user_id = $1 
                    ORDER BY quiz_id, score DESC, attempted_at DESC
                ) qa ON qa.quiz_id = q.id
                WHERE e.user_id = $1 AND c.published = true
                ORDER BY qa.attempted_at DESC NULLS LAST
            `;

            const result = await db.query(query, [userId]);
            res.json(result.rows);
        } catch (error) {
            console.error('GET MY QUIZZES ERROR:', error);
            res.status(500).json({ message: 'Error fetching quizzes' });
        }
    },

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
        const { quizId } = req.params;
        const { answers } = req.body; // e.g., { questionId: optionId, ... }
        const userId = req.user.id;

        try {
            const db = getDb();

            // 1. Calculate Score
            let score = 0;
            const questionsRes = await db.query('SELECT id FROM quiz_questions WHERE quiz_id = $1', [quizId]);
            const questions = questionsRes.rows;
            const totalQuestions = questions.length;

            if (totalQuestions === 0) {
                return res.status(400).json({ message: 'Quiz has no questions' });
            }

            for (const q of questions) {
                const userOptionId = answers[q.id];
                if (userOptionId) {
                    const correctRes = await db.query(
                        'SELECT is_correct FROM quiz_options WHERE id = $1 AND question_id = $2',
                        [userOptionId, q.id]
                    );
                    if (correctRes.rows.length > 0 && correctRes.rows[0].is_correct) {
                        score++;
                    }
                }
            }

            // Normalize score (e.g., to percentage or raw)
            // Stored procedure expects an integer score. Let's assume raw score or percentage?
            // "score INT" in table. Let's use percentage for now or raw?
            // Prompt says "Calculates score". 
            // Let's use raw score for now, but usually it's % for passing.
            // Wait, schema says "score INT".
            let correctCount = 0;
            const breakdown = [];
            for (const q of questions) {
                const userOptionId = answers[q.id];
                let isCorrect = false;
                if (userOptionId) {
                    const correctRes = await db.query(
                        'SELECT is_correct FROM quiz_options WHERE id = $1 AND question_id = $2',
                        [userOptionId, q.id]
                    );
                    if (correctRes.rows.length > 0 && correctRes.rows[0].is_correct) {
                        correctCount++;
                        isCorrect = true;
                    }
                }
                breakdown.push({
                    questionId: q.id,
                    isCorrect,
                    userOptionId
                });
            }

            const finalScore = Math.round((correctCount / totalQuestions) * 100);
            await db.query('CALL sp_submit_quiz_attempt($1, $2, $3)', [userId, quizId, finalScore]);

            if (finalScore >= 70) {
                const lessonRes = await db.query(
                    "SELECT id FROM lessons WHERE type = 'QUIZ' AND content_url = $1",
                    [quizId]
                );

                if (lessonRes.rows.length > 0) {
                    const lessonId = lessonRes.rows[0].id;
                    await db.query(`
                        INSERT INTO lesson_progress (user_id, lesson_id, completed, completed_at)
                        VALUES ($1, $2, true, now())
                        ON CONFLICT (user_id, lesson_id) 
                        DO UPDATE SET completed = true, completed_at = now()
                    `, [userId, lessonId]);
                }
            }

            res.json({
                score: finalScore,
                passed: finalScore >= 70,
                totalQuestions,
                correctCount: correctCount,
                breakdown
            });

        } catch (error) {
            console.error('SUBMIT QUIZ ERROR:', error);
            res.status(500).json({ message: 'Error submitting quiz' });
        }
    }
};
