const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
    createTeam,
    getTeamById,
    getMyTeams,
    sendTeamRequest,
    acceptTeamRequest
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

module.exports = router;
