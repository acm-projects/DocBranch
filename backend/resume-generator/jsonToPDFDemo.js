const { app } = require('electron');
const Resume = require('./Resume');
const { queryKnowledgeBase } = require('../database/bedrockRAGsearch');

app.whenReady().then(() => {
  console.log('Electron started.');
  const path = require('path');
  // Demo: read the JSON file into an object and pass it to fromObjectToPDF
  const fs = require('fs');
  //const jsonFilePath = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, 'resume_json_files/newresume.json');
  try {
    const query = "Generate a new resume json file using the data in Allen Zheng's resumes that would be best to apply to this job posting";
    const jobDescription = "Company Overview ​At Motorola Solutions, we believe that everything starts with our people. Were a global close-knit community, united by the relentless pursuit to help keep people safer everywhere. Our critical communications, video security and command center technologies support public safety agencies and enterprises alike, enabling the coordination thats critical for safer communities, safer schools, safer hospitals and safer businesses. Connect with a career that matters, and help us build a safer future. Department Overview At Unified Communications, our vision is to build a safer world - unified by instant, secure and reliable communications. We build best-in-class broadband mission critical voice, video and data communications products. Our portfolio also includes Land Mobile Radio interoperability solutions. Innovation team at Unified Communication as part of Motorola Solutions is dedicated to driving the future of technology and business by fostering a culture of creativity, expermentation, and startegic developement to enhance the Mission Critical voice, video and data product to create more business opportunities. Our mission is identify, develop and implement solutions that leverage emerging technologies to solve problems for all portfolio products in unified communications. Job Description Responsibilities of this role includes: Evaluate and Compare AI Language Models (LLMs) for Integration into Speech and Video Services. (Focus on models performance in tasks like transcription, translation) Identify and Analyze Real-Time API Offerings of Leading AI Frameworks and Cloud AI Services for Low-Latency Deployment. Investigate and Select an AI Workflow Orchestration Framework to Streamline and Manage End-to-End AI Pipelines. Design and Implement Test Applications for Traffic/Load and Unit Testing on Selected AI Frameworks Basic Requirements Currently pursuing a Bachelors or Masters Degree in Computer Science, Information Technology, AI focused specialization. Must have a graduation date on or after December 2025. Must be a US Citizen, permanent resident or be an MS student with work authorization (F1 Visa on CPT accepted only for masters-level students). Travel Requirements None Relocation Provided None Position Type Intern EEO Statement Motorola Solutions is an Equal Opportunity Employer. All qualified applicants will receive consideration for employment without regard to race, color, religion or belief, sex, sexual orientation, gender identity, national origin, disability, veteran status or any other legally-protected characteristic. We are proud of our people-first and community-focused culture, empowering every Motorolan to be their most authentic self and to do their best work to deliver on the promise of a safer world. If youd like to join our team but feel that you dont quite meet all of the preferred skills, wed still love to hear why you think youd be a great addition to our team. Were committed to providing an inclusive and accessible recruiting experience for candidates with disabilities, or other physical or mental health conditions. To request an accommodation, please complete this Reasonable Accommodations Form so we can assist you.";
    const res = queryKnowledgeBase(query, { jobDescription: jobDescription });
    console.log('Bedrock RAG response:', res.data);

    console.log(res.response.output.text);

    // const raw = fs.readFileSync(jsonFilePath, 'utf8');
    // const payload = JSON.parse(raw);
    // const outRel = path.join('generated-resumes', 'allenzheng-resume.pdf');
    // const outPath = path.resolve(__dirname, outRel);
    // Resume.fromObjectToPDF(payload, outPath)
    //   .then(resolved => console.log('PDF generated at', resolved))
    //   .catch(err => console.error('Error generating PDF from object:', err));
  } catch (err) {
    console.error('Failed to read/parse JSON file for demo:', err);
  }
});

app.on('window-all-closed', () => app.quit());
