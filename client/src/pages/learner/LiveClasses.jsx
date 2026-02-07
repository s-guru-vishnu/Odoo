import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Calendar, Clock, Video, Users, CheckCircle } from 'lucide-react';

const LiveClasses = () => {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/live-classes', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setSessions(await res.json());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-neutral-500">Loading sessions...</div>;

    return (
        <div className="h-[calc(100vh-200px)] flex items-center justify-center animate-in fade-in duration-700">
            <div className="max-w-2xl w-full text-center px-6">
                <div className="relative inline-block mb-8">
                    {/* Animated Glow Background */}
                    <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse"></div>

                    <div className="relative bg-white p-8 rounded-[40px] shadow-2xl border border-neutral-100 flex items-center justify-center">
                        <Video className="w-16 h-16 text-primary animate-bounce shadow-xl" strokeWidth={1.5} />
                    </div>

                    {/* Floating Icons for Aesthetic */}
                    <div className="absolute -top-4 -right-4 bg-accent-mustard p-3 rounded-2xl shadow-lg rotate-12 animate-in slide-in-from-bottom-2">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -bottom-4 -left-4 bg-primary p-3 rounded-2xl shadow-lg -rotate-12 animate-in slide-in-from-top-2">
                        <Clock className="w-6 h-6 text-white" />
                    </div>
                </div>

                <div className="space-y-4">
                    <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 text-sm font-black uppercase tracking-[0.2em]">
                        Coming Soon
                    </Badge>
                    <h1 className="text-5xl md:text-6xl font-black text-neutral-900 tracking-tight leading-none">
                        Interactive <span className="text-primary italic">Live</span> Classes
                    </h1>
                    <p className="text-xl text-neutral-500 max-w-lg mx-auto font-medium leading-relaxed">
                        We're building a seamless real-time learning experience. Connect with top mentors and learn in sync.
                    </p>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" className="h-14 px-10 rounded-full text-lg font-bold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90">
                        Get Notified
                    </Button>
                    <Button variant="outline" size="lg" className="h-14 px-10 rounded-full text-lg font-bold border-neutral-200 hover:bg-neutral-50" onClick={() => navigate('/user/dashboard')}>
                        Explore Dashboard
                    </Button>
                </div>

                <div className="mt-16 grid grid-cols-3 gap-8 border-t border-neutral-100 pt-12 max-w-md mx-auto">
                    <div className="text-center">
                        <div className="text-2xl font-black text-neutral-900">4K</div>
                        <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Streaming</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-neutral-900">Real-time</div>
                        <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Chat</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-neutral-900">Screen</div>
                        <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Sharing</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveClasses;
