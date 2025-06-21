
const { getSpotifyAuthUrl, handleCallbackExchange, fetchUserLikedTracks, createPlaylistForMood } = require('../services/spotifyService');
const supabase = require('../utils/supabase');

const authorizeSpotify = async (req, res) => {
  const url = getSpotifyAuthUrl(req.auth.userId);
  res.redirect(url);
};

const handleSpotifyCallback = async (req, res) => {
  const { code, state } = req.query;
  try {
    await handleCallbackExchange(code, state);
    res.send('Spotify account linked successfully.');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const fetchLikedSongs = async (req, res) => {
  const { userId } = req.auth;
  try {
    const tracks = await fetchUserLikedTracks(userId);
    res.json(tracks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createMoodPlaylist = async (req, res) => {
  const { userId } = req.auth;
  const { moodText, tracks } = req.body;
  try {
    const playlistUrl = await createPlaylistForMood(userId, moodText, tracks);
    res.json({ url: playlistUrl });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { authorizeSpotify, handleSpotifyCallback, fetchLikedSongs, createMoodPlaylist };