const express = require('express');
const requireAuth = require('../utils/clerkAuth');
const { logMood } = require('../controllers/moodController');
const router = express.Router();

router.post('/log', requireAuth, logMood);

module.exports = router;