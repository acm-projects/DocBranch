import axios from 'axios';

const backend_api = axios.create({
  baseURL: 'http://localhost:3000/', // Replace with your backend API URL
});

// const smth = await backend_api.get('/resumes');

// console.log(smth.data);

export default backend_api;

/**
 * Generate a PDF for a resume by fetching the resume JSON from the backend
 * (apicall.js provides GET /resumes/:userid/:resumeid) and forwarding that
 * object to the resume-generator service at http://localhost:3080/generate-pdf.
 * Returns a Blob containing the PDF.
 */
export async function generateResumePdf(userId: string, resumeId: string): Promise<Blob> {
  try {
    // 1) fetch resume JSON from main backend
    const getResp = await backend_api.get(`/resumes/${encodeURIComponent(userId)}/${encodeURIComponent(resumeId)}`);
    let resumeObj = getResp.data;
    // dynamo layer may return an array or a wrapped object; pick first element if array
    if (Array.isArray(resumeObj) && resumeObj.length > 0) resumeObj = resumeObj[0];

    // 2) send to pdfEndpoint service which returns PDF bytes
    const pdfEndpoint = 'http://localhost:3080/generate-pdf';
    const pdfResp = await axios.post(pdfEndpoint, resumeObj, { responseType: 'arraybuffer', headers: { 'Content-Type': 'application/json' } });

    // 3) return as Blob for consumer to download or display
    return new Blob([pdfResp.data], { type: 'application/pdf' });
  } catch (err: any) {
    // normalize and rethrow
    const message = err && err.response && err.response.data ? JSON.stringify(err.response.data) : (err && err.message) || String(err);
    throw new Error(`Failed to generate PDF: ${message}`);
  }
}