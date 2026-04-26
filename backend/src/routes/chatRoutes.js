const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/authMiddleware');
const { getMyChats } = require('../controllers/chatController');

// Get all active chats for current user
router.get('/my-chats', auth, getMyChats);

// Get message history for a room
router.get('/:roomId', async (req, res) => {
    try {
        const messages = await Message.find({ roomId: req.params.roomId })
            .populate('sender', 'username email profile.firstName profile.lastName')
            .sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error fetching messages' });
    }
});

module.exports = router;
