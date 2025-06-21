const express = require('express');
const requireAuth = require('../utils/clerkAuth');
const { generatePlaylist } = require('../controllers/playlistController');
const router = express.Router();

router.post('/generate', requireAuth, generatePlaylist);

module.exports = router;