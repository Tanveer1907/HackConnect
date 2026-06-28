const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', authController.registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.loginUser);

const passport = require('passport');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    (req, res, next) => {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        passport.authenticate('google', { failureRedirect: `${frontendUrl}/login?error=true` })(req, res, next);
    },
    (req, res) => {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const token = generateToken(req.user._id);
        res.redirect(`${frontendUrl}/login?token=${token}`);
    }
);

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
    (req, res, next) => {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        passport.authenticate('github', { failureRedirect: `${frontendUrl}/login?error=true` })(req, res, next);
    },
    (req, res) => {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const token = generateToken(req.user._id);
        res.redirect(`${frontendUrl}/login?token=${token}`);
    }
);

module.exports = router;
