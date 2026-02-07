import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LandingPage from './pages/LandingPage';
import LessonPlayer from './pages/learner/LessonPlayer';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    const userRole = user.role?.toUpperCase();
    const isAllowed = allowedRoles.some(role => role.toUpperCase() === userRole);

    if (allowedRoles && !isAllowed) {
        const targetPath = (userRole === 'ADMIN') ? '/admin/dashboard' : '/user/dashboard';

        // Only redirect if we are not already on the target path
        if (window.location.pathname !== targetPath) {
            return <Navigate to={targetPath} replace />;
        }
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
                            <ProtectedRoute allowedRoles={['user', 'LEARNER', 'INSTRUCTOR']}>
                                <DashboardLayout>
                                    <UserDashboard />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'ADMIN']}>
                                <DashboardLayout>
                                    <AdminDashboard />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Full-screen Lesson Player */}
                    <Route
                        path="/course/:courseId/lesson/:lessonId"
                        element={
                            <ProtectedRoute allowedRoles={['user', 'LEARNER', 'INSTRUCTOR']}>
                                <LessonPlayer />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
