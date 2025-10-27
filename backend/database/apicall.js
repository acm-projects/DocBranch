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
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/resumes', async (req, res) => {
  try {
    const resumes = await getResumes();
    res.json(resumes);
  } catch (error) {
    console.error(err);
    res.status(500).json({err: 'Something went wrong'});
  }
});

app.get('/profiles', async (req, res) => {
  try {
    const profiles = await getProfiles();
    res.json(profiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({err: 'Something went wrong'});
  }
});

app.get('/resumes/:userid', async (req, res) => {
  const userid = req.params.userid;
  try {
    const resumes = await getResumesByUser(userid);
    res.json(resumes);
  } catch (error) {
    console.error(error);
    res.status(500).json({err: 'Something went wrong'});
  }
});

app.get('/profiles/:userid', async (req, res) => {
  const userid = req.params.userid;
  try {
    const profiles = await getProfileByUser(userid);
    res.json(profiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({err: 'Something went wrong'});
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
    res.status(500).json({err: 'Something went wrong'});
  }
});

app.post('/resumes', async (req, res) => {
  const resume = req.body;
  try {
    const newResume = await addOrUpdateResume(resume);
    res.json(newResume);
  } catch (error) {
    console.error(error);
    res.status(500).json({err: 'Something went wrong'});
  }
});

app.post('/profiles', async (req, res) => {
  const profile = req.body;
  try {
    const newProfile = await addOrUpdateProfile(profile);
    res.json(newProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({err: 'Something went wrong'});
  }
});

app.put('/resumes/:userid/:resumeid', async (req, res) => {
  const resume = req.body;
  const userid = req.params.userid;
  const resumeid = req.params.resumeid;
  resume.user_id = userid;
  resume.resume_id = resumeid;
  try {
    const newResume = await addOrUpdateResume(resume);
    res.json(newResume);
  } catch (error) {
    console.error(error);
    res.status(500).json({err: 'Something went wrong'});
  }
});

app.delete('/resumes/:userid/:resumeid', async (req, res) => {
  const userid = req.params.userid;
  const resumeid = req.params.resumeid;
  try {
    res.json(await deleteResumeById(userid, resumeid));
  } catch (error) {
    console.error(error);
    res.status(500).json({err: 'Something went wrong'});
  }
});

app.delete('/profiles/:userid', async (req, res) => {
  const userid = req.params.userid;
  try {
    res.json(await deleteProfileById(userid));
  } catch (error) {
    console.error(error);
    res.status(500).json({err: 'Something went wrong'});
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});