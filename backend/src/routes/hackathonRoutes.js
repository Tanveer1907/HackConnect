const express = require('express');
const router = express.Router();
const hackathonController = require('../controllers/hackathonController');

// @route   GET api/hackathons
// @desc    Get all hackathons
// @access  Public
router.get('/', hackathonController.getHackathons);

// @route   GET api/hackathons/:id
// @desc    Get hackathon by ID
// @access  Public
router.get('/:id', hackathonController.getHackathonById);

module.exports = router;
