const { generateRecommendations } = require('../services/recommendationService');
const supabase = require('../utils/supabase');

const generatePlaylist = async (req, res) => {
  const { userId } = req.auth;
  const { moodText, preferences } = req.body;
  try {
    const playlist = await generateRecommendations(moodText, preferences);
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { generatePlaylist };