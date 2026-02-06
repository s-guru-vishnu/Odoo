import React, { useState, useEffect } from 'react';

const UserDashboard = () => {
    const [messages, setMessages] = useState([]);
    const [newChat, setNewChat] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/messages/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setMessages(data);
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

    return (
        <div className="container">
            <h1>User Dashboard</h1>
            <div className="dashboard-grid">
                <div className="card">
                    <h3>Send Message to Admin</h3>
                    <form onSubmit={handleSendMessage}>
                        <div className="form-group">
                            <textarea
                                rows="4"
                                placeholder="Type your message here..."
                                value={newChat}
                                onChange={(e) => setNewChat(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <button type="submit">Send Message</button>
                    </form>
                </div>

                <div className="card">
                    <h3>My Messages</h3>
                    {loading ? (
                        <p>Loading messages...</p>
                    ) : messages.length === 0 ? (
                        <p>No messages sent yet.</p>
                    ) : (
                        <div className="message-list">
                            {messages.map((msg) => (
                                <div key={msg.id} className="message-item">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span className={`status-badge status-${msg.status}`}>
                                            {msg.status}
                                        </span>
                                        <small style={{ color: '#64748b' }}>
                                            {new Date(msg.created_at).toLocaleString()}
                                        </small>
                                    </div>
                                    <p style={{ margin: 0 }}>{msg.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
