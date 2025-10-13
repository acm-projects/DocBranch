


const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateResume(resumeData, outputFileName = 'newjakes-resume.pdf') {
  const outputPath = path.resolve(__dirname, outputFileName);
  // const fontPath = path.resolve(__dirname, 'fonts', 'cmunrm.ttf');
  const doc = new PDFDocument({ size: 'LETTER', margins: { top: 36, bottom: 36, left: 36, right: 36 } });
  const nameSize = 24;
  const textSize = 10;
  const itemSize = 11;
  const headingSize = 12;
  const spaceAboveLine = 0.25;
  const headingPadding = 0.5;
  const itemGap = 0.15;
  const headingGap = 0.25;
  const indentSize = 14;
  const bulletIndent = 14 + indentSize;
  doc.pipe(fs.createWriteStream(outputPath));

  // Register CMU Serif Roman font
  doc.registerFont('CMUSerif', path.resolve(__dirname, 'fonts', 'cmunrm.ttf'));
  doc.registerFont('CMUSerif-Bold', path.resolve(__dirname, 'fonts', 'cmunbx.ttf'));
  doc.registerFont('CMUSerif-Italic', path.resolve(__dirname, 'fonts', 'cmunti.ttf'));
  doc.registerFont('CMUSerif-BoldItalic', path.resolve(__dirname, 'fonts', 'cmunbi.ttf'));

  // Header: Name (LaTeX style: large, bold, centered)
  const info = resumeData.personal_information;
  doc.font('CMUSerif-Bold').fontSize(nameSize)
    .text(info.name, { align: 'center' });
  // Contact line (LaTeX style: normal, centered)
  doc.font('CMUSerif').fontSize(textSize)
    .text(
      [info.phone, info.email, info.linkedin, info.github].filter(Boolean).join(' | '),
      { align: 'center' }
    );
  doc.moveDown(0.5);

  // Section: Education (LaTeX style: section header bold, 12pt)
  smallCapitals('EDUCATION', 'CMUSerif', headingSize);
  y = doc.y + spaceAboveLine; // Slightly below the heading
  doc.moveTo(doc.page.margins.left, y)
    .lineTo(doc.page.width - doc.page.margins.right, y)
    .stroke();
  doc.moveDown(headingPadding);
  resumeData.education.forEach(edu => {
    doc.font('CMUSerif-Bold').fontSize(itemSize)
      .text(`${edu.institution}`, { continued: true , indent: indentSize })
      .font('CMUSerif').fontSize(itemSize)
      .text(`${edu.location}`, { align: 'right' });
    doc.font('CMUSerif-Italic').fontSize(textSize)
      .text(`${edu.degree}${edu.minor ? ', Minor in ' + edu.minor : ''}`, { continued: true , indent: indentSize })
      .font('CMUSerif-Italic').fontSize(textSize)
      .text(`${edu.duration}`, { align: 'right' , indent: indentSize });
    doc.moveDown(itemGap);
  });

  // Section: Experience
  doc.moveDown(headingGap);
  smallCapitals('EXPERIENCE', 'CMUSerif', headingSize);
  y = doc.y + spaceAboveLine; // Slightly below the heading
  doc.moveTo(doc.page.margins.left, y)
    .lineTo(doc.page.width - doc.page.margins.right, y)
    .stroke();
  doc.moveDown(headingPadding);

  resumeData.experience.forEach(exp => {
    doc.font('CMUSerif-Bold').fontSize(itemSize)
      .text(`${exp.position}`, { continued: true , indent: indentSize })
      .font('CMUSerif').fontSize(itemSize)
      .text(`${exp.duration}`, { align: 'right' , indent: indentSize });
    doc.font('CMUSerif-Italic').fontSize(textSize)
      .text(`${exp.organization}`, { continued: true , indent: indentSize })
      .font('CMUSerif-Italic').fontSize(textSize)
      .text(`${exp.location}`, { align: 'right' , indent: indentSize });

    exp.responsibilities.forEach(r => {
      doc.font('CMUSerif').fontSize(textSize)
        .text(`• ${r}`, { indent: bulletIndent, lineGap: 1 });
    });
    doc.moveDown(itemGap);
  });

  // Section: Projects
  doc.moveDown(headingGap);
  smallCapitals('PROJECTS', 'CMUSerif', headingSize);
  y = doc.y + spaceAboveLine; // Slightly below the heading
  doc.moveTo(doc.page.margins.left, y)
   .lineTo(doc.page.width - doc.page.margins.right, y)
   .stroke();
  doc.moveDown(headingPadding);
  resumeData.projects.forEach(project => {
    doc.font('CMUSerif-Bold').fontSize(itemSize)
      .text(`${project.name}`, { continued: true , indent: indentSize })
      .font('CMUSerif-Italic').fontSize(textSize)
      .text(` | ${project.technologies.join(', ')}`, { continued: true , indent: indentSize })
      .font('CMUSerif').fontSize(textSize)
      .text(`${project.duration}`, { align: 'right' , indent: indentSize });
    doc.font('CMUSerif').fontSize(textSize)
      .text(`• ${project.description}`, { indent: bulletIndent, lineGap: 1 });
    project.achievements.forEach(a => {
      doc.font('CMUSerif').fontSize(textSize)
        .text(`• ${a}`, { indent: bulletIndent, lineGap: 1 });
    });
    doc.moveDown(itemGap);
  });

  // Section: Technical Skills
  doc.moveDown(headingGap);
  smallCapitals('TECHNICAL SKILLS', 'CMUSerif', headingSize);
  y = doc.y + spaceAboveLine; // Slightly below the heading
  doc.moveTo(doc.page.margins.left, y)
   .lineTo(doc.page.width - doc.page.margins.right, y)
   .stroke();
  doc.moveDown(headingPadding);
  
  Object.entries(resumeData.skills).forEach(([label, items]) => {
    doc.font('CMUSerif-Bold').fontSize(textSize)
      .text(label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + ':', { continued: true , indent: indentSize })
      .font('CMUSerif').fontSize(textSize)
      .text(` ${items.join(', ')}`, { indent: indentSize });
    doc.moveDown(itemGap);
  });

  doc.end();
  doc.on('end', () => console.log('Resume generated at:', outputPath));

  function smallCapitals(header, font, fontSize) {
    const textShift = 2;
    doc.font(font).fontSize(fontSize)
      .text(header.charAt(0), { align: 'left', continued: true });
    const baseY = doc.y;
    doc.font(font).fontSize(textSize)
      .text(header.slice(1).toUpperCase(), doc.x, baseY + textShift);
  }
}

module.exports = generateResume;