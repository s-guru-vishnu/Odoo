import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './ui/Logo';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // Only handle scroll effect on landing page, others can be always solid
    const isLanding = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navBackground = isLanding && !isScrolled ? 'bg-transparent' : 'bg-white/90 backdrop-blur-xl shadow-sm';

    return (
        <motion.nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${navBackground}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/">
                        <motion.div
                            className="flex items-center gap-2"
                            whileHover={{ scale: 1.02 }}
                        >
                            <Logo className="h-10 w-10 text-primary" />
                            <span className="text-2xl font-bold text-primary">LearnSphere</span>
                        </motion.div>
                    </Link>

                    {/* Nav Links - Desktop */}
                    <div className="hidden md:flex items-center space-x-10">
                        <Link to="/" className={`font-medium transition-colors ${location.pathname === '/' ? 'text-primary' : 'text-neutral-600 hover:text-primary'}`}>Home</Link>
                        <Link to="/courses" className={`font-medium transition-colors ${location.pathname === '/courses' ? 'text-primary' : 'text-neutral-600 hover:text-primary'}`}>Explore</Link>
                        <Link to="/community" className={`font-medium transition-colors ${location.pathname === '/community' ? 'text-primary' : 'text-neutral-600 hover:text-primary'}`}>Community</Link>
                        <Link to="/contact" className={`font-medium transition-colors ${location.pathname === '/contact' ? 'text-primary' : 'text-neutral-600 hover:text-primary'}`}>Contact</Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-neutral-100 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                        {user.name ? user.name[0].toUpperCase() : 'U'}
                                    </div>
                                    <span className="font-medium text-neutral-700">{user.name}</span>
                                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                                </button>

                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-neutral-100 py-1 overflow-hidden"
                                        >
                                            <div className="px-4 py-2 border-b border-neutral-100">
                                                <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">{user.role}</p>
                                                <p className="text-sm text-neutral-600 truncate">{user.email}</p>
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-neutral-600 hover:text-primary font-medium transition-colors">
                                    Sign In
                                </Link>
                                <Link to="/register">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button className="rounded-full px-6 py-2.5 bg-primary hover:bg-primary-hover shadow-lg shadow-primary/30">
                                            Get Started
                                        </Button>
                                    </motion.div>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2 text-neutral-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-neutral-100 overflow-hidden"
                    >
                        <div className="px-6 py-6 space-y-4">
                            <Link to="/" className="block text-neutral-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                            <Link to="/courses" className="block text-neutral-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Explore</Link>
                            <Link to="/community" className="block text-neutral-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Community</Link>
                            <Link to="/contact" className="block text-neutral-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
                            <div className="pt-4 border-t border-neutral-100">
                                {user ? (
                                    <>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {user.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-medium text-neutral-800">{user.name}</p>
                                                <p className="text-xs text-neutral-400 capitalize">{user.role}</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="w-full justify-center text-rose-600 border-rose-200 hover:bg-rose-50" onClick={handleLogout}>
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <div className="space-y-3">
                                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                            <Button variant="outline" className="w-full justify-center">Sign In</Button>
                                        </Link>
                                        <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                                            <Button className="w-full justify-center bg-primary text-white">Get Started</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
