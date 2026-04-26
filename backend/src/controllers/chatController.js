const Message = require('../models/Message');
const mongoose = require('mongoose');

exports.getMyChats = async (req, res) => {
    try {
        const userId = req.user.user.id;
        
        // Find all messages where the roomId contains the user's ID
        const chats = await Message.aggregate([
            { $match: { roomId: { $regex: userId } } },
            { $sort: { createdAt: -1 } },
            { 
                $group: {
                    _id: "$roomId",
                    latestMessage: { $first: "$$ROOT" }
                }
            },
            { $sort: { "latestMessage.createdAt": -1 } }
        ]);

        const User = require('../models/User');
        
        const populatedChats = await Promise.all(chats.map(async (chat) => {
            const roomId = chat._id;
            const ids = roomId.split('-');
            const otherUserId = ids[0] === userId ? ids[1] : ids[0];
            
            let otherUser = null;
            if (otherUserId && mongoose.Types.ObjectId.isValid(otherUserId)) {
                otherUser = await User.findById(otherUserId).select('username email name');
            }

            return {
                roomId: chat._id,
                latestMessage: chat.latestMessage,
                otherUser: otherUser
            };
        }));

        res.json(populatedChats);
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ message: 'Server error fetching chats' });
    }
};
