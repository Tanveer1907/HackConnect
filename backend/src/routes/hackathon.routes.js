const express = require('express');
const router = express.Router();
const hackathonController = require('../controllers/hackathon.controller');

router.get('/', hackathonController.getHackathons);

module.exports = router;
