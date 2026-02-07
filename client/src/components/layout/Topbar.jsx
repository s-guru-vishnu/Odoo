import React, { useState } from 'react';
import { Bell, Search, Menu, User, LogOut, ChevronDown, CircleHelp as HelpCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

const Topbar = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const getInitials = (name) => {
        if (!name) return '??';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

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

                <div className="hidden md:flex items-center gap-2 w-72 lg:w-96">
                    <div className="relative w-full group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search courses, lessons..."
                            className="pl-10 h-10 bg-neutral-50/50 border-neutral-200 rounded-xl focus:bg-white focus:ring-primary/10 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                {/* Desktop Help Button */}
                <Button variant="ghost" size="icon" className="hidden sm:flex text-neutral-500 hover:text-primary rounded-full">
                    <HelpCircle className="h-5 w-5" />
                </Button>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative text-neutral-500 hover:text-primary rounded-full">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-white"></span>
                </Button>

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

                                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">
                                    <User className="h-4 w-4" />
                                    My Profile
                                </button>

                                <button
                                    onClick={logout}
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

