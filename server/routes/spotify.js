const express = require('express');
const { authorizeSpotify, handleSpotifyCallback, fetchLikedSongs, createMoodPlaylist } = require('../controllers/spotifyController');
const requireAuth = require('../utils/clerkAuth');

const router = express.Router();

router.get('/authorize', requireAuth, authorizeSpotify);
router.get('/callback', handleSpotifyCallback);
router.get('/liked', requireAuth, fetchLikedSongs);
router.post('/create-playlist', requireAuth, createMoodPlaylist);