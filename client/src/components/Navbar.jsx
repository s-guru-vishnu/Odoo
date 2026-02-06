import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav>
            <div className="nav-brand">
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}>
                    PERN App
                </Link>
            </div>
            <div className="nav-links">
                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span>Welcome, <strong>{user.name}</strong> ({user.role})</span>
                        <button onClick={handleLogout} style={{ width: 'auto', padding: '0.5rem 1rem', backgroundColor: '#e2e8f0', color: '#1e293b' }}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
