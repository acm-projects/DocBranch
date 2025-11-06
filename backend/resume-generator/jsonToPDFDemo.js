const { app } = require('electron');
const Resume = require('./Resume');

app.whenReady().then(() => {
  console.log('Electron started.');
  const path = require('path');
  // Demo: read the JSON file into an object and pass it to fromObjectToPDF
  const fs = require('fs');
  const jsonFilePath = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, 'resume_json_files/newresume.json');
  try {
    const raw = fs.readFileSync(jsonFilePath, 'utf8');
    const payload = JSON.parse(raw);
    const outRel = path.join('generated-resumes', 'allenzheng-resume.pdf');
    const outPath = path.resolve(__dirname, outRel);
    Resume.fromObjectToPDF(payload, outPath)
      .then(resolved => console.log('PDF generated at', resolved))
      .catch(err => console.error('Error generating PDF from object:', err));
  } catch (err) {
    console.error('Failed to read/parse JSON file for demo:', err);
  }
});

app.on('window-all-closed', () => app.quit());
