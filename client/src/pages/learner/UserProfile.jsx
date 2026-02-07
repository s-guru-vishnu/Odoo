import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/StatCard';
import { Trophy, Star, Shield, TrendingUp } from 'lucide-react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { subDays } from 'date-fns';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/learner/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    setProfile(await res.json());
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading profile...</div>;
    if (!profile) return <div className="p-8 text-center text-red-500">Failed to load profile.</div>;

    const { user, totalPoints, currentBadge, nextBadge, progress, badges } = profile;

    return (
        <div className="space-y-8 animate-in fade-in">
            {/* Header / Identity */}
            <div className="bg-white rounded-3xl p-8 text-neutral-900 flex flex-col md:flex-row items-center gap-8 shadow-sm border border-neutral-200">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-primary/20 bg-neutral-100 flex items-center justify-center text-4xl font-bold text-primary">
                        {user.full_name ? user.full_name[0] : 'U'}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold border-2 border-white shadow-sm">
                        Lvl {Math.floor(totalPoints / 100) + 1}
                    </div>
                </div>

                <div className="text-center md:text-left flex-1">
                    <h1 className="text-3xl font-bold mb-2 tracking-tight text-neutral-900">{user.full_name}</h1>
                    <p className="text-neutral-500 mb-6 font-normal">{user.email}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                            <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Total Points</p>
                            <p className="text-2xl font-bold text-primary mt-1">{totalPoints}</p>
                        </div>
                        <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                            <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Current Rank</p>
                            <p className="text-xl font-bold text-yellow-500 mt-1">{currentBadge.name}</p>
                        </div>
                        <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 md:col-span-2 relative overflow-hidden group">
                            <div className="flex justify-between text-[10px] text-neutral-500 uppercase tracking-wider font-semibold mb-2">
                                <span>Next: {nextBadge ? nextBadge.name : 'Max Level'}</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                                <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${progress}%` }} />
                            </div>
                            <p className="text-[10px] text-neutral-400 mt-2 text-right">
                                {nextBadge ? `${nextBadge.min_points - totalPoints} PTS` : 'Maximum rank achieved!'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity Heatmap */}
            <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-3 text-neutral-900">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                        Learning Activity
                    </h2>
                    <div className="flex items-center gap-3 text-xs text-neutral-400 font-medium">
                        <span>Less</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-[2px] bg-neutral-100"></div>
                            <div className="w-3 h-3 rounded-[2px] bg-primary/30"></div>
                            <div className="w-3 h-3 rounded-[2px] bg-primary/50"></div>
                            <div className="w-3 h-3 rounded-[2px] bg-primary/70"></div>
                            <div className="w-3 h-3 rounded-[2px] bg-primary"></div>
                        </div>
                        <span>More</span>
                    </div>
                </div>

                <div className="overflow-x-auto pb-2">
                    <div className="min-w-[800px]">
                        <CalendarHeatmap
                            startDate={subDays(new Date(), 365)}
                            endDate={new Date()}
                            values={profile.activityLog || []}
                            classForValue={(value) => {
                                if (!value || value.count === 0) {
                                    return 'color-empty';
                                }
                                if (value.count >= 4) return 'color-scale-4';
                                if (value.count >= 3) return 'color-scale-3';
                                if (value.count >= 2) return 'color-scale-2';
                                return 'color-scale-1';
                            }}
                            tooltipDataAttrs={value => {
                                if (!value || !value.date) return null;
                                return {
                                    'title': `${value.date}: ${value.count || 0} activities`,
                                };
                            }}
                            showWeekdayLabels={true}
                        />
                    </div>
                </div>
                <style>{`
                    .react-calendar-heatmap text {
                        font-size: 10px;
                        fill: #737373; /* neutral-500 */
                        opacity: 0.8;
                    }
                    .react-calendar-heatmap .react-calendar-heatmap-weekday-labels {
                        transform: translate(0, 10px);
                    }
                    .react-calendar-heatmap rect {
                        rx: 3px;
                        transition: all 0.2s;
                    }
                    .react-calendar-heatmap rect:hover {
                        stroke: #000;
                        stroke-width: 1px;
                        stroke-opacity: 0.1;
                    }
                    .react-calendar-heatmap .color-empty {
                        fill: #f5f5f5; /* neutral-100 */
                    }
                    .react-calendar-heatmap .color-scale-1 {
                        fill: rgba(34, 197, 94, 0.3); /* primary/30 */
                    }
                    .react-calendar-heatmap .color-scale-2 {
                        fill: rgba(34, 197, 94, 0.5); /* primary/50 */
                    }
                    .react-calendar-heatmap .color-scale-3 {
                        fill: rgba(34, 197, 94, 0.8); /* primary/80 */
                    }
                    .react-calendar-heatmap .color-scale-4 {
                        fill: rgb(34, 197, 94); /* primary */
                    }
                `}</style>
            </div>

            {/* Badges Section */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-neutral-900">Achievements & Badges</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {profile.badges && profile.badges.map((badge) => {
                        const isUnlocked = totalPoints >= badge.min_points;
                        return (
                            <Card key={badge.id} className={`text-center transition-all ${isUnlocked ? 'border-primary/50 bg-primary/5' : 'opacity-50 grayscale bg-neutral-100'}`}>
                                <CardContent className="pt-6 flex flex-col items-center">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isUnlocked ? 'bg-yellow-400/20 text-yellow-500' : 'bg-neutral-200 text-neutral-400'}`}>
                                        <Trophy className="h-8 w-8" />
                                    </div>
                                    <h3 className="font-bold text-sm mb-1 text-neutral-900">{badge.name}</h3>
                                    <p className="text-xs text-neutral-500">{badge.min_points} PTS</p>
                                    {isUnlocked && <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700 text-[10px]">Unlocked</Badge>}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
