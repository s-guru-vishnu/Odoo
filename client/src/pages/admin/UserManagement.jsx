
import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Edit, Trash2, Shield, Mail, CheckCircle, XCircle } from 'lucide-react';
import { api, userAPI } from '../../services/api';
import { Button } from '../../components/ui/Button';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userAPI.getAll();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await userAPI.delete(userId);
                setUsers(users.filter(user => user.id !== userId));
            } catch (error) {
                console.error('Failed to delete user:', error);
                alert('Failed to delete user');
            }
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role?.toLowerCase() === roleFilter.toLowerCase();
        return matchesSearch && matchesRole;
    });

    const getRoleBadgeColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'instructor': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-neutral-100 text-neutral-700 border-neutral-200';
        }
    };

    if (loading) return <div className="p-8 text-center text-neutral-500">Loading users...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">User Management</h1>
                    <p className="text-neutral-500">Manage system users, roles, and permissions</p>
                </div>
                <Button>Add New User</Button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter className="h-4 w-4 text-neutral-500" />
                    <select
                        className="bg-transparent text-sm font-medium text-neutral-600 focus:outline-none cursor-pointer"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admins</option>
                        <option value="instructor">Instructors</option>
                        <option value="learner">Learners</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-neutral-50 border-b border-neutral-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-neutral-700">User</th>
                                <th className="px-6 py-4 font-semibold text-neutral-700">Role</th>
                                <th className="px-6 py-4 font-semibold text-neutral-700">Status</th>
                                <th className="px-6 py-4 font-semibold text-neutral-700">Joined</th>
                                <th className="px-6 py-4 font-semibold text-neutral-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {user.full_name ? user.full_name[0].toUpperCase() : '?'}
                                            </div>
                                            <div>
                                                <div className="font-medium text-neutral-900">{user.full_name || 'Unknown'}</div>
                                                <div className="text-neutral-500 text-xs flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(user.role_name || user.role)}`}>
                                            {user.role_name || user.role || 'User'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full w-fit border border-emerald-100">
                                            <CheckCircle className="h-3.5 w-3.5" />
                                            <span className="text-xs font-medium">Active</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-neutral-500">
                                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-neutral-400 hover:text-primary hover:bg-neutral-100 rounded-lg transition-all">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
