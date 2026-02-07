import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, Star, Search, Play, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';
import Navbar from '../components/Navbar';

const CoursesPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                // Fetch courses
                let url = '/api/public/courses';
                const params = new URLSearchParams();
                if (searchQuery) params.append('search', searchQuery);

                if (params.toString()) url += `?${params.toString()}`;

                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    setCourses(data);
                }
            } catch (error) {
                console.error('Failed to fetch courses:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchCourses, 300);
        return () => clearTimeout(debounce);
    }, [searchQuery]);

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Navigation */}
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-12 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <motion.h1
                                className="text-4xl lg:text-5xl font-bold text-neutral-800 mb-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                All <span className="text-primary">Courses</span>
                            </motion.h1>
                            <p className="text-neutral-500">Explore {courses.length}+ courses from top instructors</p>
                        </div>

                        {/* Search */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-full border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Courses Grid */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-neutral-500">Loading courses...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {courses.map((course, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    whileHover={{ y: -8 }}
                                    className="bg-white rounded-3xl overflow-hidden shadow-lg border border-neutral-100 cursor-pointer group hover:border-primary/20 transition-all"
                                >
                                    {/* Course Image */}
                                    <div className="h-40 bg-neutral-100 relative grayscale group-hover:grayscale-0 transition-all duration-500 overflow-hidden">
                                        {course.image ? (
                                            <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                                <Zap className="w-10 h-10 text-primary/30" />
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                            <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                                        </div>
                                    </div>

                                    {/* Course Info */}
                                    <div className="p-5">
                                        <h3 className="font-bold text-neutral-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                            {course.title}
                                        </h3>
                                        <p className="text-sm text-neutral-500 mb-3">{course.instructor}</p>

                                        <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                                            <span className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                {course.rating}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                {(course.students / 1000).toFixed(1)}k
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {course.duration}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-bold text-primary">${course.price}</span>
                                            <Button size="sm" className="rounded-full px-4 bg-primary hover:bg-primary-hover shadow-md hover:shadow-primary/30">
                                                Enroll
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {!loading && courses.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-neutral-500 text-lg">No courses found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            {/* Footer */}
            <footer className="bg-neutral-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <Logo className="h-10 w-10 text-white" />
                                <span className="text-2xl font-bold">LearnSphere</span>
                            </div>
                            <p className="text-neutral-400 max-w-sm">
                                Empowering learners worldwide with quality education and career-focused courses.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-neutral-400">
                                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                                <li><Link to="/courses" className="hover:text-white transition-colors">Explore</Link></li>
                                <li><Link to="/community" className="hover:text-white transition-colors">Community</Link></li>
                                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-neutral-400">
                                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                                <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-neutral-800 pt-8 text-center text-neutral-400 text-sm">
                        &copy;2026 LearnSphere All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CoursesPage;
