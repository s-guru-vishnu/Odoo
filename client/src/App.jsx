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
import CourseOverview from './pages/learner/CourseOverview';
import UserProfile from './pages/learner/UserProfile';
import LiveClasses from './pages/learner/LiveClasses';
import LiveClassRoom from './pages/learner/LiveClassRoom';
import Quizzes from './pages/learner/Quizzes';
import WorkSubmission from './pages/learner/WorkSubmission';
import ExploreCourses from './pages/learner/ExploreCourses';

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
                        path="/courses/explore"
                        element={
                            <ProtectedRoute allowedRoles={['user', 'LEARNER', 'INSTRUCTOR']}>
                                <DashboardLayout>
                                    <ExploreCourses />
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

                    {/* User Profile */}
                    <Route
                        path="/user/profile"
                        element={
                            <ProtectedRoute allowedRoles={['user', 'LEARNER', 'INSTRUCTOR']}>
                                <DashboardLayout>
                                    <UserProfile />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Course Overview */}
                    <Route
                        path="/courses/:id"
                        element={
                            <ProtectedRoute allowedRoles={['user', 'LEARNER', 'INSTRUCTOR']}>
                                <DashboardLayout>
                                    <CourseOverview />
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
                    {/* Live Classes */}
                    <Route
                        path="/live-classes"
                        element={
                            <ProtectedRoute allowedRoles={['user', 'LEARNER', 'INSTRUCTOR']}>
                                <DashboardLayout>
                                    <LiveClasses />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/live-class/:id"
                        element={
                            <ProtectedRoute allowedRoles={['user', 'LEARNER', 'INSTRUCTOR']}>
                                <LiveClassRoom />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/quizzes"
                        element={
                            <ProtectedRoute allowedRoles={['user', 'LEARNER', 'INSTRUCTOR']}>
                                <DashboardLayout>
                                    <Quizzes />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/assignments"
                        element={
                            <ProtectedRoute allowedRoles={['user', 'LEARNER', 'INSTRUCTOR']}>
                                <DashboardLayout>
                                    <WorkSubmission />
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
