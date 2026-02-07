import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { BarChartComponent } from '../components/charts/BarChartComponent';

const UserDashboard = () => {
    const [messages, setMessages] = useState([]);
    const [newChat, setNewChat] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/messages/user', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setMessages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newChat.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/messages/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: newChat })
            });

            if (response.ok) {
                setNewChat('');
                fetchMessages();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Mock data for charts
    const chartData = [
        { name: 'Mon', messages: 4 },
        { name: 'Tue', messages: 3 },
        { name: 'Wed', messages: 7 },
        { name: 'Thu', messages: 2 },
        { name: 'Fri', messages: 6 },
        { name: 'Sat', messages: 1 },
        { name: 'Sun', messages: 3 },
    ];

    const chartSeries = [{ key: 'messages', name: 'Messages Sent' }];

    const pendingCount = messages.filter(m => m.status === 'pending').length;
    const resolvedCount = messages.filter(m => m.status === 'replied' || m.status === 'edited').length;

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-primary">
                    User <span className="text-highlight-mustard">Dashboard</span>
                </h1>
                <p className="text-neutral-500">Welcome back! Here's an overview of your activity.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Messages"
                    value={messages.length}
                    icon={MessageSquare}
                    trend="up"
                    trendValue="12%"
                />
                <StatCard
                    title="Pending Responses"
                    value={pendingCount}
                    icon={Clock}
                    moduleColor="inventory" // Orange for pending/warning feel
                />
                <StatCard
                    title="Resolved Queries"
                    value={resolvedCount}
                    icon={CheckCircle}
                    moduleColor="finance" // Green/Purple for success
                    trend="up"
                    trendValue="5%"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Send Message & Chart */}
                <div className="lg:col-span-2 space-y-8">
                    <BarChartComponent
                        title="Your Activity"
                        data={chartData}
                        dataKey="name"
                        series={chartSeries}
                        moduleName="crm"
                    />

                    <Card>
                        <CardHeader>
                            <CardTitle>Send Message to Admin</CardTitle>
                            <CardDescription>We usually reply within 24 hours.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSendMessage} className="space-y-4">
                                <div className="space-y-2">
                                    <textarea
                                        className="flex min-h-[120px] w-full rounded-md border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm ring-offset-background placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Type your message here..."
                                        value={newChat}
                                        onChange={(e) => setNewChat(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full sm:w-auto">
                                    <Send className="mr-2 h-4 w-4" /> Send Message
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Message History */}
                <div className="lg:col-span-1">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Recent Messages</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <p className="text-neutral-500 text-center py-4">Loading messages...</p>
                            ) : messages.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="h-12 w-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <MessageSquare className="h-6 w-6 text-neutral-400" />
                                    </div>
                                    <p className="text-neutral-500">No messages yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-primary/20 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <Badge variant={
                                                    msg.status === 'replied' ? 'success' :
                                                        msg.status === 'edited' ? 'success' : 'warning'
                                                }>
                                                    {msg.status}
                                                </Badge>
                                                <span className="text-xs text-neutral-400">
                                                    {new Date(msg.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-neutral-700 line-clamp-3">{msg.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
