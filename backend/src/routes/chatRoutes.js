const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/authMiddleware');
const { getMyChats } = require('../controllers/chatController');

// Get all active chats for current user
router.get('/my-chats', auth, getMyChats);

// Get message history for a room
router.get('/:roomId', auth, async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.user.id;

        // Verify user is part of the room
        if (roomId.startsWith('team-')) {
            const teamId = roomId.replace('team-', '');
            const Team = require('../models/Team');
            const team = await Team.findOne({ _id: teamId, members: userId });
            if (!team) {
                return res.status(403).json({ message: 'Access denied to this team channel' });
            }
        } else {
            const roomUsers = roomId.split('-');
            if (!roomUsers.includes(userId)) {
                return res.status(403).json({ message: 'Access denied to this chat room' });
            }
        }

        const messages = await Message.find({ roomId })
            .populate('sender', 'name email profileImage')
            .sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error fetching messages' });
    }
});

module.exports = router;
