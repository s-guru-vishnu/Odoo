import React, { useState, useEffect } from 'react';
import { Users, AlertCircle, CheckCircle, Save, Edit2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { BarChartComponent } from '../components/charts/BarChartComponent';

const AdminDashboard = () => {
    const [messages, setMessages] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchAllMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/messages/admin', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error('Error fetching admin messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllMessages();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/messages/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            fetchAllMessages();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const startEditing = (msg) => {
        setEditingId(msg.id);
        setEditContent(msg.content);
    };

    const handleSaveEdit = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/messages/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: editContent, status: 'edited' })
            });
            setEditingId(null);
            fetchAllMessages();
        } catch (error) {
            console.error('Error saving edit:', error);
        }
    };

    // Mock data for charts
    const chartData = [
        { name: 'Mon', tickets: 12 },
        { name: 'Tue', tickets: 19 },
        { name: 'Wed', tickets: 15 },
        { name: 'Thu', tickets: 22 },
        { name: 'Fri', tickets: 30 },
        { name: 'Sat', tickets: 10 },
        { name: 'Sun', tickets: 8 },
    ];

    const chartSeries = [{ key: 'tickets', name: 'Tickets Received' }];

    const pendingCount = messages.filter(m => m.status === 'pending').length;
    const resolvedCount = messages.filter(m => m.status === 'replied' || m.status === 'edited').length;

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-primary">
                    Admin <span className="text-highlight-teal">Overview</span>
                </h1>
                <p className="text-neutral-500">Manage user messages and system status.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Tickets"
                    value={messages.length}
                    icon={Users}
                    moduleColor="crm" // Blue
                    trend="up"
                    trendValue="8%"
                />
                <StatCard
                    title="Pending Action"
                    value={pendingCount}
                    icon={AlertCircle}
                    moduleColor="inventory" // Orange
                />
                <StatCard
                    title="Resolved"
                    value={resolvedCount}
                    icon={CheckCircle}
                    moduleColor="finance" // Green/Purple
                    trend="up"
                    trendValue="15%"
                />
            </div>

            <BarChartComponent
                title="Weekly Ticket Volume"
                data={chartData}
                dataKey="name"
                series={chartSeries}
                moduleName="finance"
            />

            <Card>
                <CardHeader>
                    <CardTitle>All User Messages</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-center py-8 text-neutral-500">Loading messages...</p>
                    ) : messages.length === 0 ? (
                        <p className="text-center py-8 text-neutral-500">No messages found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-neutral-500 uppercase bg-neutral-50 border-b border-neutral-200">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">User</th>
                                        <th className="px-6 py-3 font-medium">Content</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                        <th className="px-6 py-3 font-medium">Time</th>
                                        <th className="px-6 py-3 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {messages.map((msg) => (
                                        <tr key={msg.id} className="bg-white hover:bg-primary/5 transition-colors">
                                            <td className="px-6 py-4 font-medium text-neutral-900">{msg.sender_name}</td>
                                            <td className="px-6 py-4">
                                                {editingId === msg.id ? (
                                                    <textarea
                                                        className="w-full rounded-md border-neutral-300 text-sm focus:ring-primary"
                                                        value={editContent}
                                                        onChange={(e) => setEditContent(e.target.value)}
                                                        rows={2}
                                                    />
                                                ) : (
                                                    <span className="text-neutral-600">{msg.content}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={
                                                    msg.status === 'replied' ? 'success' :
                                                        msg.status === 'active' ? 'default' :
                                                            msg.status === 'edited' ? 'success' : 'warning'
                                                }>
                                                    {msg.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-neutral-500">
                                                {new Date(msg.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 space-x-2">
                                                <div className="flex items-center gap-2">
                                                    {editingId === msg.id ? (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleSaveEdit(msg.id)}
                                                            className="h-8 bg-green-600 hover:bg-green-700 text-white"
                                                        >
                                                            <Save className="h-3 w-3 mr-1" /> Save
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={() => startEditing(msg)}
                                                            className="h-8"
                                                        >
                                                            <Edit2 className="h-3 w-3 mr-1" /> Edit
                                                        </Button>
                                                    )}

                                                    <select
                                                        className="h-8 rounded-md border-neutral-200 bg-white text-xs text-neutral-600 focus:border-primary focus:ring-primary"
                                                        value={msg.status}
                                                        onChange={(e) => handleUpdateStatus(msg.id, e.target.value)}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="edited">Edited</option>
                                                        <option value="replied">Replied</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminDashboard;
