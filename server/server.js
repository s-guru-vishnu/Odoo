const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { getDb } = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check - getDb() is called ONLY at runtime when a request hits this route
app.get('/api/health', async (req, res) => {
    let dbStatus = 'unknown';
    try {
        const db = getDb();
        await db.query('SELECT 1');
        dbStatus = 'ok';
    } catch (err) {
        dbStatus = 'unavailable';
        console.error('Database not ready:', err.message);
    }
    res.status(200).json({
        status: 'ok',
        db: dbStatus,
        env: process.env.NODE_ENV || 'development'
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Serve static assets from the React app in production
if (process.env.NODE_ENV === 'production') {
    const buildPath = path.join(__dirname, '../client/dist');
    app.use(express.static(buildPath));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(buildPath, 'index.html'));
    });
}

// Basic error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
