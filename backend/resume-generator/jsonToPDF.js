const { app } = require('electron');
const generateResume = require('./generateResume');
const resumeData = require('./resumeData');

app.whenReady().then(() => {
  console.log('Electron started.');
  generateResume(resumeData);
});

app.on('window-all-closed', () => app.quit());
