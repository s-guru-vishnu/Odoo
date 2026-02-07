import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
    PlayCircle,
    FileText,
    Image as ImageIcon,
    HelpCircle,
    CheckCircle2,
    Circle,
    Menu,
    X,
    Download,
    ArrowLeft,
    MonitorPlay,
    BookOpen
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Logo } from '../../components/ui/Logo';

// Mock Data for the Lesson Player
const MOCK_COURSE = {
    id: 'c1',
    title: "Mastering Modern Business Strategy",
    instructor: "Sarah Jenkins",
    totalLessons: 5,
    lessons: [
        {
            id: 'l1',
            title: "Introduction to Strategy",
            type: 'video',
            description: "Learn the fundamentals of business strategy and why it matters in today's market.",
            content: "https://www.w3schools.com/html/mov_bbb.mp4",
            duration: "10:24",
            attachments: [
                { id: 'a1', name: "Strategy_Intro_Slides.pdf", size: "2.4 MB" }
            ]
        },
        {
            id: 'l2',
            title: "The 5-Step Process",
            type: 'document',
            description: "A detailed breakdown of our proprietary 5-step strategy formulation process.",
            content: "### Strategic Framework\n1. Analysis\n2. Goal Setting\n3. Selection\n4. Implementation\n5. Monitoring",
            duration: "15 min read",
            attachments: []
        },
        {
            id: 'l3',
            title: "Visualizing Success",
            type: 'image',
            description: "An infographic showing the evolution of successful strategy deployments.",
            content: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
            duration: "5 min view",
            attachments: [
                { id: 'a2', name: "Success_Infographic_Full.jpg", size: "1.2 MB" }
            ]
        },
        {
            id: 'l4',
            title: "Strategy Assessment Quiz",
            type: 'quiz',
            description: "Test your knowledge on the core concepts covered so far.",
            quizData: {
                questionsCount: 10,
                estimatedTime: "15 min",
                passingScore: 70
            },
            attachments: []
        },
        {
            id: 'l5',
            title: "Final Case Study",
            type: 'video',
            description: "A real-world case study of a strategy turnaround in a Fortune 500 company.",
            content: "https://www.w3schools.com/html/movie.mp4",
            duration: "25:15",
            attachments: [
                { id: 'a3', name: "Case_Study_Data.xlsx", size: "0.8 MB" }
            ]
        }
    ]
};

