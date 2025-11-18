const dotenv = require('dotenv');
dotenv.config();
const OpenAI = require('openai');

// Explicitly load .env from backend/database
dotenv.config({ path: __dirname + '/database/.env' });

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENAI_API_KEY,
});

// Analyze resume with provided data
async function analyzeResumeWithData(resumeData, jobDescriptionInput) {
  try {
    console.log('Starting resume analysis with provided data...');
    console.log('Raw resume data received:', JSON.stringify(resumeData, null, 2));
    console.log('Job description input:', jobDescriptionInput);
    console.log('Job description type:', typeof jobDescriptionInput);

    let jobDescContent = {};
    let sourceType = 'unknown';

    // Handle job description input - FIXED VERSION
    if (typeof jobDescriptionInput === 'string') {
      if (jobDescriptionInput.startsWith('http')) {
        console.log('Detected URL job description');
        try {
          jobDescContent = await fetchJobDescriptionFromURL(jobDescriptionInput);
          sourceType = 'URL';
        } catch (urlError) {
          console.log('URL fetching failed, using as plain text');
          jobDescContent = {
            company: "Provided Company",
            title: "Provided Position", 
            responsibilities: [jobDescriptionInput],
            requiredSkills: ["Skills from description"],
            eligibilityRequirements: ["Requirements from description"]
          };
          sourceType = 'plain text (URL failed)';
        }
      } else {
        // Plain text job description
        console.log('Detected plain text job description');
        jobDescContent = {
          company: "Provided Company",
          title: "Provided Position",
          responsibilities: [jobDescriptionInput],
          requiredSkills: ["Extracted from description"],
          eligibilityRequirements: ["Extracted from description"]
        };
        sourceType = 'plain text';
      }
    } else if (jobDescriptionInput && typeof jobDescriptionInput === 'object') {
      console.log('Detected structured job description object');
      jobDescContent = jobDescriptionInput;
      sourceType = 'structured object';
    } else {
      console.log('No valid job description provided, using default');
      jobDescContent = {
        company: "Generic Company",
        title: "Target Position",
        responsibilities: ["No specific responsibilities provided"],
        requiredSkills: ["No specific skills provided"],
        eligibilityRequirements: ["No specific requirements provided"]
      };
      sourceType = 'default';
    }

    console.log(`Using job description from: ${sourceType}`);
    console.log('Job description content:', jobDescContent);
    
    // SAFE PROMPT - using optional chaining and defaults
    const prompt = `
Analyze this resume JSON data against the job description and provide constructive feedback.

JOB DESCRIPTION:
Company: ${jobDescContent?.company || 'Not specified'}
Title: ${jobDescContent?.title || 'Not specified'}
Responsibilities: ${JSON.stringify(jobDescContent?.responsibilities || [], null, 2)}
Required Skills: ${JSON.stringify(jobDescContent?.requiredSkills || [], null, 2)}
Eligibility Requirements: ${JSON.stringify(jobDescContent?.eligibilityRequirements || [], null, 2)}

COMPLETE RESUME DATA (JSON format):
${JSON.stringify(resumeData, null, 2)}

Please analyze this resume data and provide:
1. Overall Match Assessment
2. Key Strengths (based on the actual data present)
3. Areas for Improvement  
4. Missing Keywords/Skills compared to job requirements
5. Specific Recommendations

Analyze whatever data is present in the resume JSON. If some fields are missing, note that in your analysis.
Be specific and provide actionable advice for improving the resume.
`;

    console.log('Calling AI with provided resume and job data...');
    const completion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
    });

    const aiResponse = completion.choices[0].message.content ?? '';
    console.log('\n=== AI RESUME FEEDBACK ===\n');
    console.log(aiResponse);
    
    return aiResponse;

  } catch (err) {
    console.error('Analysis failed:', err);
    throw err;
  }
}
// Fetch job description from URL
async function fetchJobDescriptionFromURL(url) {
  try {
    console.log('Fetching job description from URL:', url);

    const prompt = `
Fetch and summarize the job description from the following URL.
Return the output as a JSON object with:
{
  "title": "",
  "company": "", 
  "responsibilities": [],
  "requiredSkills": [],
  "eligibilityRequirements": []
}

IMPORTANT: If you cannot access the URL or the page is not a job description, return:
{
  "error": "Could not fetch job description from URL"
}

URL: ${url}
`;

    const completion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
    });

    const aiResponse = completion.choices[0].message.content ?? '';
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    } else {
      throw new Error('Could not parse job description from AI response');
    }
  } catch (err) {
    console.error('Failed to fetch job description from URL:', err.message);
    throw err;
  }
}

// Export functions
module.exports = {
  analyzeResumeWithData,
  fetchJobDescriptionFromURL
};