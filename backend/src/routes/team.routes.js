const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/request/:userId', auth, teamController.requestTeam);
router.post('/accept/:requestId', auth, teamController.acceptTeam);

module.exports = router;
