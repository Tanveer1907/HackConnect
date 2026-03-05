const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET api/users/profile/:id
// @desc    Get user profile by ID
// @access  Private
// Using authMiddleware to protect the route (optional based on requirements, but generally good for profiles)
router.get('/profile/:id', authMiddleware, userController.getUserProfile);

module.exports = router;
