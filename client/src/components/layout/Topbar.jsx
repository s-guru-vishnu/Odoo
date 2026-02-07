import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';

const Topbar = ({ onMenuClick }) => {
    const { user } = useAuth();

    const getInitials = (name) => {
        if (!name) return '??';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
                    <Menu className="h-6 w-6" />
                </Button>

                <div className="hidden md:flex items-center gap-2 w-96">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <Input
                            placeholder="Search..."
                            className="pl-10 bg-neutral-50 border-transparent focus:bg-white focus:border-primary/20"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative text-neutral-500 hover:text-primary">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-white"></span>
                </Button>

                {/* User Profile Section */}
                {user && (
                    <div className="flex items-center gap-3 pl-4 border-l border-neutral-200">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {getInitials(user?.full_name || user?.name)}
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-sm font-medium text-neutral-900 truncate max-w-[120px]">
                                {user?.full_name || user?.name || 'Guest'}
                            </p>
                            <p className="text-xs text-neutral-500 capitalize">
                                {user?.role || 'User'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export { Topbar };
