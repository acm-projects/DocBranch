const { app } = require('electron');
const generateResume = require('./generateResume');

app.whenReady().then(() => {
  console.log('Electron started.');
  const path = require('path');
  // Get JSON file path from command line argument
  const jsonFilePath = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, 'jakes-resume.json');
  generateResume(jsonFilePath, "newjakes-resume.pdf");
});

app.on('window-all-closed', () => app.quit());
