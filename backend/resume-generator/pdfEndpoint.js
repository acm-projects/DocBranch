const express = require('express');
const fs = require('fs');
const path = require('path');
const Resume = require('./Resume');

// Create a router so this module can be mounted into the main API server.
const router = express.Router();
router.use(express.json({ limit: '5mb' }));

// Allow simple CORS when this router is used standalone. When mounted into the
// main server (apicall.js) CORS is controlled by that server. Keeping permissive
// headers here makes it safe to run standalone for local development.
router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const OUT_DIR = path.resolve(__dirname, 'generated-resumes');
fs.mkdirSync(OUT_DIR, { recursive: true });

/**
 * POST /
 * Body: either { resume: { ... }, metadata: {...} } or the resume object itself
 * Returns: PDF file as a download
 * NOTE: router is intended to be mounted at /generate-pdf by the host app.
 */
router.post('/', async (req, res) => {
  try {
    const payload = req.body && (req.body.Item || req.body) || {};
    const resumeObj = payload.resume || payload;

    if (!resumeObj || Object.keys(resumeObj).length === 0) {
      return res.status(400).json({ error: 'Missing resume object in request body' });
    }

    const filename = `resume-${Date.now()}-${Math.random().toString(36).slice(2,8)}.pdf`;
    const outPath = path.join(OUT_DIR, filename);

  // Generate PDF to disk (reuse existing helper).
  // Pass the original payload so metadata (e.g. metadata.resume_info.section_order)
  // is preserved. Previously we passed only the resume object which dropped metadata.
  await Resume.fromObjectToPDF(payload, outPath);

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

// If run directly, start a small server so the file still works standalone.
if (require.main === module) {
  const app = express();
  app.use('/generate-pdf', router);
  const PORT = 3080;
  app.listen(PORT, () => {
    console.log(`Resume PDF endpoint listening on http://localhost:${PORT}/generate-pdf`);
  });
}

module.exports = router;
