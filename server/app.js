const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const moodRoutes = require('./routes/mood');
const playlistRoutes = require('./routes/playlist');
const spotifyRoutes = require('./routes/spotify');
const userRoutes = require('./routes/user');

const app = express();
dotenv.config();

app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:8080',
    'https://f822f56e9b9f.ngrok-free.app'
  ],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/playlist', playlistRoutes);
app.use('/api/spotify', spotifyRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;

// Run HTTP server for ngrok tunneling
app.listen(PORT, () => {
  console.log(`� HTTP Server running on http://localhost:${PORT}`);
  console.log(`� Ready for ngrok tunneling to enable Spotify HTTPS callbacks`);
});