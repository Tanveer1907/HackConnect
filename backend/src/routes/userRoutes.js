const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET api/users/profile
// @desc    Get current user profile extracted from token
// @access  Private
router.get('/profile', authMiddleware, userController.getCurrentUserProfile);

// @route   GET api/users/profile/:id
// @desc    Get user profile by ID
// @access  Private
// Using authMiddleware to protect the route (optional based on requirements, but generally good for profiles)
router.get('/profile/:id', authMiddleware, userController.getUserProfile);

// @route   GET api/users
// @desc    Get all users
// @access  Public
router.get('/', userController.getAllUsers);

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authMiddleware, userController.updateUserProfile);

// @route   GET api/users/recommendations
// @desc    Get recommended teammates based on skills
// @access  Private
router.get('/recommendations', authMiddleware, userController.getRecommendedTeammates);

module.exports = router;
