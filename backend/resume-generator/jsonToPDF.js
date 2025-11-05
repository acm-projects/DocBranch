const { app } = require('electron');
const Resume = require('./Resume');

app.whenReady().then(() => {
  console.log('Electron started.');
  const path = require('path');
  // Get JSON file path from command line argument
  const jsonFilePath = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, 'resume_json_files/newresume.json');
  Resume.fromFileToPDF(jsonFilePath, "generated-resumes/allenzheng-resume.pdf");
});

app.on('window-all-closed', () => app.quit());
