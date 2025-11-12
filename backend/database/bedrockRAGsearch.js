const dotenv = require('dotenv');
const { BedrockAgentRuntimeClient, RetrieveAndGenerateCommand } = require("@aws-sdk/client-bedrock-agent-runtime");
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

  const client = new BedrockAgentRuntimeClient({ region });

  const retrievalConfig = {
    vectorSearchConfiguration: {
      numberOfResults,
      overrideSearchType
    }
  };

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
            textPromptTemplate:
              "You are an assistant that uses the provided retrieved documents to answer the user's question.\n" +
              "Do NOT invent facts beyond the documents. Cite or reference documents when possible.\n" +
              "Task: Summarize candidate projects found in the retrieved documents and recommend (1) which projects to include on a resume for the job link provided, and (2) 2-4 concise, resume-ready bullet points for each recommended project.\n" +
              "Provide a one-line justification for each recommended project.\n\n" +
              "Retrieved documents:\n$search_results$\n\nUser question:\n$query$"
          },
          inferenceConfig: {
            textInferenceConfig: {
              temperature: typeof options.temperature === 'number' ? options.temperature : 0.2,
              topP: typeof options.topP === 'number' ? options.topP : 0.95,
              maxTokens: typeof options.maxTokens === 'number' ? options.maxTokens : 800
            }
          }
        }
      }
    }
  };

  const command = new RetrieveAndGenerateCommand(input);

  const response = await client.send(command);

  // Extract generated text and citations if present
  const generatedText = response?.output?.text ?? response?.output?.[0]?.text ?? null;
  const citations = response?.citations || response?.output?.citations || null;

  return { rawResponse: response, generatedText, citations };
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
      console.log('Generated text:\n', result.generatedText);
      console.log('\nCitations:', JSON.stringify(result.citations, null, 2));
    } catch (err) {
      console.error('Error:', err);
      process.exitCode = 1;
    }
  })();
}