const express = require('express');
const requireAuth = require('../utils/clerkAuth');
const { generatePlaylist, getPlaylistHistory } = require('../controllers/playlistController');
const router = express.Router();

router.post('/generate', requireAuth, generatePlaylist);
router.get('/history', requireAuth, getPlaylistHistory);

module.exports = router;