const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateResume(resumeData, outputFileName = 'Jake_Resume.pdf') {
  const outputPath = path.resolve(__dirname, outputFileName);
  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(fs.createWriteStream(outputPath));

  // Header: Name and Contact
  const info = resumeData.personal_information;
  doc.font('Helvetica-Bold').fontSize(18)
    .text(info.name, { align: 'center' });
  doc.moveDown(0.5);
  doc.font('Helvetica').fontSize(10)
    .text([info.email, info.phone, info.linkedin, info.github].filter(Boolean).join(' | '), { align: 'center' });
  doc.moveDown(1);

  // Education
  doc.font('Helvetica-Bold').fontSize(12).text('Education', { underline: true });
  doc.moveDown(0.5);
  resumeData.education.forEach(edu => {
    doc.font('Helvetica-Bold').fontSize(10).text(`${edu.institution}, ${edu.location}`);
    doc.font('Helvetica').fontSize(10).text(`${edu.degree}${edu.minor ? ', Minor in ' + edu.minor : ''} (${edu.duration})`);
    doc.moveDown(0.5);
  });

  // Experience
  doc.moveDown(1);
  doc.font('Helvetica-Bold').fontSize(12).text('Experience', { underline: true });
  doc.moveDown(0.5);
  resumeData.experience.forEach(exp => {
    doc.font('Helvetica-Bold').fontSize(10).text(`${exp.position} - ${exp.organization}, ${exp.location} (${exp.duration})`);
    exp.responsibilities.forEach(r => {
      doc.font('Helvetica').fontSize(10).text(`• ${r}`, { indent: 20 });
    });
    doc.moveDown(0.5);
  });

  // Projects
  doc.moveDown(1);
  doc.font('Helvetica-Bold').fontSize(12).text('Projects', { underline: true });
  doc.moveDown(0.5);
  resumeData.projects.forEach(project => {
    doc.font('Helvetica-Bold').fontSize(10).text(`${project.name} (${project.duration})`);
    doc.font('Helvetica').fontSize(10).text(`Technologies: ${project.technologies.join(', ')}`);
    doc.font('Helvetica').fontSize(10).text(project.description);
    project.achievements.forEach(a => {
      doc.font('Helvetica').fontSize(10).text(`• ${a}`, { indent: 20 });
    });
    doc.moveDown(0.5);
  });

  // Skills
  doc.moveDown(1);
  doc.font('Helvetica-Bold').fontSize(12).text('Technical Skills', { underline: true });
  doc.moveDown(0.5);
  Object.entries(resumeData.skills).forEach(([label, items]) => {
    doc.font('Helvetica').fontSize(10).text(`${label}: ${items.join(', ')}`);
  });

  // Add other sections (e.g., awards, volunteer) as needed

  doc.end();
  doc.on('end', () => console.log('Resume generated at:', outputPath));
}

module.exports = generateResume;