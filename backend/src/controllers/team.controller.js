const TeamRequest = require('../models/TeamRequest');
const User = require('../models/User');

exports.requestTeam = async (req, res) => {
    try {
        const { userId } = req.params;
        const fromUserId = req.user.id;

        if (userId === fromUserId) {
            return res.status(400).json({ message: "Cannot send request to yourself." });
        }

        const toUser = await User.findById(userId);
        if (!toUser) {
            return res.status(404).json({ message: "User not found." });
        }

        const existingRequest = await TeamRequest.findOne({
            fromUser: fromUserId,
            toUser: userId
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Team request already sent." });
        }

        const newRequest = new TeamRequest({
            fromUser: fromUserId,
            toUser: userId,
            status: 'pending'
        });

        await newRequest.save();

        res.status(201).json({ message: "Team request sent successfully.", request: newRequest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error sending team request" });
    }
};

exports.acceptTeam = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user.id;

        const request = await TeamRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: "Team request not found." });
        }

        if (request.toUser.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to accept this request." });
        }

        if (request.status === 'accepted') {
            return res.status(400).json({ message: "Request is already accepted." });
        }

        request.status = 'accepted';
        await request.save();

        res.json({ message: "Team request accepted successfully.", request });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error accepting team request" });
    }
};
