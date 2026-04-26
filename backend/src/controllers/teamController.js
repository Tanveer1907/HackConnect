const Team = require('../models/Team');
const Hackathon = require('../models/Hackathon');
const User = require('../models/User');

exports.createTeam = async (req, res) => {
    try {
        const { name, hackathonId } = req.body;
        const leaderId = req.user.user.id; // from authMiddleware

        // Verify hackathon exists
        const hackathon = await Hackathon.findById(hackathonId);
        if (!hackathon) {
            return res.status(404).json({ message: 'Hackathon not found' });
        }

        // Check if user already has a team for this hackathon
        const existingTeam = await Team.findOne({ hackathonId, members: leaderId });
        if (existingTeam) {
            return res.status(400).json({ message: 'You are already in a team for this hackathon' });
        }

        const team = new Team({
            name,
            hackathonId,
            leaderId,
            members: [leaderId] // Leader is automatically the first member
        });

        await team.save();
        res.status(201).json(team);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.getTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)
            .populate('hackathonId', 'title')
            .populate('leaderId', 'name email profileImage')
            .populate('members', 'name email skills')
            .populate('pendingRequests', 'name email skills bio');
            
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.json(team);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.status(500).send('Server Error');
    }
};

exports.getMyTeams = async (req, res) => {
    try {
        const userId = req.user.user.id;
        const teams = await Team.find({ members: userId })
            .populate('hackathonId', 'title')
            .populate('leaderId', 'name')
            .populate('members', 'name')
            .populate('pendingRequests', 'name email profileImage');
            
        res.json(teams);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.sendTeamRequest = async (req, res) => {
    try {
        const teamId = req.params.id;
        const userId = req.user.user.id;

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Check if user is already a member
        const isMember = team.members.some(id => id.toString() === userId);
        if (isMember) {
            return res.status(400).json({ message: 'You are already a member of this team' });
        }

        // Check if user already sent a request
        const hasRequested = team.pendingRequests.some(id => id.toString() === userId);
        if (hasRequested) {
            return res.status(400).json({ message: 'You have already sent a request to this team' });
        }

        team.pendingRequests.push(userId);
        await team.save();

        // Create automated chat message for the team leader
        const Message = require('../models/Message');
        const sortedIds = [userId.toString(), team.leaderId.toString()].sort();
        const roomId = `${sortedIds[0]}-${sortedIds[1]}`;
        
        if (userId.toString() !== team.leaderId.toString()) {
            const automatedMessage = new Message({
                roomId: roomId,
                sender: userId,
                text: `I would like to join your team: ${team.name}`
            });
            await automatedMessage.save();
        }

        res.json({ message: 'Team request sent successfully', team });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.acceptTeamRequest = async (req, res) => {
    try {
        const teamId = req.params.id;
        const leaderId = req.user.user.id;
        const { userIdToAccept } = req.body;

        if (!userIdToAccept) {
             return res.status(400).json({ message: 'Please provide userIdToAccept' });
        }

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Verify leader
        if (team.leaderId.toString() !== leaderId) {
            return res.status(401).json({ message: 'User not authorized to accept requests for this team' });
        }

        // Check if user is actually in pendingRequests
        const hasRequested = team.pendingRequests.some(id => id.toString() === userIdToAccept);
        if (!hasRequested) {
             return res.status(400).json({ message: 'This user has not requested to join the team' });
        }

        // Move from pending to members
        team.pendingRequests = team.pendingRequests.filter(id => id.toString() !== userIdToAccept);
        team.members.push(userIdToAccept);
        
        await team.save();

        res.json({ message: 'Request accepted', team });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};
