const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Resume - a class to generate a resume PDF from a resume JSON structure.
 *
 * Usage:
 * const Resume = require('./Resume');
 * const r = new Resume({ data: resumeJson.resume });
 * await r.savePDF('out.pdf');
 */
class Resume {
  /**
   * Create a Resume generator instance.
   * @param {Object} options
   * @param {Object} [options.data] - The parsed resume JSON object (root should have `resume`).
   * @param {string} [options.fontsDir] - Optional fonts directory (defaults to ./fonts).
   * @param {Object} [options.pdfOptions] - Options forwarded to PDFDocument constructor.
   */
  constructor({ data = null, fontsDir = path.resolve(__dirname, 'fonts'), pdfOptions = {} } = {}) {
    this.resume = data;
    this.fontsDir = fontsDir;
    this.pdfOptions = Object.assign({ size: 'LETTER', margins: { top: 30, bottom: 30, left: 36, right: 36 } }, pdfOptions);

    // layout constants (extracted from original function)
    this.userNameFontSize = 24;
    this.smallTextFontSize = 10;
    this.positionTitleFontSize = 10;
    this.sectionTitleFontSize = 12;
    this.lineGapSize = 0;
    this.spaceAboveLine = 0.25;
    this.spaceBelowLine = 0.5;
    this.gapBetweenEachItem = 0.15;
    this.gapAboveSectionTitle = 0.25;
    this.indentSize = 14;
    this.bulletIndent = 14 + this.indentSize;
    this.bulletTextIndent = this.bulletIndent + 4;

    this.doc = null; // will hold PDFDocument instance
  }

  /** Load resume from a JSON file path. */
  loadFromFile(jsonFilePath) {
    const content = fs.readFileSync(jsonFilePath, 'utf8');
    const parsed = JSON.parse(content);
    this.resume = parsed.resume || parsed;
    return this.resume;
  }

  /** Register fonts used by the template. */
  registerFonts(doc) {
    doc.registerFont('CMUSerif', path.resolve(this.fontsDir, 'cmunrm.ttf'));
    doc.registerFont('CMUSerif-Bold', path.resolve(this.fontsDir, 'cmunbx.ttf'));
    doc.registerFont('CMUSerif-Italic', path.resolve(this.fontsDir, 'cmunti.ttf'));
    doc.registerFont('CMUSerif-BoldItalic', path.resolve(this.fontsDir, 'cmunbi.ttf'));
  }

  /** Convenience: create and pipe a PDFDocument and render the resume.
   * @param {stream.Writable} outputStream - destination stream for PDF bytes
   * @param {string[]} [sectionOrder] - array of section keys in the desired render order
   */
  renderToStream(outputStream, sectionOrder) {
    if (!this.resume) throw new Error('No resume data loaded.');
    this.doc = new PDFDocument(this.pdfOptions);
    this.registerFonts(this.doc);
    this.doc.pipe(outputStream);

    const resumeData = this.resume;
    const doc = this.doc;

    // Header: name and contact
    const info = resumeData.personal_information || {};
    doc.font('CMUSerif-Bold').fontSize(this.userNameFontSize)
      .text(info.name || '', { align: 'center' });

    const contactArr = [info.phone, info.email];
    if (info.links && Array.isArray(info.links)) {
      info.links.forEach(linkObj => {
        const key = Object.keys(linkObj)[0];
        contactArr.push(linkObj[key]);
      });
    }
    doc.font('CMUSerif').fontSize(this.smallTextFontSize)
      .text(contactArr.filter(Boolean).join(' | '), { align: 'center' });

    // Render sections using helper methods in requested order
    const defaultOrder = ['education', 'experience', 'projects', 'volunteer_experience', 'activities', 'skills'];
    const order = Array.isArray(sectionOrder) && sectionOrder.length ? sectionOrder : defaultOrder;

    const rendererMap = {
      education: () => this._renderEducation(resumeData.education),
      experience: () => this._renderExperience(resumeData.experience),
      projects: () => this._renderProjects(resumeData.projects),
      // accept both 'volunteer' and 'volunteer_experience'
      volunteer: () => this._renderVolunteer(resumeData.volunteer_experience),
      volunteer_experience: () => this._renderVolunteer(resumeData.volunteer_experience),
      activities: () => this._renderActivities(resumeData.activities),
      skills: () => this._renderSkills(resumeData.skills),
    };

    order.forEach(key => {
      const k = String(key || '').trim();
      const fn = rendererMap[k];
      if (typeof fn === 'function') {
        try {
          fn();
        } catch (err) {
          // don't crash entire rendering for a single section error
          /* eslint-disable no-console */
          console.error(`Error rendering section ${k}:`, err && err.message);
        }
      } else {
        // unknown section key: ignore
      }
    });

    // finalize
    doc.end();
    return doc;
  }

