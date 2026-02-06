import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
    const [messages, setMessages] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchAllMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/messages/admin', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
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

    return (
        <div className="container">
            <h1>Admin Dashboard - All User Messages</h1>
            <div className="card">
                {loading ? (
                    <p>Loading messages...</p>
                ) : messages.length === 0 ? (
                    <p>No messages found from any users.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                                <th style={{ padding: '1rem' }}>User</th>
                                <th style={{ padding: '1rem' }}>Content</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Time</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map((msg) => (
                                <tr key={msg.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}><strong>{msg.sender_name}</strong></td>
                                    <td style={{ padding: '1rem' }}>
                                        {editingId === msg.id ? (
                                            <textarea
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                style={{ width: '100%' }}
                                            />
                                        ) : (
                                            msg.content
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span className={`status-badge status-${msg.status}`}>
                                            {msg.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <small>{new Date(msg.created_at).toLocaleString()}</small>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {editingId === msg.id ? (
                                                <button
                                                    onClick={() => handleSaveEdit(msg.id)}
                                                    style={{ width: 'auto', padding: '0.4rem 0.8rem', backgroundColor: '#16a34a', color: 'white' }}
                                                >
                                                    Save
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => startEditing(msg)}
                                                    style={{ width: 'auto', padding: '0.4rem 0.8rem', backgroundColor: '#64748b', color: 'white' }}
                                                >
                                                    Edit
                                                </button>
                                            )}

                                            <select
                                                value={msg.status}
                                                onChange={(e) => handleUpdateStatus(msg.id, e.target.value)}
                                                style={{ width: 'auto', padding: '0.4rem' }}
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
                )
                }
            </div >
        </div >
    );
};

export default AdminDashboard;
