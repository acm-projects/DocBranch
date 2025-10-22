
const Resume = require('./Resume');

function generateResume(jsonFilePath, outputFileName = 'resume.pdf') {
  return Resume.fromFileToPDF(jsonFilePath, outputFileName);
}

module.exports = generateResume;