  /** Save the resume PDF to disk. Returns a Promise that resolves when stream ends.
   * @param {string} [outputPath]
   * @param {string[]} [sectionOrder]
   */
  savePDF(outputPath = 'resume.pdf', sectionOrder) {
    const resolved = path.resolve(__dirname, outputPath);
    const outStream = fs.createWriteStream(resolved);
    const doc = this.renderToStream(outStream, sectionOrder);
    return new Promise((resolve, reject) => {
      outStream.on('finish', () => resolve(resolved));
      outStream.on('error', reject);
      doc.on('error', reject);
    });
  }

  // Internal: draws the section header (small capitals style) and a rule
  _sectionHeader(title) {
    const doc = this.doc;
    doc.moveDown(this.gapAboveSectionTitle);
    this._smallCapitals(title, 'CMUSerif', this.sectionTitleFontSize);
    const y = doc.y + this.spaceAboveLine;
    doc.moveTo(doc.page.margins.left, y)
      .lineTo(doc.page.width - doc.page.margins.right, y)
      .stroke();
    doc.moveDown(this.spaceBelowLine);
  }

  _renderEducation(education) {
    if (!education || !Array.isArray(education) || education.length === 0) return;
    const doc = this.doc;
    this._sectionHeader('EDUCATION');
    education.forEach(edu => {
      doc.font('CMUSerif-Bold').fontSize(this.positionTitleFontSize)
        .text(`${edu.institution}, ${edu.location}`, { continued: true , indent: this.indentSize })
        .font('CMUSerif').fontSize(this.positionTitleFontSize)
        .text(`GPA: ${edu.GPA || ''}`, { align: 'right' });
      doc.font('CMUSerif-Italic').fontSize(this.smallTextFontSize)
        .text(`${(edu.majors && edu.majors.length) ? edu.majors.join(', ') : ''}${(edu.minors && edu.minors.length) ? ', Minor in ' + edu.minors.join(', ') : ''}`, { continued: true , indent: this.indentSize })
        .font('CMUSerif-Italic').fontSize(this.smallTextFontSize)
        .text(`${edu.duration || ''}`, { align: 'right' , indent: this.indentSize });
      doc.moveDown(this.gapBetweenEachItem);

      if (edu.description && Array.isArray(edu.description) && edu.description.length > 0) {
        edu.description.forEach(d => {
          doc.font('CMUSerif').fontSize(this.smallTextFontSize)
            .text(`• `, { indent: this.bulletIndent, continued: true })
            .text(`${d}`, { indent: this.bulletTextIndent, lineGap: this.lineGapSize, indentAllLines: true });
        });
      }
    });
  }

  _renderExperience(experience) {
    if (!experience || !Array.isArray(experience) || experience.length === 0) return;
    const doc = this.doc;
    this._sectionHeader('EXPERIENCE');
    experience.forEach(exp => {
      doc.font('CMUSerif-Bold').fontSize(this.positionTitleFontSize)
        .text(`${exp.role}`, { continued: true , indent: this.indentSize })
        .font('CMUSerif').fontSize(this.positionTitleFontSize)
        .text(`${exp.duration || ''}`, { align: 'right' , indent: this.indentSize });
      doc.font('CMUSerif-Italic').fontSize(this.smallTextFontSize)
        .text(`${exp.organization || ''}`, { continued: true , indent: this.indentSize })
        .font('CMUSerif-Italic').fontSize(this.smallTextFontSize)
        .text(`${exp.location || ''}`, { align: 'right' , indent: this.indentSize });

      if (exp.description && Array.isArray(exp.description) && exp.description.length > 0) {
        exp.description.forEach(r => {
          doc.font('CMUSerif').fontSize(this.smallTextFontSize)
            .text(`• `, { indent: this.bulletIndent, continued: true })
            .text(`${r}`, { indent: this.bulletTextIndent, lineGap: this.lineGapSize, indentAllLines: true });
        });
      }
      doc.moveDown(this.gapBetweenEachItem);
    });
  }

