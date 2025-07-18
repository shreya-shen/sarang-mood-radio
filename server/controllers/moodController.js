const supabase = require('../utils/supabase');
const { analyzeSentiment } = require('../services/sentimentService');
const { getOrCreateUserUUID } = require('../utils/userMapping');

const logMood = async (req, res) => {
  const { userId } = req.auth;
  const { text, sentiment_score, sentiment_label } = req.body;
  
  try {
    console.log('Logging mood for user:', userId);
    
    // Convert Clerk ID to UUID
    const userUUID = await getOrCreateUserUUID(userId);
    console.log('Using UUID:', userUUID, 'for Clerk ID:', userId);
    
    // Use sentiment data from frontend if provided, otherwise analyze
    let finalSentimentScore = sentiment_score;
    let finalSentimentLabel = sentiment_label;
    
    if (!finalSentimentScore) {
      const sentimentData = await analyzeSentiment(text);
      finalSentimentScore = sentimentData.score;
      finalSentimentLabel = sentimentData.label;
    }

    const { data, error } = await supabase.from('moods').insert([
      {
        userId: userUUID, // Use generated UUID instead of Clerk ID
        inputText: text, // Match your schema: camelCase
        sentimentScore: finalSentimentScore, // Match your schema: camelCase
        created_at: new Date().toISOString()
      }
    ]).select().single();

    if (error) {
      console.error('Database error:', error);
      return res.status(400).json({ error: error.message });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error logging mood:', error);
    res.status(500).json({ error: error.message });
  }
};

const getMoodHistory = async (req, res) => {
  const { userId } = req.auth;
  
  try {
    // Convert Clerk ID to UUID
    const userUUID = await getOrCreateUserUUID(userId);
    
    const { data, error } = await supabase
      .from('moods')
      .select('*')
      .eq('userId', userUUID) // Use generated UUID
      .order('created_at', { ascending: false })
      .limit(50); // Get last 50 mood entries

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const analyzeMoodSentiment = async (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    console.log('Analyzing sentiment for text:', text);
    const sentimentScore = await analyzeSentiment(text);
    console.log('Python sentiment score:', sentimentScore);
    
    // Convert sentiment score to normalized range and label
    const normalizedScore = Math.max(-1, Math.min(1, sentimentScore));
    
    let label;
    if (normalizedScore < -0.5) label = "Low";
    else if (normalizedScore < -0.1) label = "Calm";
    else if (normalizedScore < 0.1) label = "Neutral";
    else if (normalizedScore < 0.5) label = "Happy";
    else label = "Excited";

    const confidence = Math.min(0.95, 0.7 + Math.abs(normalizedScore) * 0.25);

    const result = {
      score: normalizedScore,
      label,
      confidence: Math.round(confidence * 100) / 100
    };

    console.log('Sending sentiment result:', result);
    res.json(result);
  } catch (error) {
    console.error('Sentiment analysis error:', error.message);
    res.status(500).json({ error: 'Failed to analyze sentiment: ' + error.message });
  }
};

// Temporary diagnostic function to check database schema
const checkSchema = async (req, res) => {
  try {
    // Try to get any existing mood record to see column structure
    const { data, error } = await supabase
      .from('moods')
      .select('*')
      .limit(1);

    if (error) {
      return res.json({ error: error.message, hint: 'Check if moods table exists' });
    }

    res.json({ 
      sample_record: data[0] || null,
      columns_available: data[0] ? Object.keys(data[0]) : 'No data found',
      total_records: data.length 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { logMood, getMoodHistory, analyzeMoodSentiment, checkSchema };