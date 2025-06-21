const supabase = require('../utils/supabase');
const { analyzeSentiment } = require('../services/sentimentService');

const logMood = async (req, res) => {
  const { userId } = req.auth;
  const { text } = req.body;
  const sentimentScore = analyzeSentiment(text);

  const { data, error } = await supabase.from('moods').insert([
    {
      user_id: userId,
      text,
      sentiment: sentimentScore,
      timestamp: new Date().toISOString()
    }
  ]).select().single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

module.exports = { logMood };