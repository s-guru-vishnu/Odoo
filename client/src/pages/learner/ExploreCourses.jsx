import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, BookOpen, Star, Clock, ArrowRight, CheckCircle2, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

const ExploreCourses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [myCourseIds, setMyCourseIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [enrollingId, setEnrollingId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');

                // 1. Fetch All Published Courses
                const allRes = await fetch('/api/learner/courses', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // 2. Fetch My Current Enrollments (to show "Already Enrolled")
                const myRes = await fetch('/api/learner/my-courses', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (allRes.ok && myRes.ok) {
                    const allData = await allRes.json();
                    const myData = await myRes.json();

                    setCourses(allData);
                    setMyCourseIds(new Set(myData.map(c => c.id)));
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleEnroll = async (courseId) => {
        setEnrollingId(courseId);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/learner/enroll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ courseId })
            });

            if (res.ok) {
                setMyCourseIds(prev => new Set([...prev, courseId]));
                // Optional: navigate to dashboard or show success
            }
        } catch (error) {
            console.error('Enroll error:', error);
        } finally {
            setEnrollingId(null);
        }
    };

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="space-y-8 p-6">
                <div className="h-10 w-64 bg-neutral-100 animate-pulse rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <Card key={i} className="h-80 bg-neutral-50 animate-pulse border-none rounded-3xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            {/* Hero Banner */}
            <div className="relative rounded-[2rem] overflow-hidden bg-primary p-12 text-white min-h-[300px] flex flex-col justify-center">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Award className="w-64 h-64" />
                </div>
                <div className="relative z-10 space-y-4 max-w-2xl">
                    <Badge variant="secondary" className="bg-white/20 text-white border-none italic font-medium px-4 py-1">
                        Explore Learning
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                        Transform Your <span className="text-highlight-mustard text-primary">Skillset</span>
                    </h1>
                    <p className="text-xl text-neutral-200">
                        Join 10,000+ students mastering modern technologies with expert-led courses.
                    </p>
                </div>
            </div>

            {/* toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-4 z-20 bg-neutral-50/80 backdrop-blur-md p-4 rounded-3xl border border-neutral-200/50 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                        placeholder="Search courses, skills, or topics..."
                        className="pl-12 h-14 rounded-2xl bg-white border-neutral-200 focus-visible:ring-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-2xl h-14 px-6 border-neutral-200 hover:bg-white shrink-0">
                        <Filter className="w-5 h-5 mr-2" /> Filters
                    </Button>
                </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => {
                    const isEnrolled = myCourseIds.has(course.id);
                    return (
                        <Card key={course.id} className="group hover:shadow-2xl transition-all duration-500 border-neutral-200 rounded-[2.5rem] overflow-hidden bg-white shadow-sm flex flex-col">
                            {/* Image Container */}
                            <div className="h-48 relative overflow-hidden">
                                <img
                                    src={course.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop'}
                                    alt={course.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                <div className="absolute top-4 right-4">
                                    <Badge className="bg-white/90 text-primary border-none shadow-sm backdrop-blur-sm">
                                        {course.price > 0 ? `₹${course.price}` : 'Free'}
                                    </Badge>
                                </div>
                            </div>

                            <CardHeader className="pb-2">
                                <CardTitle className="text-2xl font-black text-neutral-900 group-hover:text-primary transition-colors line-clamp-1">
                                    {course.title}
                                </CardTitle>
                                <div className="flex items-center gap-4 text-sm text-neutral-500 font-medium">
                                    <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> 12 Lessons</span>
                                    <span className="flex items-center gap-1 text-yellow-500"><Star className="w-4 h-4 fill-current" /> 4.9</span>
                                </div>
                            </CardHeader>

                            <CardContent className="flex-1">
                                <p className="text-neutral-500 line-clamp-2 text-sm leading-relaxed">
                                    {course.description || "Master these industry-standard skills with our deep-dive tutorial series designed for modern professionals."}
                                </p>
                            </CardContent>

                            <CardFooter className="pt-0 pb-8 px-8">
                                {isEnrolled ? (
                                    <Button
                                        className="w-full h-14 rounded-2xl bg-neutral-100 text-neutral-700 hover:bg-neutral-200 gap-2 border-none"
                                        onClick={() => navigate(`/courses/${course.id}`)}
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        Continue Learning
                                    </Button>
                                ) : (
                                    <Button
                                        className="w-full h-14 rounded-2xl group-hover:gap-3 transition-all shadow-lg hover:shadow-primary/25"
                                        onClick={() => handleEnroll(course.id)}
                                        disabled={enrollingId === course.id}
                                    >
                                        {enrollingId === course.id ? 'Enrolling...' : 'Enroll Now'}
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            {filteredCourses.length === 0 && (
                <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-neutral-200">
                    <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-10 h-10 text-neutral-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900">No courses match your search</h2>
                    <p className="text-neutral-500 mt-2">Try searching for different keywords or clear the filters.</p>
                </div>
            )}
        </div>
    );
};

export default ExploreCourses;
