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
    company: "Target Company",
    title: "Target Position", 
    responsibilities: [jobDescriptionInput], 
    requiredSkills: [], 
    eligibilityRequirements: [] 
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
Description
By applying to this position, your application will only be considered for our summer Software Development Engineer (SDE) internship roles. Our summer intern roles have start dates in May/June 2026 and are 12 weeks in duration.

Do you want to solve real customer problems through innovative technology? Do you enjoy working on scalable services in a collaborative team environment? Do you want to see your code directly impact millions of customers worldwide?

At Amazon, we hire the best minds in technology to innovate and build on behalf of our customers. Customer obsession is part of our company DNA, which has made us one of the world's most beloved brands.

Our SDE interns use modern technology to solve complex problems while seeing their work's impact first-hand. The challenges SDE interns solve at Amazon are meaningful and influence millions of customers, sellers, and products globally. We seek individuals passionate about creating new products, features, and services while managing ambiguity in an environment where development cycles are measured in weeks, not years.

At Amazon, we believe in ownership at every level. As a SDE intern, you'll own the entire lifecycle of your code - from design through deployment and ongoing operations. This ownership mindset, combined with our commitment to operational excellence, ensures we deliver the highest quality solutions for our customers.

We're looking for curious minds who think big and want to define tomorrow's technology. At Amazon, you'll grow into the high-impact engineer you know you can be, supported by a culture of learning and mentorship. Every day brings exciting new challenges and opportunities for personal growth.

Amazon internships across all seasons are full-time positions, and interns should expect to work in office, Monday-Friday, up to 40 hours per week typically between 8am-5pm. Specific team norms around working hours will be communicated by your manager. Interns should not have conflicts such as classes or other employment during the Amazon work-day. Applicants should have a minimum of one quarter/semester/trimester remaining in their studies after their internship concludes.

We will take your location preferences into consideration. Preferences are based on business availability and are not guaranteed. Applicants will be considered at all locations we host interns in the United States including but not limited to:

• AZ (Phoenix, Tempe)
• CA (Berkeley, Culver City, Cupertino, East Palo Alto, Irvine, Los Angeles, Manhattan Beach, Palo Alto, San Diego, San Francisco, San Jose, San Luis Obispo, Santa Barbara, Santa Clara, Santa Cruz, Santa Monica, Sunnyvale)
• CO (Boulder, Denver)
• GA (Atlanta, Kennesaw)
• IL (Chicago)
• MA (Boston, Cambridge, Hudson, North Reading, Westborough)
• MD (Baltimore)
• MI (Detroit)
• MN (Minneapolis)
• NJ (Jersey City)
• NY (New York)
• OR (Portland)
• PA (Philadelphia, Pittsburgh)
• TN (Nashville)
• TX (Austin, Dallas)
• VA (Arlington, Herndon)
• WI (Madison)
• WA (Bellevue, Seattle, Redmond)
***Locations are subject to change***

During your application, you will have the opportunity to highlight your expertise in one or more of these specialized areas:

• Machine Learning • Distributed Systems and Data Management • Database Systems • Quantum Computing • Network Development • Query Processing and Optimization • Automated Reasoning • Embedded Systems • Data Engineering • Mobile Development • Game Development

While team placement is based on business needs, sharing your specific skills and interests helps us better align your experience with potential roles.


Key job responsibilities
• Collaborate and communicate effectively with experienced cross-disciplinary Amazonians to design, build, and operate innovative products and services that delight our customers, while participating in technical discussions to drive solutions forward.
• Design and develop scalable solutions using cloud-native architectures and microservices in a large distributed computing environment.
• Participate in code reviews and contribute to technical documentation.
• Build and maintain resilient distributed systems that are scalable, fault-tolerant, and cost-effective.
• Leverage and contribute to the development of GenAI and AI-powered tools to enhance development productivity while staying current with emerging technologies.
• Write clean, maintainable code following best practices and design patterns.
• Work in an agile environment practicing CI/CD principles while participating in operational responsibilities.
• Demonstrate operational excellence through monitoring, troubleshooting, and resolving production issues.

A day in the life
As an intern, you will be matched to a manager and a mentor and will have the opportunity to influence the evolution of Amazon technology and lead critical projects early in your career.

In addition to working on an impactful project, you will have the opportunity to engage with Amazonians for both personal and professional development, expand your network, and participate in activities with other interns throughout your internship. No matter the location of your internship, we give you the tools to own your project and learn in a real-world setting.

Basic Qualifications
- Are 18 years of age or older
- Experience with at least one general-purpose programming language such as Java, Python, C++, C#, Go, Rust, or TypeScript
- Experience with data structure implementation, basic algorithm development, and/or object-oriented design principles
- Are enrolled in a Bachelor's degree or above in Computer Science, Computer Engineering, Data Science, Information Systems, or related STEM fields
- Able to work 40 hours/week and commit to a 12-week internship
- Expected conferral date between October 2026 – September 2029

Preferred Qualifications
- Experience from previous technical internship(s) or demonstrated project experience
- Experience with one or more of the following: AI tools for development productivity, Cloud platforms (preferably AWS), Database systems (SQL and NoSQL), Contributing to open-source projects, Version control systems, Debugging and troubleshooting complex systems
- Demonstrated ability to learn and adapt to new technologies quickly
- Basic understanding of software development lifecycle (SDLC)
- Strong problem-solving and analytical skills
- Excellent written and verbal communication skills

Amazon is an equal opportunity employer and does not discriminate on the basis of protected veteran status, disability, or other legally protected status.

Our inclusive culture empowers Amazonians to deliver the best results for our customers. If you have a disability and need a workplace accommodation or adjustment during the application and hiring process, including support for the interview or onboarding process, please visit https://amazon.jobs/content/en/how-we-hire/accommodations for more information. If the country/region you’re applying in isn’t listed, please contact your Recruiting Partner.

Our compensation reflects the cost of labor across several US geographic markets. The base pay for this position ranges from $47.84/hr in our lowest geographic market up to $96.15/hr in our highest geographic market. Pay is based on a number of factors including market location and may vary depending on job-related knowledge, skills, and experience. Amazon is a total compensation company. Dependent on the position offered, equity, sign-on payments, and other forms of compensation may be provided as part of a total compensation package, in addition to a full range of medical, financial, and/or other benefits. For more information, please visit https://www.aboutamazon.com/workplace/employee-benefits. This position will remain posted until filled. Applicants should apply via our internal or external career site.



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

Start Your Response by giving a score matching the resume to the job description out of 100 Ex. 70% Match

Then proceed with the analysis.
Saying "Areas of Improvement:" and the bullet point the feedback.
Then say "Key Strengths:" and bullet point those.

Make sure to bold and underline any important keywords or skills in your response.

Do not say unnecessary things at the beginning of your answer, be concise and focus on bullet points
immediately into the rating and tips
`;

    console.log('Calling AI with provided resume and job data...');
    const completion = await openai.chat.completions.create({
model: "gpt-4.1",
// or gpt-4.1-mini, gpt-o1, gpt-o3-mini, etc.
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