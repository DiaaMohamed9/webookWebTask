const fs = require('fs');
const path = require('path');

const reportDir = `TestReport/${new Date().toISOString().replace(/[:.]/g, '-')}`;
const assetsDir = path.join(reportDir, 'assets');

// Ensure the directories exist
fs.mkdirSync(assetsDir, { recursive: true });

// Output the directory to be used in subsequent scripts
console.log(reportDir);
