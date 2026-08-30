const express = require('express');
const router = express.Router();
const hackathonController = require('../controllers/hackathonController');
const auth = require('../middleware/authMiddleware');

// @route   GET api/hackathons
// @desc    Get all hackathons
// @access  Public
router.get('/', hackathonController.getHackathons);

// @route   POST api/hackathons
// @desc    Create a new hackathon
// @access  Private
router.post('/', auth, hackathonController.createHackathon);

// @route   GET api/hackathons/:id
// @desc    Get hackathon by ID
// @access  Public
router.get('/:id', hackathonController.getHackathonById);

// @route   POST api/hackathons/:id/register
// @desc    Register for a hackathon
// @access  Private
router.post('/:id/register', auth, hackathonController.registerForHackathon);

// @route   POST api/hackathons/:id/submit
// @desc    Submit a project to a hackathon
// @access  Private
router.post('/:id/submit', auth, hackathonController.submitProject);

module.exports = router;
