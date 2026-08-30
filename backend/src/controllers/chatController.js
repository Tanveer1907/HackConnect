const Message = require('../models/Message');
const Team = require('../models/Team');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.getMyChats = async (req, res) => {
    try {
        const userId = req.user.user.id;
        
        // 1. Direct Messages
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

        const populatedChats = await Promise.all(chats.map(async (chat) => {
            const roomId = chat._id;
            const ids = roomId.split('-');
            const otherUserId = ids[0] === userId ? ids[1] : ids[0];
            
            let otherUser = null;
            if (otherUserId && mongoose.Types.ObjectId.isValid(otherUserId)) {
                otherUser = await User.findById(otherUserId).select('name email profileImage role');
            }

            return {
                roomId: chat._id,
                isTeamChat: false,
                latestMessage: chat.latestMessage,
                otherUser: otherUser
            };
        }));

        // 2. User's Team Group Channels
        const myTeams = await Team.find({ members: userId }).populate('hackathonId', 'title');
        const teamChats = await Promise.all(myTeams.map(async (t) => {
            const teamRoomId = `team-${t._id}`;
            const latestMsg = await Message.findOne({ roomId: teamRoomId })
                .populate('sender', 'name')
                .sort({ createdAt: -1 });

            return {
                roomId: teamRoomId,
                isTeamChat: true,
                teamName: t.name,
                hackathonTitle: t.hackathonId?.title || 'Hackathon Team',
                latestMessage: latestMsg || { text: 'Welcome to team chat!', createdAt: t.createdAt },
                otherUser: { name: `Team: ${t.name}`, role: 'Group Channel' }
            };
        }));

        res.json([...teamChats, ...populatedChats.filter(c => c.otherUser)]);
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ message: 'Server error fetching chats' });
    }
};
