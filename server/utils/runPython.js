const { spawn } = require('child_process');
const path = require('path');

const runPythonScript = (inputMoodText, userPreferences) => {
  return new Promise((resolve, reject) => {
    const pythonDir = path.join(__dirname, '../python');
    const python = spawn('python', ['moodBasedRecs.py'], {
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
        reject(new Error(`Python script failed: ${error}`));
      } else {
        try {
          const parsed = JSON.parse(output);
          resolve(parsed);
        } catch (err) {
          reject(new Error('Invalid JSON from Python')); 
        }
      }
    });

    python.stdin.write(JSON.stringify({ mood: inputMoodText, preferences: userPreferences }));
    python.stdin.end();
  });
};

module.exports = runPythonScript;