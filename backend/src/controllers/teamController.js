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

        // Enforce hackathon team size limits
        const hackathon = await Hackathon.findById(team.hackathonId);
        const maxTeamSize = hackathon ? (hackathon.teamSize || 4) : 4;
        if (team.members.length >= maxTeamSize) {
            return res.status(400).json({ message: `Team is already full (limit is ${maxTeamSize} members)` });
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

exports.declineTeamRequest = async (req, res) => {
    try {
        const teamId = req.params.id;
        const leaderId = req.user.user.id;
        const { userIdToDecline } = req.body;

        if (!userIdToDecline) {
            return res.status(400).json({ message: 'Please provide userIdToDecline' });
        }

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        if (team.leaderId.toString() !== leaderId) {
            return res.status(401).json({ message: 'User not authorized to decline requests for this team' });
        }

        team.pendingRequests = team.pendingRequests.filter(id => id.toString() !== userIdToDecline);
        await team.save();

        res.json({ message: 'Request declined', team });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.leaveTeam = async (req, res) => {
    try {
        const teamId = req.params.id;
        const userId = req.user.user.id;

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        if (team.leaderId.toString() === userId) {
            return res.status(400).json({ message: 'Team leader cannot leave the team. Transfer leadership or delete the team.' });
        }

        team.members = team.members.filter(id => id.toString() !== userId);
        await team.save();

        res.json({ message: 'Successfully left the team', team });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.removeMember = async (req, res) => {
    try {
        const teamId = req.params.id;
        const leaderId = req.user.user.id;
        const { memberIdToRemove } = req.body;

        if (!memberIdToRemove) {
            return res.status(400).json({ message: 'Please provide memberIdToRemove' });
        }

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        if (team.leaderId.toString() !== leaderId) {
            return res.status(401).json({ message: 'Only team leader can remove members' });
        }

        if (memberIdToRemove === leaderId) {
            return res.status(400).json({ message: 'Leader cannot be removed' });
        }

        team.members = team.members.filter(id => id.toString() !== memberIdToRemove);
        await team.save();

        res.json({ message: 'Member removed successfully', team });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteTeam = async (req, res) => {
    try {
        const teamId = req.params.id;
        const leaderId = req.user.user.id;

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        if (team.leaderId.toString() !== leaderId) {
            return res.status(401).json({ message: 'Only the team leader can delete this team' });
        }

        await Team.findByIdAndDelete(teamId);
        res.json({ message: 'Team deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.inviteMember = async (req, res) => {
    try {
        const teamId = req.params.id;
        const leaderId = req.user.user.id;
        const { userIdToInvite, message } = req.body;

        if (!userIdToInvite) {
            return res.status(400).json({ message: 'User ID to invite is required' });
        }

        const team = await Team.findById(teamId).populate('hackathonId', 'title');
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        if (team.leaderId.toString() !== leaderId) {
            return res.status(401).json({ message: 'Only the team leader can invite members' });
        }

        if (team.members.some(id => id.toString() === userIdToInvite)) {
            return res.status(400).json({ message: 'User is already a member of this team' });
        }

        if (team.invitations && team.invitations.some(id => id.toString() === userIdToInvite)) {
            return res.status(400).json({ message: 'User has already been invited to this team' });
        }

        const hackathon = await Hackathon.findById(team.hackathonId);
        const maxTeamSize = hackathon ? (hackathon.teamSize || 4) : 4;
        if (team.members.length >= maxTeamSize) {
            return res.status(400).json({ message: `Team is already full (limit is ${maxTeamSize} members)` });
        }

        if (!team.invitations) team.invitations = [];
        team.invitations.push(userIdToInvite);
        await team.save();

        const Message = require('../models/Message');
        const sortedIds = [leaderId.toString(), userIdToInvite.toString()].sort();
        const roomId = `${sortedIds[0]}-${sortedIds[1]}`;

        const inviteText = message && message.trim() 
            ? message.trim()
            : `Hey! I invited you to join my team "${team.name}" for ${team.hackathonId?.title || 'a hackathon'}. Check your Dashboard to accept!`;

        const autoMsg = new Message({
            roomId,
            sender: leaderId,
            text: inviteText
        });
        await autoMsg.save();

        res.json({ message: 'Invitation sent successfully', team });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.getMyInvitations = async (req, res) => {
    try {
        const userId = req.user.user.id;
        const invitations = await Team.find({ invitations: userId })
            .populate('hackathonId', 'title location startDate prizePool')
            .populate('leaderId', 'name email profileImage university')
            .populate('members', 'name profileImage');

        res.json(invitations);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.acceptInvitation = async (req, res) => {
    try {
        const teamId = req.params.id;
        const userId = req.user.user.id;

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        if (!team.invitations || !team.invitations.some(id => id.toString() === userId)) {
            return res.status(400).json({ message: 'No invitation found for this team' });
        }

        const existingTeam = await Team.findOne({ hackathonId: team.hackathonId, members: userId });
        if (existingTeam) {
            return res.status(400).json({ message: 'You are already in a team for this hackathon' });
        }

        const hackathon = await Hackathon.findById(team.hackathonId);
        const maxTeamSize = hackathon ? (hackathon.teamSize || 4) : 4;
        if (team.members.length >= maxTeamSize) {
            return res.status(400).json({ message: `Team is already full (limit is ${maxTeamSize} members)` });
        }

        team.invitations = team.invitations.filter(id => id.toString() !== userId);
        team.members.push(userId);
        await team.save();

        res.json({ message: 'Successfully joined team!', team });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.declineInvitation = async (req, res) => {
    try {
        const teamId = req.params.id;
        const userId = req.user.user.id;

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        team.invitations = (team.invitations || []).filter(id => id.toString() !== userId);
        await team.save();

        res.json({ message: 'Invitation declined', team });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};
