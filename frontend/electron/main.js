const { app, BrowserWindow } = require('electron');
const path = require('path');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config();

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.API_KEY,
});

let mainWindow;

// Import your data
const resumeData = require('./resume-data.js');
const jobDescriptionInput = require('./job-description.js');

// Add the web scraping function with better error handling
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
      timeout: 30000, // 30 second timeout
    });

    const aiResponse = completion.choices[0].message.content;
    
    // Extract JSON from the AI response
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

async function analyzeResume() {
  try {
    console.log('Starting resume analysis...');
    
    let jobDescContent;
    let sourceType;
    
    // Check if jobDescriptionInput is a URL string or an object
    if (typeof jobDescriptionInput === 'string' && jobDescriptionInput.startsWith('http')) {
      // It's a URL - use web scraping
      console.log('Detected URL, fetching job description...');
      try {
        jobDescContent = await fetchJobDescriptionFromURL(jobDescriptionInput);
        sourceType = 'URL';
      } catch (urlError) {
        console.log('URL fetching failed, falling back to local job description...');
        // Fallback to a default local job description
        jobDescContent = {
          company: "Job from URL",
          title: "Position from Provided URL",
          responsibilities: ["Could not fetch details from URL - using fallback"],
          requiredSkills: ["Please use local job description file instead"],
          eligibilityRequirements: ["URL access failed"]
        };
        sourceType = 'fallback (URL failed)';
      }
    } else {
      // It's a structured object - use directly
      console.log('Detected structured job description object');
      jobDescContent = jobDescriptionInput;
      sourceType = 'local file';
    }
    
    console.log(`Using job description from: ${sourceType}`);
    
    const prompt = `
Analyze this resume against the job description and provide constructive feedback.

JOB DESCRIPTION:
${JSON.stringify(jobDescContent, null, 2)}

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

Please provide feedback in this format:
1. Match Score: X/10
2. Key Strengths
3. Areas for Improvement
4. Missing Keywords/Skills
5. Specific Recommendations
`;

    console.log('Calling AI with resume data...');
    const completion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
    });

    const aiResponse = completion.choices[0].message.content;
    console.log('\n=== AI RESUME FEEDBACK ===\n');
    console.log(aiResponse);
    console.log('\n=== END FEEDBACK ===\n');

    // Send to renderer if window exists
    if (mainWindow) {
      mainWindow.webContents.executeJavaScript(
        `document.getElementById('output').textContent = ${JSON.stringify(aiResponse)};`
      );
    }
  } catch (err) {
    console.error('Analysis failed:', err);
    if (mainWindow) {
      mainWindow.webContents.executeJavaScript(
        `document.getElementById('output').textContent = 'Error: ${err.message}';`
      );
    }
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile('index.html');
  mainWindow.webContents.on('did-finish-load', () => {
    analyzeResume(); // Auto-run analysis when window loads
  });
}

app.whenReady().then(createWindow);