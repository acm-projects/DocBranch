const express = require('express');
const { getResumes, getResumeById, addOrUpdateResume, deleteResumeById, getResumesByUser } = require('./dynamo');
const app = express();

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});