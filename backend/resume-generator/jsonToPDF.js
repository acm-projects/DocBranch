const { app } = require('electron');
const Resume = require('./Resume');

app.whenReady().then(() => {
  console.log('Electron started.');
  const path = require('path');
  // Get JSON file path from command line argument
  const jsonFilePath = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, 'allenzheng-resume.json');
  Resume.fromFileToPDF(jsonFilePath, "allenzheng-resume.pdf");
});

app.on('window-all-closed', () => app.quit());
