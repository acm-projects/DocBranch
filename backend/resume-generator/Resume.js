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
    this.metadata = null;
    this.fontsDir = fontsDir;
    this.pdfOptions = Object.assign({ size: 'LETTER', margins: { top: 30, bottom: 30, left: 36, right: 36 } }, pdfOptions);

    // layout constants 
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
    // allow metadata either at top-level or inside the resume object
    this.metadata = parsed.metadata || (parsed.resume && parsed.resume.metadata) || null;
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
   */
  renderToStream(outputStream) {
    if (!this.resume) throw new Error('No resume data loaded.');
    this.doc = new PDFDocument(this.pdfOptions);
    this.registerFonts(this.doc);
    this.doc.pipe(outputStream);

    const resumeData = this.resume;
    const doc = this.doc;

    // Header: name and top-right location/address on the same line
    const info = resumeData.personal_information || {};

    // prefer explicit location, fall back to address
    const headerRight = (info.location && info.location.toString().trim()) || (info.address && info.address.toString().trim()) || '';
    const marginTop = doc.page.margins.top || 30;
    const usableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

    // We'll draw both name and location on the same Y (snap to the top margin).
    const headerY = marginTop;

    // Draw right-aligned small location at the top of the line
    if (headerRight) {
      doc.font('CMUSerif').fontSize(this.smallTextFontSize)
        .text(headerRight, doc.page.margins.left, headerY, { width: usableWidth, align: 'right' });
    }

    // Draw the name centered on the same Y. Using a larger font; letting PDFKit handle baseline differences.
    doc.font('CMUSerif-Bold').fontSize(this.userNameFontSize)
      .text(info.name || '', doc.page.margins.left, headerY, { width: usableWidth, align: 'center' });

    // Contact row below the name
    const contactArr = [info.phone, info.email];
    // Include common profile shortcuts if provided
    if (info.linkedin) contactArr.push(info.linkedin);
    if (info.github) contactArr.push(info.github);
    if (info.links && Array.isArray(info.links)) {
      info.links.forEach(linkObj => {
        const key = Object.keys(linkObj)[0];
        contactArr.push(linkObj[key]);
      });
    }
    const contactY = headerY + this.userNameFontSize + 6;
    doc.font('CMUSerif').fontSize(this.smallTextFontSize)
      .text(contactArr.filter(Boolean).join(' | '), doc.page.margins.left, contactY, { width: usableWidth, align: 'center' });

    // Render sections using helper methods in requested order; accept arbitrary section names.
    // Use metadata.section_order when available (support metadata at root or inside resume),
    // otherwise iterate over the keys of the resume object.
    const sectionOrder = (this.metadata && this.metadata.resume_info && this.metadata.resume_info.section_order) || null;

    // Build an explicit rendering order. If metadata provides a section_order array,
    // match each requested name to an actual key in the resume JSON. Matching is
    // tolerant to spacing/underscores/casing (e.g. 'Work Experience' -> 'experience').
    // Any keys not mentioned in the metadata order are appended after the ordered ones.
    let order = null;
    if (Array.isArray(sectionOrder) && sectionOrder.length > 0) {
      // stronger normalization: strip ALL non-alphanumerics to avoid punctuation/spacing
      const normalize = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
      const keys = Object.keys(resumeData || {});

      // map normalized forms of keys to the actual key name (preserve first occurrence)
      const normToKey = {};
      keys.forEach(k => {
        const nk = normalize(k);
        if (!normToKey[nk]) normToKey[nk] = k;
        // also map formatted section title to key (e.g., 'Leadership Experience' -> 'leadership_experience')
        const fk = normalize(this._formatSectionTitle(k));
        if (!normToKey[fk]) normToKey[fk] = k;
      });

      const added = new Set();
      const ordered = [];

      // make a stable list of normalized tokens for matching
      const normKeys = Object.keys(normToKey);

      sectionOrder.forEach(req => {
        if (!req && req !== 0) return;
        const reqNorm = normalize(req);

        // 1) exact normalized match
        let match = normToKey[reqNorm];

        // 2) prefer candidates that start/end with reqNorm (more specific) — check longer tokens first
        if (!match) {
          const candidates = normKeys.slice().sort((a, b) => b.length - a.length);
          const found = candidates.find(n => n === reqNorm || n.endsWith(reqNorm) || n.startsWith(reqNorm));
          if (found) match = normToKey[found];
        }

        // 3) fallback: permissive substring match (least preferred)
        if (!match) {
          const found = normKeys.find(n => n.includes(reqNorm) || reqNorm.includes(n));
          if (found) match = normToKey[found];
        }

        if (match) {
          if (!added.has(match)) {
            ordered.push(match);
            added.add(match);
          }
        } else {
          // helpful debug output when metadata entries don't match any key
          /* eslint-disable no-console */
          console.warn && console.warn(`Warning: metadata.section_order entry "${req}" did not match any resume section key.`);
        }
      });

      // Append any remaining keys (preserve original key order), skipping internal keys
      keys.forEach(k => {
        if (added.has(k)) return;
        if (k === 'personal_information' || k === 'metadata') return;
        ordered.push(k);
      });

      order = ordered;
    } else {
      order = Object.keys(resumeData || {});
    }

    const rendererMap = {
      education: () => this._renderEducation(resumeData.education),
      experience: () => this._renderExperience(resumeData.experience),
      projects: () => this._renderProjects(resumeData.projects),
    };

    order.forEach(key => {
      const k = String(key || '').trim();
      // skip personal_information (already printed) and internal keys
      if (!k || k === 'personal_information' || k === 'metadata') return;

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
        // unknown section key: render generically using the section key as title
        try {
          this._renderGenericSection(k, resumeData[k]);
        } catch (err) {
          /* eslint-disable no-console */
          console.error(`Error rendering generic section ${k}:`, err && err.message);
        }
      }
    });

    // finalize
    doc.end();
    return doc;
  }

  /** Save the resume PDF to disk. Returns a Promise that resolves when stream ends.
   * @param {string} [outputPath]
   */
  savePDF(outputPath = 'resume.pdf') {
    const resolved = path.resolve(__dirname, outputPath);
    const outStream = fs.createWriteStream(resolved);
    const doc = this.renderToStream(outStream);
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
      //doc.moveDown(this.gapBetweenEachItem);
      doc.font('CMUSerif-Italic').fontSize(this.smallTextFontSize)
        .text(`${(edu.majors && edu.majors.length) ? edu.majors.join(', ') : ''}${(edu.minors && edu.minors.length) ? ', Minor in ' + edu.minors.join(', ') : ''}`, { continued: true , indent: this.indentSize })
        .font('CMUSerif-Italic').fontSize(this.smallTextFontSize);

      // Build a safe date string: prefer start_date + ' - ' + end_date when both exist,
      // otherwise fall back to edu.date, otherwise empty string.
      const eduDate = (edu && edu.start_date && edu.end_date)
        ? `${edu.start_date} - ${edu.end_date}`
        : (edu && edu.date) || '';

      doc.text(eduDate, { align: 'right' });
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
    doc.moveDown(this.gapAboveSectionTitle);
    this._sectionHeader('EXPERIENCE');
    experience.forEach(exp => {
      // determine date/duration display: prefer explicit start/end, then date, then duration
      const start = (exp.start_date || exp.start || '').toString().trim();
      const end = (exp.end_date || exp.end || '').toString().trim();
      let right = '';
      if (start || end) {
        right = start + (end ? ' - ' + end : '');
      } else if ((exp.date || '').toString().trim()) {
        right = exp.date.toString().trim();
      } else if ((exp.duration || '').toString().trim()) {
        right = exp.duration.toString().trim();
      }

      // display either exp.name or exp.company first (fall back to role)
      const main = (exp.name || exp.company || exp.organization || '').toString().trim();
      doc.font('CMUSerif-Bold').fontSize(this.positionTitleFontSize)
        .text(`${main}`, { continued: true , indent: this.indentSize })
        .font('CMUSerif').fontSize(this.positionTitleFontSize)
        .text(`${right}`, { align: 'right' , indent: this.indentSize });

      // show organization on left and prefer location or address on the right
      const location = (exp.location || exp.address || '').toString().trim();
      doc.font('CMUSerif-Italic').fontSize(this.smallTextFontSize)
        .text(`${exp.role || ''}`, { continued: true , indent: this.indentSize })
        .font('CMUSerif-Italic').fontSize(this.smallTextFontSize)
        .text(`${location}`, { align: 'right' , indent: this.indentSize , continued: false });
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
      // compute a safe date string: prefer start_date - end_date, else project.date, else empty
      const start = (project.start_date || project.start || '').toString().trim();
      const end = (project.end_date || project.end || '').toString().trim();
      const dateStr = (start || end) ? (start + (end ? ' - ' + end : '')) : ((project.date || '').toString().trim() || '');

      doc.font('CMUSerif-Bold').fontSize(this.positionTitleFontSize)
        .text(`${project.name} | `, { continued: true , indent: this.indentSize })
        .font('CMUSerif-Italic').fontSize(this.smallTextFontSize)
        .text(`${(project.technologies || []).join(', ')}`, { continued: true , indent: this.indentSize })
        .font('CMUSerif').fontSize(this.smallTextFontSize)
        .text(`${dateStr}`, { align: 'right' , indent: this.indentSize });
      doc.moveDown(1);
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

  // _renderVolunteer(volunteer) {
  //   if (!volunteer || !Array.isArray(volunteer) || volunteer.length === 0) return;
  //   const doc = this.doc;
  //   this._sectionHeader('VOLUNTEER EXPERIENCE');
  //   volunteer.forEach(v => {
  //     doc.font('CMUSerif-Bold').fontSize(this.positionTitleFontSize)
  //       .text(`${v.role}`, { continued: true , indent: this.indentSize })
  //       .font('CMUSerif').fontSize(this.positionTitleFontSize)
  //       .text(`${v.duration || ''}`, { align: 'right' , indent: this.indentSize });
  //     if (v.description && Array.isArray(v.description) && v.description.length > 0) {
  //       v.description.forEach(d => {
  //         doc.font('CMUSerif').fontSize(this.smallTextFontSize)
  //           .text(`• `, { indent: this.bulletIndent, continued: true })
  //           .text(`${d}`, { indent: this.bulletTextIndent, lineGap: this.lineGapSize, indentAllLines: true });
  //       });
  //     }
  //     doc.moveDown(this.gapBetweenEachItem);
  //   });
  // }

  // _renderActivities(activities) {
  //   if (!activities || !Array.isArray(activities) || activities.length === 0) return;
  //   const doc = this.doc;
  //   this._sectionHeader('ACTIVITIES');
  //   activities.forEach(activity => {
  //     doc.font('CMUSerif-Bold').fontSize(this.positionTitleFontSize)
  //       .text(`${activity.organization}`, { continued: true , indent: this.indentSize })
  //       .font('CMUSerif').fontSize(this.positionTitleFontSize)
  //       .text(`${activity.duration || ''}`, { align: 'right' , indent: this.indentSize });
  //     if (activity.description && Array.isArray(activity.description) && activity.description.length > 0) {
  //       activity.description.forEach(d => {
  //         doc.font('CMUSerif').fontSize(this.smallTextFontSize)
  //           .text(`• `, { indent: this.bulletIndent, continued: true })
  //           .text(`${d}`, { indent: this.bulletTextIndent, lineGap: this.lineGapSize, indentAllLines: true });
  //       });
  //     }
  //     doc.moveDown(this.gapBetweenEachItem);
  //   });
  // }

  // _renderSkills(skills) {
  //   if (!skills || Object.keys(skills).length === 0) return;
  //   const doc = this.doc;
  //   this._sectionHeader('SKILLS');
  //   Object.entries(skills).forEach(([label, items]) => {
  //     if (items && items.length > 0) {
  //       doc.font('CMUSerif-Bold').fontSize(this.smallTextFontSize)
  //         .text(label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + ':', { continued: true , indent: this.indentSize })
  //         .font('CMUSerif').fontSize(this.smallTextFontSize)
  //         .text(` ${items.join(', ')}`, { indent: this.indentSize });
  //       doc.moveDown(this.gapBetweenEachItem);
  //     }
  //   });
  // }

  /**
   * Convert a JSON section key into a human-friendly title.
   * e.g. 'leadership_experience' -> 'Leadership Experience'
   */
  _formatSectionTitle(key) {
    if (!key) return '';
    return String(key).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  /**
   * Generic renderer for unknown section keys. Attempts to display arrays of objects,
   * arrays of strings, or key->array mappings sensibly.
   */
  _renderGenericSection(key, data) {
    if (!data) return;
    const doc = this.doc;
    this._sectionHeader(this._formatSectionTitle(key));

    if (Array.isArray(data)) {
      if (data.length === 0) return;

      // simple list of strings/numbers: skip null/undefined/blank items
      if (typeof data[0] === 'string' || typeof data[0] === 'number') {
        data.forEach(item => {
          if (item === null || item === undefined) return; // skip empty
          const s = String(item);
          if (s.trim() === '') return; // skip whitespace-only
          doc.font('CMUSerif').fontSize(this.smallTextFontSize)
             .text(s, { indent: this.indentSize });
          doc.moveDown(this.gapBetweenEachItem);
        });
        return;
      }

      // array of objects
      data.forEach(item => {
        if (!item || typeof item !== 'object') return;
        // determine main/right fields more robustly
        const main = (item.role || item.name || item.title || item.organization || item.institution || '').toString().trim();
        const start = (item.start_date || item.start || '').toString().trim();
        const end = (item.end_date || item.end || '').toString().trim();
        const right = (start || end) ? (start + (end ? ' - ' + end : '')) : ((item.date || '').toString().trim());

        let printedSomething = false;

        if (main || right) {
          doc.font('CMUSerif-Bold').fontSize(this.positionTitleFontSize)
            .text(`${main}`, { continued: true, indent: this.indentSize })
            .font('CMUSerif').fontSize(this.positionTitleFontSize)
            .text(`${right}`, { align: 'right', indent: this.indentSize });
          printedSomething = true;
        }

        const secondary = (item.organization || item.institution || item.location || item.company || '').toString().trim();
        if (secondary) {
          doc.font('CMUSerif-Italic').fontSize(this.smallTextFontSize)
            .text(`${secondary}`, { indent: this.indentSize });
          printedSomething = true;
        }

        // render any array properties as bullets, and plain strings as small text
        Object.entries(item).forEach(([prop, val]) => {
          if ([ 'role', 'name', 'title', 'organization', 'institution', 'location', 'duration', 'start_date', 'end_date', 'date', 'start', 'end' ].includes(prop)) return;
          if (Array.isArray(val)) {
            val.forEach(d => {
              if (d === null || d === undefined) return;
              const ds = String(d).trim();
              if (ds === '') return;
              doc.font('CMUSerif').fontSize(this.smallTextFontSize)
                .text(`• `, { indent: this.bulletIndent, continued: true })
                .text(`${ds}`, { indent: this.bulletTextIndent, lineGap: this.lineGapSize, indentAllLines: true });
              printedSomething = true;
            });
          } else if (typeof val === 'string' && val.trim()) {
            doc.font('CMUSerif').fontSize(this.smallTextFontSize)
              .text(`${val}`, { indent: this.indentSize });
            printedSomething = true;
          }
        });

        if (printedSomething) doc.moveDown(this.gapBetweenEachItem);
      });
    } else if (typeof data === 'object') {
      // object mapping like skills: { category: [items] }
      Object.entries(data).forEach(([label, items]) => {
        if (!items) return;
        if (Array.isArray(items)) {
          doc.font('CMUSerif-Bold').fontSize(this.smallTextFontSize)
            .text(label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + ':', { continued: true, indent: this.indentSize })
            .font('CMUSerif').fontSize(this.smallTextFontSize)
            .text(` ${items.join(', ')}`, { indent: this.indentSize });
          doc.moveDown(this.gapBetweenEachItem);
        } else if (typeof items === 'string') {
          doc.font('CMUSerif').fontSize(this.smallTextFontSize)
            .text(`${label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${items}`, { indent: this.indentSize });
          doc.moveDown(this.gapBetweenEachItem);
        }
      });
    } else {
      // primitive
      doc.font('CMUSerif').fontSize(this.smallTextFontSize)
        .text(String(data), { indent: this.indentSize });
    }
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
   * Generate PDF from a JSON file.
   * @param {string} jsonFilePath
   * @param {string} outputFileName
   */
  static async fromFileToPDF(jsonFilePath, outputFileName = 'resume.pdf') {
    const r = new Resume();
    r.loadFromFile(jsonFilePath);
    return r.savePDF(outputFileName);
  }

  /**
   * Generate PDF directly from a parsed JSON object (not a file path).
   * Accepts either { resume: { ... }, metadata: { ... } } or the resume object itself.
   * @param {Object} jsonObject
   * @param {string} outputFileName
   */
  static async fromObjectToPDF(jsonObject, outputFileName = 'resume.pdf') {
    const payload = jsonObject || {};
    const resumeData = payload.resume || payload;
    const r = new Resume({ data: resumeData });
    // preserve metadata if provided at top-level or in payload.resume
    r.metadata = payload.metadata || (payload.resume && payload.resume.metadata) || null;
    return r.savePDF(outputFileName);
  }
}

module.exports = Resume;
