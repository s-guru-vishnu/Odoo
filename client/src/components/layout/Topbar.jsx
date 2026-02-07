import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bell, Search, Menu, User, LogOut, ChevronDown, CircleHelp as HelpCircle, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

const Topbar = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    const getInitials = (name) => {
        if (!name) return '??';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const fetchNotifications = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const role = user.role?.toUpperCase();

            // Try to fetch notifications/messages based on role
            // Admins fetch from /api/messages/admin, others from /api/messages/user
            const endpoint = (role === 'ADMIN') ? '/api/messages/admin' : '/api/messages/user';

            const response = await fetch(endpoint, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setNotifications(Array.isArray(data) ? data.slice(0, 5) : []);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [user]);

    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-neutral-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 transition-all">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="lg:hidden shrink-0" onClick={onMenuClick}>
                    <Menu className="h-6 w-6 text-neutral-600" />
                </Button>

                {/* Mobile Logo Visibility */}
                <div className="flex lg:hidden items-center gap-2 mr-2">
                    <Logo className="h-8 w-8" />
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                {/* Desktop Help Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/help')}
                    className="hidden sm:flex text-neutral-500 hover:text-primary rounded-full transition-colors"
                >
                    <HelpCircle className="h-5 w-5" />
                </Button>

                {/* Notifications */}
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setNotificationsOpen(!notificationsOpen)}
                        className={cn(
                            "relative text-neutral-500 hover:text-primary rounded-full transition-colors",
                            notificationsOpen && "bg-neutral-50 text-primary"
                        )}
                    >
                        <Bell className="h-5 w-5" />
                        {notifications.length > 0 && (
                            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-white"></span>
                        )}
                    </Button>

                    {/* Notifications Dropdown */}
                    {notificationsOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                                    <h3 className="text-sm font-bold text-neutral-900">Notifications</h3>
                                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px]">
                                        {notifications.length} New
                                    </Badge>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center">
                                            <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Bell className="h-6 w-6 text-neutral-300" />
                                            </div>
                                            <p className="text-sm text-neutral-500 font-medium">No new notifications</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-neutral-50">
                                            {notifications.map((notif) => (
                                                <div key={notif.id} className="p-4 hover:bg-neutral-50/50 transition-colors cursor-pointer group">
                                                    <div className="flex gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                                                            <CheckCircle className="h-4 w-4 text-primary" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-sm text-neutral-800 line-clamp-2 leading-snug">
                                                                <span className="font-bold">System:</span> {notif.content}
                                                            </p>
                                                            <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-medium">
                                                                <Clock className="w-3 h-3" />
                                                                {notif.created_at ? new Date(notif.created_at).toLocaleTimeString() : 'Recent'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 border-t border-neutral-100 text-center">
                                    <button
                                        onClick={() => {
                                            setNotificationsOpen(false);
                                            navigate('/assignments');
                                        }}
                                        className="text-xs font-bold text-primary hover:underline"
                                    >
                                        View all activities
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* User Profile Menu */}
                <div className="relative ml-2">
                    <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-200"
                    >
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-1 ring-primary/20">
                            {getInitials(user?.full_name || user?.name || 'Guest User')}
                        </div>
                        <span className="hidden sm:block text-sm font-medium text-neutral-700 truncate max-w-[100px]">
                            {user?.full_name?.split(' ')[0] || user?.name || 'User'}
                        </span>
                        <ChevronDown className={cn("h-4 w-4 text-neutral-400 transition-transform", userMenuOpen && "rotate-180")} />
                    </button>

                    {/* Dropdown Menu */}
                    {userMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-neutral-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-4 py-3 border-b border-neutral-100 mb-1">
                                    <p className="text-sm font-bold text-neutral-900 truncate">{user?.full_name || user?.name}</p>
                                    <p className="text-xs text-neutral-500 truncate mt-0.5">{user?.email}</p>
                                </div>

                                <Link
                                    to="/user/profile"
                                    onClick={() => setUserMenuOpen(false)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
                                >
                                    <User className="h-4 w-4" />
                                    My Profile
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export { Topbar };