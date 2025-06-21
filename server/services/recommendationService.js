const path = require('path');
const runPythonScript = require('../utils/runPython');

const generateRecommendations = async (moodText, preferences = {}) => {
  try {
    const result = await runPythonScript(moodText, preferences);
    return result;
  } catch (err) {
    throw new Error(`Recommendation generation failed: ${err.message}`);
  }
};

module.exports = { generateRecommendations };