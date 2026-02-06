const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize environment variables
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const db = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check - Database is ONLY accessed when this route is called
app.get('/api/health', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({
            status: 'ok',
            serverTime: result.rows[0].now,
            env: process.env.NODE_ENV || 'development'
        });
    } catch (err) {
        console.error('Database runtime check failed:', err.message);
        res.status(500).json({ status: 'error', message: 'Runtime DB connection failed' });
    }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Production Static Assets
if (process.env.NODE_ENV === 'production') {
    const buildPath = path.join(__dirname, '../client/dist');
    app.use(express.static(buildPath));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(buildPath, 'index.html'));
    });
}

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('App Error:', err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Startup - Only start the listener if we are not being required as a module
// and ensure port is accessed at runtime.
const startServer = () => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
};

startServer();
