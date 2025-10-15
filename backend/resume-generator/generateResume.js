
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateResume(jsonFilePath, outputFileName = 'resume.pdf') {
  const resumeData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8')).resume;
  const outputPath = path.resolve(__dirname, outputFileName);
  const doc = new PDFDocument({ size: 'LETTER', margins: { top: 30, bottom: 30, left: 36, right: 36 } });
  const userNameFontSize = 24;
  const smallTextFontSize = 10;
  const positionTitleFontSize = 10;
  const sectionTitleFontSize = 12;
  const lineGapSize = 0;
  const spaceAboveLine = 0.25;
  const spaceBelowLine = 0.5;
  const gapBetweenEachItem = 0.15;
  const gapAboveSectionTitle = 0.25;
  const indentSize = 14;
  const bulletIndent = 14 + indentSize;
  const bulletTextIndent = bulletIndent + 4;
  doc.pipe(fs.createWriteStream(outputPath));

  // Register CMU Serif Roman font
  doc.registerFont('CMUSerif', path.resolve(__dirname, 'fonts', 'cmunrm.ttf'));
  doc.registerFont('CMUSerif-Bold', path.resolve(__dirname, 'fonts', 'cmunbx.ttf'));
  doc.registerFont('CMUSerif-Italic', path.resolve(__dirname, 'fonts', 'cmunti.ttf'));
  doc.registerFont('CMUSerif-BoldItalic', path.resolve(__dirname, 'fonts', 'cmunbi.ttf'));

  // Header: Name (LaTeX style: large, bold, centered)
  const info = resumeData.personal_information;
  doc.font('CMUSerif-Bold').fontSize(userNameFontSize)
    .text(info.name, { align: 'center' });
  // Contact line (LaTeX style: normal, centered)
  const contactArr = [info.phone, info.email];
  if (info.links && Array.isArray(info.links)) {
    info.links.forEach(linkObj => {
      const key = Object.keys(linkObj)[0];
      contactArr.push(linkObj[key]);
    });
  }
  doc.font('CMUSerif').fontSize(smallTextFontSize)
    .text(contactArr.filter(Boolean).join(' | '), { align: 'center' });
  // doc.moveDown(0.25);

  // Section: Education
  if (resumeData.education && Array.isArray(resumeData.education) && resumeData.education.length > 0) {
    doc.moveDown(gapAboveSectionTitle);
    smallCapitals('EDUCATION', 'CMUSerif', sectionTitleFontSize);
    let y = doc.y + spaceAboveLine;
    doc.moveTo(doc.page.margins.left, y)
      .lineTo(doc.page.width - doc.page.margins.right, y)
      .stroke();
    doc.moveDown(spaceBelowLine);
    resumeData.education.forEach(edu => {
      doc.font('CMUSerif-Bold').fontSize(positionTitleFontSize)
        .text(`${edu.institution}, ${edu.location}`, { continued: true , indent: indentSize })
        .font('CMUSerif').fontSize(positionTitleFontSize)
        .text(`GPA: ${edu.GPA}`, { align: 'right' });
      doc.font('CMUSerif-Italic').fontSize(smallTextFontSize)
        .text(`${(edu.majors && edu.majors.length) ? edu.majors.join(', ') : ''}${(edu.minors && edu.minors.length) ? ', Minor in ' + edu.minors.join(', ') : ''}`, { continued: true , indent: indentSize })
        .font('CMUSerif-Italic').fontSize(smallTextFontSize)
        .text(`${edu.duration}`, { align: 'right' , indent: indentSize });
      doc.moveDown(gapBetweenEachItem);

      if (edu.description && Array.isArray(edu.description) && edu.description.length > 0) {
        edu.description.forEach(d => {
          doc.font('CMUSerif').fontSize(smallTextFontSize)
            .text(`• `, { indent: bulletIndent, continued: true })
            .text(`${d}`, { indent: bulletTextIndent, lineGap: lineGapSize, indentAllLines: true });
        });
      }
    });
  }

  // Section: Experience
  if (resumeData.experience && Array.isArray(resumeData.experience) && resumeData.experience.length > 0) {
    doc.moveDown(gapAboveSectionTitle);
    smallCapitals('EXPERIENCE', 'CMUSerif', sectionTitleFontSize);
    y = doc.y + spaceAboveLine;
    doc.moveTo(doc.page.margins.left, y)
      .lineTo(doc.page.width - doc.page.margins.right, y)
      .stroke();
    doc.moveDown(spaceBelowLine);

    resumeData.experience.forEach(exp => {
      doc.font('CMUSerif-Bold').fontSize(positionTitleFontSize)
        .text(`${exp.role}`, { continued: true , indent: indentSize })
        .font('CMUSerif').fontSize(positionTitleFontSize)
        .text(`${exp.duration}`, { align: 'right' , indent: indentSize });
      doc.font('CMUSerif-Italic').fontSize(smallTextFontSize)
        .text(`${exp.organization}`, { continued: true , indent: indentSize })
        .font('CMUSerif-Italic').fontSize(smallTextFontSize)
        .text(`${exp.location}`, { align: 'right' , indent: indentSize });

      if (exp.description && Array.isArray(exp.description) && exp.description.length > 0) {
        exp.description.forEach(r => {
          doc.font('CMUSerif').fontSize(smallTextFontSize)
            .text(`• `, { indent: bulletIndent, continued: true })
            .text(`${r}`, { indent: bulletTextIndent, lineGap: lineGapSize, indentAllLines: true });
        });
      }
      doc.moveDown(gapBetweenEachItem);
    });
  }

  // Section: Projects
  if (resumeData.projects && Array.isArray(resumeData.projects) && resumeData.projects.length > 0) {
    doc.moveDown(gapAboveSectionTitle);
    smallCapitals('PROJECTS', 'CMUSerif', sectionTitleFontSize);
    y = doc.y + spaceAboveLine;
    doc.moveTo(doc.page.margins.left, y)
     .lineTo(doc.page.width - doc.page.margins.right, y)
     .stroke();
    doc.moveDown(spaceBelowLine);
    resumeData.projects.forEach(project => {
      doc.font('CMUSerif-Bold').fontSize(positionTitleFontSize)
        .text(`${project.name}`, { continued: true , indent: indentSize })
        .font('CMUSerif-Italic').fontSize(smallTextFontSize)
        .text(` | ${project.technologies.join(', ')}`, { continued: true , indent: indentSize })
        .font('CMUSerif').fontSize(smallTextFontSize)
        .text(`${project.duration}`, { align: 'right' , indent: indentSize });
      if (project.description && Array.isArray(project.description) && project.description.length > 0) {
        project.description.forEach(d => {
          doc.font('CMUSerif').fontSize(smallTextFontSize)
          .text(`• `, { indent: bulletIndent, continued: true })
            .text(`${d}`, { indent: bulletTextIndent, lineGap: lineGapSize, indentAllLines: true });
        });
      }
      doc.moveDown(gapBetweenEachItem);
    });
  }

  // Section: Volunteer Experience
  if (resumeData.volunteer_experience && Array.isArray(resumeData.volunteer_experience) && resumeData.volunteer_experience.length > 0) {
    doc.moveDown(gapAboveSectionTitle);
    smallCapitals('VOLUNTEER EXPERIENCE', 'CMUSerif', sectionTitleFontSize);
    y = doc.y + spaceAboveLine;
    doc.moveTo(doc.page.margins.left, y)
     .lineTo(doc.page.width - doc.page.margins.right, y)
     .stroke();
    doc.moveDown(spaceBelowLine);

    resumeData.volunteer_experience.forEach(volunteer => {
      doc.font('CMUSerif-Bold').fontSize(positionTitleFontSize)
        .text(`${volunteer.role}`, { continued: true , indent: indentSize })
        .font('CMUSerif').fontSize(positionTitleFontSize)
        .text(`${volunteer.duration}`, { align: 'right' , indent: indentSize });
      if (volunteer.description && Array.isArray(volunteer.description) && volunteer.description.length > 0) {
        volunteer.description.forEach(d => {
          doc.font('CMUSerif').fontSize(smallTextFontSize)
            .text(`• `, { indent: bulletIndent, continued: true })
            .text(`${d}`, { indent: bulletTextIndent, lineGap: lineGapSize, indentAllLines: true });
        });
      }
      doc.moveDown(gapBetweenEachItem);
    });
  }

  // Section: Activities
  if (resumeData.activities && Array.isArray(resumeData.activities) && resumeData.activities.length > 0) {
    doc.moveDown(gapAboveSectionTitle);
    smallCapitals('ACTIVITIES', 'CMUSerif', sectionTitleFontSize);
    y = doc.y + spaceAboveLine;
    doc.moveTo(doc.page.margins.left, y)
     .lineTo(doc.page.width - doc.page.margins.right, y)
     .stroke();
    doc.moveDown(spaceBelowLine);

    resumeData.activities.forEach(activity => {
      doc.font('CMUSerif-Bold').fontSize(positionTitleFontSize)
        .text(`${activity.organization}`, { continued: true , indent: indentSize })
        .font('CMUSerif').fontSize(positionTitleFontSize)
        .text(`${activity.duration}`, { align: 'right' , indent: indentSize });
      if (activity.description && Array.isArray(activity.description) && activity.description.length > 0) {
        activity.description.forEach(d => {
          doc.font('CMUSerif').fontSize(smallTextFontSize)
            .text(`• `, { indent: bulletIndent, continued: true })
            .text(`${d}`, { indent: bulletTextIndent, lineGap: lineGapSize, indentAllLines: true });
        });
      }
      doc.moveDown(gapBetweenEachItem);
    });
  }

  // Section: Skills
  if (resumeData.skills && Object.keys(resumeData.skills).length > 0) {
    doc.moveDown(gapAboveSectionTitle);
    smallCapitals('SKILLS', 'CMUSerif', sectionTitleFontSize);
    y = doc.y + spaceAboveLine;
    doc.moveTo(doc.page.margins.left, y)
     .lineTo(doc.page.width - doc.page.margins.right, y)
     .stroke();
    doc.moveDown(spaceBelowLine);
    Object.entries(resumeData.skills).forEach(([label, items]) => {
      if (items && items.length > 0) {
        doc.font('CMUSerif-Bold').fontSize(smallTextFontSize)
          .text(label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + ':', { continued: true , indent: indentSize })
          .font('CMUSerif').fontSize(smallTextFontSize)
          .text(` ${items.join(', ')}`, { indent: indentSize });
        doc.moveDown(gapBetweenEachItem);
      }
    });
  }

  doc.end();
  doc.on('end', () => console.log('Resume generated at:', outputPath));

  function smallCapitals(header, font, fontSize) {
    const textShift = 2;
    doc.font(font).fontSize(fontSize)
      .text(header.charAt(0), { align: 'left', continued: true });
    const baseY = doc.y;
    doc.font(font).fontSize(smallTextFontSize)
      .text(header.slice(1).toUpperCase(), doc.x, baseY + textShift);
  }
}

module.exports = generateResume;