const LessonPlayer = () => {
    const navigate = useNavigate();
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [completedLessons, setCompletedLessons] = useState(new Set(['l1'])); // Mock l1 as completed
    const [quizStarted, setQuizStarted] = useState(false);

    const currentLesson = MOCK_COURSE.lessons[currentLessonIndex];
    const isFirstLesson = currentLessonIndex === 0;
    const isLastLesson = currentLessonIndex === MOCK_COURSE.lessons.length - 1;

    // Calculate progress
    const progressPercentage = useMemo(() => {
        return Math.round((completedLessons.size / MOCK_COURSE.lessons.length) * 100);
    }, [completedLessons]);

    const handleLessonSelect = (index) => {
        setCurrentLessonIndex(index);
        setQuizStarted(false);
        // On mobile, close sidebar when a lesson is selected
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    };

    const handleNext = () => {
        if (currentLessonIndex < MOCK_COURSE.lessons.length - 1) {
            setCurrentLessonIndex(prev => prev + 1);
            setQuizStarted(false);
        }
    };

    const handleBack = () => {
        if (currentLessonIndex > 0) {
            setCurrentLessonIndex(prev => prev - 1);
            setQuizStarted(false);
        }
    };

    const toggleCompletion = (lessonId) => {
        const newCompleted = new Set(completedLessons);
        if (newCompleted.has(lessonId)) {
            newCompleted.delete(lessonId);
        } else {
            newCompleted.add(lessonId);
        }
        setCompletedLessons(newCompleted);
    };

    const getLessonIcon = (type) => {
        switch (type) {
            case 'video': return <PlayCircle className="h-4 w-4" />;
            case 'document': return <FileText className="h-4 w-4" />;
            case 'image': return <ImageIcon className="h-4 w-4" />;
            case 'quiz': return <HelpCircle className="h-4 w-4" />;
            default: return <BookOpen className="h-4 w-4" />;
        }
    };

    return (
        <div className="flex h-screen bg-neutral-900 text-white overflow-hidden">
            {/* --- Sidebar --- */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-80 bg-neutral-900 border-r border-neutral-800 transition-transform duration-300 lg:relative lg:translate-x-0",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Course Header */}
                    <div className="p-6 border-b border-neutral-800">
                        <div className="flex items-center justify-between mb-4">
                            <Link to="/user/dashboard" className="text-neutral-400 hover:text-white transition-colors">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <Logo className="h-8 w-8 grayscale brightness-200" />
                            <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <h2 className="text-lg font-bold leading-tight mb-4">{MOCK_COURSE.title}</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-neutral-400">
                                <span>Course Progress</span>
                                <span>{progressPercentage}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Lesson List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                        {MOCK_COURSE.lessons.map((lesson, index) => {
                            const isActive = index === currentLessonIndex;
                            const isCompleted = completedLessons.has(lesson.id);

                            return (
                                <div key={lesson.id} className="group">
                                    <button
                                        onClick={() => handleLessonSelect(index)}
                                        className={cn(
                                            "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200",
                                            isActive
                                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg",
                                            isActive ? "bg-white/20" : "bg-neutral-800"
                                        )}>
                                            {isCompleted ? (
                                                <CheckCircle2 className={cn("h-5 w-5", isActive ? "text-white" : "text-primary")} />
                                            ) : (
                                                <span className="text-xs font-semibold">{index + 1}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm font-medium truncate">{lesson.title}</p>
                                            <div className="flex items-center gap-2 mt-1 opacity-70">
                                                {getLessonIcon(lesson.type)}
                                                <span className="text-[10px] uppercase tracking-wider">{lesson.duration}</span>
                                            </div>
                                        </div>
                                    </button>

                                    {/* Sidebar Attachments (Nested) */}
                                    {isActive && lesson.attachments?.length > 0 && (
                                        <div className="mt-2 ml-10 space-y-1">
                                            {lesson.attachments.map(att => (
                                                <button
                                                    key={att.id}
                                                    className="flex items-center gap-2 text-xs text-neutral-500 hover:text-primary transition-colors py-1"
                                                >
                                                    <Download className="h-3 w-3" />
                                                    <span className="truncate">{att.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </aside>

            {/* --- Main Content Area --- */}
            <main className="flex-1 flex flex-col h-full bg-neutral-950/50 relative overflow-hidden">
                {/* Top Nav (Mobile & Desktop Sidebar Toggle) */}
                <header className="h-16 flex items-center justify-between px-6 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md z-40">
                    <div className="flex items-center gap-4">
                        {!isSidebarOpen && (
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                            >
                                <Menu className="h-5 w-5 text-neutral-400" />
                            </button>
                        )}
                        <h1 className="text-base font-semibold text-neutral-200 truncate hidden sm:block">
                            {currentLesson.title}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="border-neutral-700 text-neutral-400">
                            {currentLesson.type.toUpperCase()}
                        </Badge>
                        <button
                            onClick={() => toggleCompletion(currentLesson.id)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                                completedLessons.has(currentLesson.id)
                                    ? "bg-primary/20 text-primary border border-primary/50"
                                    : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:border-neutral-500"
                            )}
                        >
                            {completedLessons.has(currentLesson.id) ? (
                                <><CheckCircle2 className="h-3.5 w-3.5" /> Completed</>
                            ) : (
                                <><Circle className="h-3.5 w-3.5" /> Mark as Done</>
                            )}
                        </button>
                    </div>
                </header>

                {/* Content Viewer Section */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {/* Lesson Description Banner */}
                    <div className="bg-neutral-900/30 p-8 border-b border-neutral-800/50">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold mb-3 text-white">
                                {currentLesson.title}
                            </h2>
                            <p className="text-neutral-400 leading-relaxed font-light">
                                {currentLesson.description}
                            </p>
                        </div>
                    </div>

                    {/* Media Viewer */}
                    <div className="p-6 sm:p-12">
                        <div className="max-w-5xl mx-auto aspect-video bg-black rounded-2xl shadow-2xl overflow-hidden border border-neutral-800 relative group">
                            {currentLesson.type === 'video' && (
                                <video
                                    key={currentLesson.content}
                                    controls
                                    className="w-full h-full object-contain"
                                    poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200"
                                >
                                    <source src={currentLesson.content} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}

                            {currentLesson.type === 'document' && (
                                <div className="w-full h-full bg-neutral-900 flex flex-col p-10 overflow-y-auto">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-3 bg-primary/20 rounded-xl">
                                            <FileText className="h-8 w-8 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">Concept Guide</h3>
                                            <p className="text-sm text-neutral-500">Read the detailed overview below</p>
                                        </div>
                                    </div>
                                    <div className="prose prose-invert max-w-none">
                                        <pre className="text-neutral-300 font-sans whitespace-pre-wrap leading-relaxed">
                                            {currentLesson.content}
                                        </pre>
                                    </div>
                                </div>
                            )}

                            {currentLesson.type === 'image' && (
                                <img
                                    src={currentLesson.content}
                                    alt={currentLesson.title}
                                    className="w-full h-full object-contain"
                                />
                            )}

                            {currentLesson.type === 'quiz' && (
                                <div className="w-full h-full bg-neutral-900 flex items-center justify-center p-8">
                                    {!quizStarted ? (
                                        <div className="text-center max-w-md">
                                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <HelpCircle className="h-10 w-10 text-primary" />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-2">Ready to test your skills?</h3>
                                            <p className="text-neutral-400 mb-8"> This quiz covers the core concepts of strategy management. You need a 70% to pass.</p>
                                            <div className="grid grid-cols-2 gap-4 mb-8">
                                                <div className="bg-neutral-800/50 p-3 rounded-xl">
                                                    <p className="text-xs text-neutral-500 uppercase">Questions</p>
                                                    <p className="font-bold">{currentLesson.quizData.questionsCount}</p>
                                                </div>
                                                <div className="bg-neutral-800/50 p-3 rounded-xl">
                                                    <p className="text-xs text-neutral-500 uppercase">Time</p>
                                                    <p className="font-bold">{currentLesson.quizData.estimatedTime}</p>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() => setQuizStarted(true)}
                                                className="w-full text-lg h-12"
                                            >
                                                Start Quiz
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                                            <p className="text-neutral-400">Loading Quiz Module...</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Attachments Section (Bottom) */}
                        {currentLesson.attachments?.length > 0 && (
                            <div className="max-w-5xl mx-auto mt-12 mb-20">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Download className="h-5 w-5 text-neutral-500" />
                                    Lesson Resources
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {currentLesson.attachments.map(att => (
                                        <div key={att.id} className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl flex items-center gap-4 hover:border-primary/50 transition-colors group cursor-pointer">
                                            <div className="h-10 w-10 bg-neutral-800 rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                <FileText className="h-5 w-5 text-neutral-500 group-hover:text-primary" />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-sm font-medium truncate">{att.name}</p>
                                                <p className="text-[10px] text-neutral-500 uppercase">{att.size}</p>
                                            </div>
                                            <Download className="h-4 w-4 text-neutral-600" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Navigation Actions */}
                <footer className="h-20 bg-neutral-900/80 backdrop-blur-xl border-t border-neutral-800 px-6 sm:px-12 flex items-center justify-between z-40">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/learner/dashboard')}
                        className="text-neutral-400 hover:text-white"
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Exit Course
                    </Button>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="secondary"
                            onClick={handleBack}
                            disabled={isFirstLesson}
                            className="bg-neutral-800 hover:bg-neutral-700 border-none px-6"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>

                        {isLastLesson ? (
                            <Button
                                className="px-8 font-bold bg-accent-mustard hover:bg-accent-mustard/80 text-primary-foreground"
                                onClick={() => navigate('/learner/dashboard')}
                            >
                                Complete Course
                            </Button>
                        ) : (
                            <Button
                                onClick={handleNext}
                                className="px-8 font-bold"
                            >
                                Next Lesson
                                <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                        )}
                    </div>
                </footer>
            </main>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #262626;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #404040;
                }
            `}} />
        </div>
    );
};

export default LessonPlayer;
