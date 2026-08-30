const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
    createTeam,
    getTeamById,
    getMyTeams,
    sendTeamRequest,
    acceptTeamRequest,
    declineTeamRequest,
    leaveTeam,
    removeMember,
    deleteTeam
} = require('../controllers/teamController');

// All team routes require authentication
router.use(auth);

// @route   POST /api/team/create
// @desc    Create a new team
router.post('/create', createTeam);

// @route   GET /api/team/my-teams
// @desc    Get all teams the current user is part of
router.get('/my-teams', getMyTeams);

// @route   GET /api/team/:id
// @desc    Get team by ID
router.get('/:id', getTeamById);

// @route   POST /api/team/:id/request
// @desc    Send a request to join a team
router.post('/:id/request', sendTeamRequest);

// @route   PUT /api/team/:id/accept
// @desc    Accept a user's request to join (leader only)
router.put('/:id/accept', acceptTeamRequest);

// @route   PUT /api/team/:id/decline
// @desc    Decline a user's request to join (leader only)
router.put('/:id/decline', declineTeamRequest);

// @route   PUT /api/team/:id/leave
// @desc    Leave a team (members only)
router.put('/:id/leave', leaveTeam);

// @route   PUT /api/team/:id/remove-member
// @desc    Remove a member from team (leader only)
router.put('/:id/remove-member', removeMember);

// @route   DELETE /api/team/:id
// @desc    Delete a team (leader only)
router.delete('/:id', deleteTeam);

module.exports = router;
