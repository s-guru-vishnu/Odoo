import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Trophy, Book, ArrowRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../lib/utils';

const Quizzes = () => {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/learner/my-quizzes', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setQuizzes(data);
                }
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, []);

    const handleStartQuiz = (courseId, quizId, lessonId) => {
        if (lessonId) {
            navigate(`/course/${courseId}/lesson/${lessonId}`);
        } else {
            // Fallback: Navigate to the course page if no lesson link found
            navigate(`/courses/${courseId}`);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-neutral-900 mb-8">My Quizzes</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-neutral-100 animate-pulse rounded-3xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-neutral-900">
                        My <span className="text-primary">Quizzes</span>
                    </h1>
                    <p className="text-neutral-500">
                        Test your knowledge and earn points across your enrolled courses.
                    </p>
                </div>
            </div>

            {quizzes.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200 shadow-sm">
                    <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <HelpCircle className="w-10 h-10 text-neutral-300" />
                    </div>
                    <h2 className="text-xl font-semibold text-neutral-900">No quizzes available</h2>
                    <p className="text-neutral-500 mt-2 mb-8 max-w-sm mx-auto">
                        Quizzes will appear here once you enroll in courses that have assessments.
                    </p>
                    <Button onClick={() => navigate('/courses/explore')}>Browse Courses</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map((quiz) => (
                        <Card key={quiz.id} className="group hover:shadow-xl transition-all duration-300 border-neutral-200 rounded-3xl overflow-hidden">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                        <Book className="w-5 h-5" />
                                    </div>
                                    {quiz.score !== null ? (
                                        <Badge variant={quiz.score >= 70 ? "success" : "secondary"}>
                                            {quiz.score >= 70 ? 'Passed' : 'Try Again'}
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline">Not Started</Badge>
                                    )}
                                </div>
                                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                    {quiz.title}
                                </CardTitle>
                                <CardDescription className="text-neutral-500 font-medium">
                                    {quiz.course_title}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {quiz.score !== null && (
                                    <div className="bg-neutral-50 rounded-2xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                <Trophy className={cn("w-5 h-5", quiz.score >= 70 ? "text-yellow-500" : "text-neutral-400")} />
                                            </div>
                                            <div>
                                                <div className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Best Score</div>
                                                <div className="text-lg font-black text-neutral-900">{quiz.score}%</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Attempts</div>
                                            <div className="text-lg font-black text-neutral-900">{quiz.attempt_no}</div>
                                        </div>
                                    </div>
                                )}

                                <Button
                                    className="w-full h-12 rounded-2xl group-hover:gap-3 transition-all"
                                    onClick={() => handleStartQuiz(quiz.course_id, quiz.id, quiz.lesson_id)}
                                    variant={quiz.score >= 70 ? "outline" : "default"}
                                >
                                    {quiz.score >= 70 ? 'Review Quiz' : quiz.score !== null ? 'Try Again' : 'Start Quiz'}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Quizzes;
