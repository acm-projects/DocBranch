const express = require('express');
const {
  getResumes,
  getProfiles,
  addOrUpdateResume,
  addOrUpdateProfile,
  getProfileByUser,
  getResumeById,
  deleteResumeById,
  getResumesByUser,
  deleteProfileById
} = require('./dynamo');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const fs = require('fs');
const path = require('path');

// load swagger.yaml if present (resolve relative to this file)
const swaggerPath = path.resolve(__dirname, 'swagger.yaml');
let swaggerDocument = null;
if (fs.existsSync(swaggerPath)) {
  try {
    swaggerDocument = YAML.load(swaggerPath);
  } catch (e) {
    console.warn('Failed to load swagger.yaml:', e && e.message);
  }
} else {
  console.warn('swagger.yaml not found at', swaggerPath);
}

const app = express();
app.use(express.json());
if (swaggerDocument) {
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
}

app.get('/', (req, res) => {
  res.send('DocBranch API is running. Visit /api-docs for API documentation.');
});

app.get('/resumes', async (req, res) => {
  try {
    const resumes = await getResumes();
    res.json(resumes);
  } catch (error) {
    console.error(error);
    res.status(500).json({err: `${error.message}`});
  }
});

app.get('/profiles', async (req, res) => {
  try {
    const profiles = await getProfiles();
    res.json(profiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({err: `${error.message}`});
  }
});

app.get('/resumes/:userid', async (req, res) => {
  const userid = req.params.userid;
  try {
    const resumes = await getResumesByUser(userid);
    res.json(resumes);
  } catch (error) {
    console.error(error);
    res.status(500).json({err: `${error.message}`});
  }
});

app.get('/profiles/:userid', async (req, res) => {
  const userid = req.params.userid;
  try {
    const profiles = await getProfileByUser(userid);
    res.json(profiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({err: `${error.message}`});
  }
});

app.get('/resumes/:userid/:resumeid', async (req, res) => {
  const userid = req.params.userid;
  const resumeid = req.params.resumeid;
  try {
    const resumes = await getResumeById(userid, resumeid);
    res.json(resumes);
  } catch (error) {
    console.error(error);
    res.status(500).json({err: `${error.message}`});
  }
});

app.post('/resumes', async (req, res) => {
  const resume = req.body;
  try {
    const newResume = await addOrUpdateResume(resume);
    res.json(newResume);
  } catch (error) {
    console.error(error);
    res.status(500).json({err: `${error.message}`});
  }
});

app.post('/profiles', async (req, res) => {
  const profile = req.body;
  try {
    const newProfile = await addOrUpdateProfile(profile);
    res.json(newProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({err: `${error.message}`});
  }
});

app.put('/resumes/:userid/:resumeid', async (req, res) => {
  const resume = req.body || {};
  const userid = req.params.userid;
  const resumeid = req.params.resumeid;
  
  resume.user_id = userid;
  resume.resume_id = resumeid;

  try {
    const newResume = await addOrUpdateResume(resume);
    res.json(newResume);
  } catch (error) {
    console.error(error);
    res.status(500).json({err: `${error.message}`});
  }
});

app.delete('/resumes/:userid/:resumeid', async (req, res) => {
  const userid = req.params.userid;
  const resumeid = req.params.resumeid;
  try {
    res.json(await deleteResumeById(userid, resumeid));
  } catch (error) {
    console.error(error);
    res.status(500).json({err: `${error.message}`});
  }
});

app.delete('/profiles/:userid', async (req, res) => {
  const userid = req.params.userid;
  try {
    res.json(await deleteProfileById(userid));
  } catch (error) {
    console.error(error);
    res.status(500).json({err: `${error.message}`});
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});