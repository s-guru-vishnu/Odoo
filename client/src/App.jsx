import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LandingPage from './pages/LandingPage';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} />;
    }

    return children;
};


function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route
                        path="/user/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['user']}>
                                <DashboardLayout>
                                    <UserDashboard />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <DashboardLayout>
                                    <AdminDashboard />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
