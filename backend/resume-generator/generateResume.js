const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateResume(data, outputFileName = 'professional-resume.pdf') {
  const outputPath = path.resolve(__dirname, outputFileName);
  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(fs.createWriteStream(outputPath));

  const info = data.personal_information;
  const pageWidth = doc.page.width-80;
  let y = 45;

  doc.font('Helvetica-Bold').fontSize(16)
    .text(info.name, 40, y, { align: 'center', width: pageWidth });
  y += 20;

  const contactInfo = [
    info.phone,
    info.email,
    info.linkedin,
    info.github
  ].join(' | ');

  doc.font('Helvetica').fontSize(10)
    .text(contactInfo, 40, y, { align: 'center', width: pageWidth });
  y += 28;

  y = drawSectionTitle(doc, 'Education', y);
  data.education.forEach(edu => {
    y = drawTwoColumn(doc, edu.institution, edu.location, y);
    y = drawTwoColumn(doc, `${edu.degree}${edu.minor ? ', Minor in ' + edu.minor : ''}`, edu.duration, y);
    y += 7; 
  });
  y += 5;

  y = drawSectionTitle(doc, 'Experience', y);
  data.experience.forEach(exp => {
    y = drawTwoColumn(doc, exp.position, exp.duration, y);
    y = drawTwoColumn(doc, exp.organization, exp.location, y);
    exp.responsibilities.forEach(r => {
      y = drawBullet(doc, r, y);
    });
    y += 7;
  });
  y += 5;

  y = drawSectionTitle(doc, 'Projects', y);
  data.projects.forEach(project => {
    const techString = project.technologies.join(', ');
    y = drawTwoColumn(doc, `${project.name} | ${techString}`, project.duration, y);
    y = drawBullet(doc, project.description, y);
    project.achievements.forEach(a => {
      y = drawBullet(doc, a, y);
    });
    y += 7; 
  });
  y += 5;
  
  y = drawSectionTitle(doc, 'Technical Skills', y);
  doc.font('Helvetica').fontSize(10);
  y = drawSkillLine(doc, 'Languages', data.skills.programming_languages, y);
  y = drawSkillLine(doc, 'Frameworks', data.skills.frameworks, y);
  y = drawSkillLine(doc, 'Developer Tools', data.skills.developer_tools, y);
  y = drawSkillLine(doc, 'Libraries', data.skills.libraries, y);

  doc.end();
  doc.on('end', () => console.log('Resume generated at:', outputPath));
}

function drawSectionTitle(doc, title, y) {
  doc.font('Helvetica-Bold').fontSize(11)
    .text(title.toUpperCase(), 40, y);
  return y + 16; 
}

function drawTwoColumn(doc, left, right, y) {
  const leftX = 40;
  const rightX = 450;
  doc.font('Helvetica-Bold').fontSize(9.5).text(left, leftX, y, { width: 390 });
  doc.font('Helvetica').fontSize(9.5).text(right, rightX, y, { align: 'right' });
  return y + 13;
}

function drawBullet(doc, text, y) {
  const bulletIndent = 55;
  const maxWidth = 480;
  doc.font('Helvetica').fontSize(9.5)
    .text(`• ${text}`, bulletIndent, y, { width: maxWidth });
  return y + 12;
}

function drawSkillLine(doc, label, items, y) {
  const text = `${label}: ${items.join(', ')}`;
  doc.text(text, 40, y, { width: 500 });
  return y + 12;
}

module.exports = generateResume;