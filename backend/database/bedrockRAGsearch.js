const dotenv = require('dotenv');
const { BedrockAgentRuntimeClient, RetrieveAndGenerateCommand } = require("@aws-sdk/client-bedrock-agent-runtime");
const axios = require('axios');
dotenv.config();

// Minimal, practical script to run a Retrieve-and-Generate (RAG) request against a Bedrock knowledge base
// Usage: node bedrockRAGsearch.js "your question here"

/**
 * Query the Bedrock knowledge base with a user query and return the response.
 * @param {string} userText - The user's question or prompt.
 * @param {object} [options] - Optional overrides: { kbId, region, inferenceProfileArn, modelArn, numberOfResults, overrideSearchType, maxTokens, temperature, enableReranking }
 * @returns {Promise<{rawResponse: object, generatedText: string|null, citations: array|null}>}
 */
async function queryKnowledgeBase(userText, options = {}) {
  const region = options.region || process.env.AWS_DEFAULT_REGION || "us-east-2";
  const kbId = options.kbId || process.env.AWS_BEDROCK_KB_ID;

  if (!kbId) {
    throw new Error("Missing required environment variable or option: AWS_BEDROCK_KB_ID");
  }

  const inferenceProfileArn = options.inferenceProfileArn || process.env.AWS_BEDROCK_INFERENCE_PROFILE_ARN;
  const numberOfResults = typeof options.numberOfResults === 'number' ? options.numberOfResults : 5;
  const overrideSearchType = options.overrideSearchType || 'HYBRID';
  // Support passing a job description URL or raw job description text.
  // options.jobUrl: a URL to fetch the job posting from
  // options.jobDescription: raw text for the job description (skips fetching if present)
  let jobDescriptionText = '';
  try {
    if (options.jobDescription && typeof options.jobDescription === 'string') {
      jobDescriptionText = options.jobDescription;
    } else if (options.jobUrl && typeof options.jobUrl === 'string') {
      // Fetch the job posting. Keep a reasonable timeout and limit the saved length.
      // Some providers (e.g. Workday) return a small JSON payload that instructs the
      // client to redirect; detect that case and follow the redirect to fetch the
      // actual job HTML.
      const resp = await axios.get(options.jobUrl, { timeout: 8000, responseType: 'text' });
      let raw = resp.data;
      let body = String(raw || '');

      // Try to detect JSON redirect wrappers (several providers wrap redirect info).
      // If we find a redirect target, resolve it and fetch the target page.
      try {
        let parsed = typeof raw === 'object' ? raw : JSON.parse(body);
        // Some responses embed a JSON string inside a field like jobDescription
        if (parsed && typeof parsed.jobDescription === 'string') {
          try {
            parsed = JSON.parse(parsed.jobDescription);
          } catch (e) {
            // ignore - jobDescription might be plain text
          }
        }

        // look for common redirect patterns
        const redirectUrlCandidate = parsed && (parsed.url || parsed.redirect || parsed.redirectUrl) ;
        if (parsed && parsed.widget === 'redirect' && redirectUrlCandidate) {
          let redirectUrl = String(redirectUrlCandidate);
          // Resolve relative paths against the original jobUrl
          if (!redirectUrl.match(/^https?:\/\//i)) {
            const base = new URL(options.jobUrl);
            redirectUrl = base.origin + (redirectUrl.startsWith('/') ? redirectUrl : '/' + redirectUrl);
          }
          try {
            const resp2 = await axios.get(redirectUrl, { timeout: 8000, responseType: 'text', headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'text/html' } });
            body = String(resp2.data || '');
          } catch (e) {
            // If follow-up fetch fails, fall back to original body
            console.warn('Failed to fetch redirected job URL', redirectUrl, e && e.message);
          }
        }
      } catch (e) {
        // not JSON - continue with original body
      }

      // Strip HTML tags if present (simple heuristic) and collapse whitespace
      body = body.replace(/<[^>]+>/g, ' ');
      body = body.replace(/\s+/g, ' ').trim();
      // Truncate to a safe maximum to avoid overly large prompt (e.g., 4000 chars)
      const MAX_JOB_DESC_CHARS = 4000;
      if (body.length > MAX_JOB_DESC_CHARS) body = body.slice(0, MAX_JOB_DESC_CHARS) + '...';
      jobDescriptionText = body;
    }
  } catch (err) {
    // Non-fatal: log and continue without the job description
    console.warn('Failed to fetch or parse job description from', options.jobUrl, err && err.message);
    jobDescriptionText = '';
  }

  const client = new BedrockAgentRuntimeClient({ region });

  const retrievalConfig = {
    vectorSearchConfiguration: {
      numberOfResults,
      overrideSearchType
    }
  };

  // Build prompt template text. We include retrieved documents, optional job description,
  // then the user query. Keep $search_results$ and $query$ placeholders so retrieval
  // substitution can still occur on the service-side.
  const jobSection = jobDescriptionText ? ("\n\nJob description:\n" + jobDescriptionText) : '';

  const promptTextTemplate =
    "You are an assistant that uses the provided retrieved documents to answer the user's question.\n" +
    "Do NOT invent facts beyond the documents. Cite or reference documents when possible.\n" +
    "Task: return only the best matched resume-id and no other text, the return format should be '{name:{name},user_id:{userId},resume_id:{resumeId}}'.\n" +
    "Retrieved documents:\n$search_results$" +
    jobSection +
    "\n\nUser question:\n$query$";

  const input = {
    input: { text: userText },
    retrieveAndGenerateConfiguration: {
      type: "KNOWLEDGE_BASE",
      knowledgeBaseConfiguration: {
        knowledgeBaseId: kbId,
        modelArn: inferenceProfileArn,
        retrievalConfiguration: retrievalConfig,
        generationConfiguration: {
          promptTemplate: {
            textPromptTemplate: promptTextTemplate
          },
          inferenceConfig: {
            textInferenceConfig: {
              temperature: typeof options.temperature === 'number' ? options.temperature : 0.2,
              //topP: typeof options.topP === 'number' ? options.topP : 0.95,
              maxTokens: typeof options.maxTokens === 'number' ? options.maxTokens : 800
            }
          }
        }
      }
    }
  };

  const command = new RetrieveAndGenerateCommand(input);

  const response = await client.send(command);
  console.log('Bedrock raw response:', JSON.stringify(response, null, 2));

  const generatedText =
    response?.output?.text ??
    response?.output?.[0]?.text ??
    response?.output?.[0]?.content?.[0]?.text ??
    response?.output?.[0]?.content ??
    response?.output ??
    null;

  const citations =
    response?.citations ??
    response?.output?.citations ??
    response?.output?.[0]?.citations ??
    [];

  return { raw: response, generatedText, citations, jobUrl: options.jobUrl || null, jobDescription: jobDescriptionText || null };
}

// Exports (support both default-style and named import patterns for consumers)
module.exports = queryKnowledgeBase;
module.exports.queryKnowledgeBase = queryKnowledgeBase;

// If executed directly from the command line, run a quick query and print results
if (require.main === module && process.argv && process.argv.length > 2) {
  (async () => {
    try {
      const userText = process.argv.slice(2).join(' ');
      const result = await queryKnowledgeBase(userText);
      console.log('Response:\n', JSON.stringify(result, null, 2));
    } catch (err) {
      console.error('Error:', err);
      process.exitCode = 1;
    }
  })();
}