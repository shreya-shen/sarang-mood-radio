const path = require('path');
const runPythonScript = require('../utils/runPython');

const generateRecommendations = async (moodText, preferences = {}) => {
  try {
    console.log('🎵 Generating recommendations for:', moodText);
    const result = await runPythonScript(moodText, preferences);
    console.log('🎵 Python script result:', result);
    
    // Check if the result has an error
    if (result.error) {
      console.error('❌ Python script error:', result.error);
      throw new Error(`Python script failed: ${result.error}`);
    }
    
    return result;
  } catch (err) {
    console.error('❌ Recommendation service error:', err);
    throw err;
  }
};

module.exports = { generateRecommendations };