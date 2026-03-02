const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const auth = require('../middlewares/auth.middleware');

// Protected routes
router.get('/me', auth, profileController.getMe);
router.put('/update', auth, profileController.updateProfile);

module.exports = router;
