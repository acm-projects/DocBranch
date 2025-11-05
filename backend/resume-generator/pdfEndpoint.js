const express = require('express');
const fs = require('fs');
const path = require('path');
const Resume = require('./Resume');

const app = express();
app.use(express.json({ limit: '5mb' }));

const OUT_DIR = path.resolve(__dirname, 'generated-resumes');
fs.mkdirSync(OUT_DIR, { recursive: true });

/**
 * POST /generate-pdf
 * Body: either { resume: { ... }, metadata: {...} } or the resume object itself
 * Returns: PDF file as a download
 */
app.post('/generate-pdf', async (req, res) => {
  try {

    const payload = req.body || {};
    const resumeObj = payload.resume || payload;

    if (!resumeObj || Object.keys(resumeObj).length === 0) {
      return res.status(400).json({ error: 'Missing resume object in request body' });
    }

    const filename = `resume-${Date.now()}-${Math.random().toString(36).slice(2,8)}.pdf`;
    const outPath = path.join(OUT_DIR, filename);

    // Generate PDF to disk (reuse existing helper)
    await Resume.fromObjectToPDF(resumeObj, outPath);

    // Stream as download, then unlink the temporary file
    res.download(outPath, filename, err => {
      if (err) {
        console.error('Error sending generated PDF:', err);
      }
      // best-effort cleanup
      fs.unlink(outPath, e => { if (e) console.warn('Failed to remove temp pdf', outPath, e && e.message); });
    });
  } catch (error) {
    console.error('Error in /generate-pdf:', error && error.stack || error);
    res.status(500).json({ error: error && error.message ? error.message : String(error) });
  }
});

const PORT = 3080;
app.listen(PORT, () => {
  console.log(`Resume PDF endpoint listening on http://localhost:${PORT}/generate-pdf`);
});

module.exports = app;
