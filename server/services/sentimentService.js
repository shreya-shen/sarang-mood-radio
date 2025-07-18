const { spawn } = require('child_process');
const path = require('path');

const analyzeSentiment = (text) => {
  return new Promise((resolve, reject) => {
    const pythonDir = path.join(__dirname, '../python');
    const python = spawn('python', ['sentiment_analysis.py'], {
      cwd: pythonDir
    });

    let output = '';
    let error = '';

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    python.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python sentiment analysis failed: ${error}`));
      } else {
        try {
          const result = JSON.parse(output);
          resolve(result.sentiment_score);
        } catch (err) {
          reject(new Error('Invalid JSON from Python sentiment analysis')); 
        }
      }
    });

    python.stdin.write(JSON.stringify({ text: text }));
    python.stdin.end();
  });
};

module.exports = { analyzeSentiment };