  _renderProjects(projects) {
    if (!projects || !Array.isArray(projects) || projects.length === 0) return;
    const doc = this.doc;
    this._sectionHeader('PROJECTS');
    projects.forEach(project => {
      doc.font('CMUSerif-Bold').fontSize(this.positionTitleFontSize)
        .text(`${project.name} | `, { continued: true , indent: this.indentSize })
        .font('CMUSerif-Italic').fontSize(this.smallTextFontSize)
        .text(`${(project.technologies || []).join(', ')}`, { continued: true , indent: this.indentSize })
        .font('CMUSerif').fontSize(this.smallTextFontSize)
        .text(`${project.duration || ''}`, { align: 'right' , indent: this.indentSize });
      if (project.description && Array.isArray(project.description) && project.description.length > 0) {
        project.description.forEach(d => {
          doc.font('CMUSerif').fontSize(this.smallTextFontSize)
            .text(`• `, { indent: this.bulletIndent, continued: true })
            .text(`${d}`, { indent: this.bulletTextIndent, lineGap: this.lineGapSize, indentAllLines: true });
        });
      }
      doc.moveDown(this.gapBetweenEachItem);
    });
  }

  _renderVolunteer(volunteer) {
    if (!volunteer || !Array.isArray(volunteer) || volunteer.length === 0) return;
    const doc = this.doc;
    this._sectionHeader('VOLUNTEER EXPERIENCE');
    volunteer.forEach(v => {
      doc.font('CMUSerif-Bold').fontSize(this.positionTitleFontSize)
        .text(`${v.role}`, { continued: true , indent: this.indentSize })
        .font('CMUSerif').fontSize(this.positionTitleFontSize)
        .text(`${v.duration || ''}`, { align: 'right' , indent: this.indentSize });
      if (v.description && Array.isArray(v.description) && v.description.length > 0) {
        v.description.forEach(d => {
          doc.font('CMUSerif').fontSize(this.smallTextFontSize)
            .text(`• `, { indent: this.bulletIndent, continued: true })
            .text(`${d}`, { indent: this.bulletTextIndent, lineGap: this.lineGapSize, indentAllLines: true });
        });
      }
      doc.moveDown(this.gapBetweenEachItem);
    });
  }

  _renderActivities(activities) {
    if (!activities || !Array.isArray(activities) || activities.length === 0) return;
    const doc = this.doc;
    this._sectionHeader('ACTIVITIES');
    activities.forEach(activity => {
      doc.font('CMUSerif-Bold').fontSize(this.positionTitleFontSize)
        .text(`${activity.organization}`, { continued: true , indent: this.indentSize })
        .font('CMUSerif').fontSize(this.positionTitleFontSize)
        .text(`${activity.duration || ''}`, { align: 'right' , indent: this.indentSize });
      if (activity.description && Array.isArray(activity.description) && activity.description.length > 0) {
        activity.description.forEach(d => {
          doc.font('CMUSerif').fontSize(this.smallTextFontSize)
            .text(`• `, { indent: this.bulletIndent, continued: true })
            .text(`${d}`, { indent: this.bulletTextIndent, lineGap: this.lineGapSize, indentAllLines: true });
        });
      }
      doc.moveDown(this.gapBetweenEachItem);
    });
  }

  _renderSkills(skills) {
    if (!skills || Object.keys(skills).length === 0) return;
    const doc = this.doc;
    this._sectionHeader('SKILLS');
    Object.entries(skills).forEach(([label, items]) => {
      if (items && items.length > 0) {
        doc.font('CMUSerif-Bold').fontSize(this.smallTextFontSize)
          .text(label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + ':', { continued: true , indent: this.indentSize })
          .font('CMUSerif').fontSize(this.smallTextFontSize)
          .text(` ${items.join(', ')}`, { indent: this.indentSize });
        doc.moveDown(this.gapBetweenEachItem);
      }
    });
  }

  _smallCapitals(header, font, fontSize) {
    const doc = this.doc;
    const textShift = 2;
    doc.font(font).fontSize(fontSize)
      .text(header.charAt(0), { align: 'left', continued: true });
    const baseY = doc.y;
    doc.font(font).fontSize(this.smallTextFontSize)
      .text(header.slice(1).toUpperCase(), doc.x, baseY + textShift);
  }

  /** Convenience static helper: generate PDF from a json file path. */
  /**
   * Generate PDF from a JSON file. Requires sectionOrder array to define render order.
   * @param {string} jsonFilePath
   * @param {string} outputFileName
   * @param {string[]} sectionOrder - ordered array of section keys (e.g. ['education','experience',...])
   */
  static async fromFileToPDF(jsonFilePath, outputFileName = 'resume.pdf', sectionOrder) {
    if (!Array.isArray(sectionOrder)) {
      throw new Error('fromFileToPDF requires sectionOrder array as the third argument');
    }
    const r = new Resume();
    r.loadFromFile(jsonFilePath);
    return r.savePDF(outputFileName, sectionOrder);
  }
}

module.exports = Resume;
