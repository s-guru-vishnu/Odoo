const express = require('express');
const router = express.Router();
const {
    sendMessage,
    getUserMessages,
    getAllMessagesForAdmin,
    updateMessage
} = require('../controllers/messageController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// User routes
router.post('/send', authenticateToken, authorizeRole('user'), sendMessage);
router.get('/user', authenticateToken, authorizeRole('user'), getUserMessages);

// Admin routes
router.get('/admin', authenticateToken, authorizeRole('admin'), getAllMessagesForAdmin);
router.put('/update/:id', authenticateToken, authorizeRole('admin'), updateMessage);

module.exports = router;
