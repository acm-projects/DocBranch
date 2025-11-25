export {};

declare global {
  interface Window {
    electronAPI: {
      analyzeResume: (data: { 
        resumeData: any; 
        jobDescription: string 
      }) => Promise<{ 
        success: boolean; 
        result: string;
        error?: string;
      }>;
    };
  }
}