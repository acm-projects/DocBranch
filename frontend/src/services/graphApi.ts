// import axios from 'axios';

// // const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
// const API_BASE_URL = 'http://localhost:3000';

// export interface BranchNode {
//   branch_info: {
//     branch_id: string;
//     parent_branch_id: (string | null)[];
//     children_branch_ids: (string | null)[];
//   };
//   categoryId: string;
//   categoryParents?: string[];
// }

// export interface GraphData {
//   categories: Array<{ id: string; label: string; color: string }>;
//   nodes: BranchNode[];
// }

// interface Resume {
//   user_id: string;
//   resume_id: string;
//   resume: any;
//   metadata: {
//     resume_info: {
//       resume_creation_date: string;
//       filename: string;
//       template_used: string;
//       section_order: string[];
//     };
//     branch_info: {
//       parent_resume_ids: (string | null)[];
//       children_resume_ids: (string | null)[];
//       created_date: string;
//       last_modified: string;
//     };
//   };
// }

// // Default categories - hardcoded since not in JSON
// const DEFAULT_CATEGORIES = [
//   { id: 'cat-1', label: 'FULL STACK', color: '#2D5016' },
//   { id: 'cat-2', label: 'AI/ML', color: '#2D5016' },
//   { id: 'cat-3', label: 'INTERNSHIP', color: '#2D5016' },
//   { id: 'cat-4', label: 'LEADERSHIP', color: '#2D5016' }
// ];

// // // Helper function to determine category from filename or other metadata
// // const determineCategoryFromResume = (resume: Resume): string => {
// //   const filename = resume.metadata.resume_info.filename.toLowerCase();
// //   const template = resume.metadata.resume_info.template_used.toLowerCase();
  
// //   // You can customize this logic based on your naming conventions
// //   if (filename.includes('fullstack') || filename.includes('full_stack')) {
// //     return 'cat-1';
// //   } else if (filename.includes('ai') || filename.includes('ml') || filename.includes('machine')) {
// //     return 'cat-2';
// //   } else if (filename.includes('intern')) {
// //     return 'cat-3';
// //   } else if (filename.includes('leadership') || filename.includes('lead')) {
// //     return 'cat-4';
// //   }
  
// //   // Default category
// //   return 'cat-1';
// // };

// // const determineCategoryFromResume = (resume: Resume): string => {
// //   if (!resume?.metadata?.resume_info) {
// //   console.warn('Resume missing metadata.resume_info:', resume.resume_id);
// // }

// //   const filename = resume?.metadata?.resume_info?.filename?.toLowerCase() || '';
// //   const template = resume?.metadata?.resume_info?.template_used?.toLowerCase() || '';

// //   if (filename.includes('fullstack') || filename.includes('full_stack')) {
// //     return 'cat-1';
// //   } else if (filename.includes('ai') || filename.includes('ml') || filename.includes('machine')) {
// //     return 'cat-2';
// //   } else if (filename.includes('intern')) {
// //     return 'cat-3';
// //   } else if (filename.includes('leadership') || filename.includes('lead')) {
// //     return 'cat-4';
// //   }

// //   return 'cat-1';
// // };

// const determineCategoryFromResume = (resume: Resume): string => {
//   if (!resume || !resume.metadata || !resume.metadata.resume_info) {
//     console.warn('Incomplete resume metadata, defaulting category:', resume?.resume_id);
//     return 'cat-1'; // default category
//   }

//   const filename = resume.metadata.resume_info.filename?.toLowerCase() || '';
//   const template = resume.metadata.resume_info.template_used?.toLowerCase() || '';

//   if (filename.includes('fullstack') || filename.includes('full_stack')) {
//     return 'cat-1';
//   } else if (filename.includes('ai') || filename.includes('ml') || filename.includes('machine')) {
//     return 'cat-2';
//   } else if (filename.includes('intern')) {
//     return 'cat-3';
//   } else if (filename.includes('leadership') || filename.includes('lead')) {
//     return 'cat-4';
//   }

//   return 'cat-1';
// };

// // Fetch all resumes for a user and build graph data
// export const fetchGraphData = async (userid: string): Promise<GraphData> => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/resumes/${userid}`);
//     // const resumes: Resume[] = response.data;

//     const data = response.data;
//     console.log('Resumes fetched from backend:', response.data);


    
//   // If backend returns a single resume object → wrap it in an array
//   const resumes: Resume[] = Array.isArray(data) ? data : [data];

//   // --- Add this logging block ---
//   resumes.forEach((r, i) => {
//     if (!r || !r.metadata || !r.metadata.resume_info) {
//       console.warn(`Resume at index ${i} is invalid or missing metadata.resume_info:`, r);
//     }
//   });
//     // --- End logging block ---

//   const validResumes: Resume[] = resumes.filter(r => r && r.metadata && r.metadata.resume_info);

//   if (validResumes.length < resumes.length) {
//     console.warn('Some resumes were invalid and skipped:', resumes);
//   }

    
//     // Convert resumes to graph nodes
//     const nodes: BranchNode[] = validResumes.map(resume => ({
//       // const categoryId = determineCategoryFromResume(resume);
      
//       // return {
//         branch_info: {
//           branch_id: resume.resume_id,
//           parent_branch_id: resume.metadata.branch_info.parent_resume_ids,
//           children_branch_ids: resume.metadata.branch_info.children_resume_ids
//         },
//         categoryId: determineCategoryFromResume(resume),
//         categoryParents: [determineCategoryFromResume(resume)]
//       // };
//     }));
    
//     return {
//       categories: DEFAULT_CATEGORIES,
//       nodes: nodes
//     };
//   } catch (error) {
//     console.error('Error fetching graph data:', error);
//     throw error;
//   }
// };

// // Fetch a single resume
// export const fetchResume = async (userid: string, resumeid: string): Promise<Resume> => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/resumes/${userid}/${resumeid}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching resume:', error);
//     throw error;
//   }
// };

// // Update a resume's branch info (keeping JSON structure intact)
// export const updateResumeBranchInfo = async (
//   userid: string,
//   resumeid: string,
//   branchInfo: {
//     parent_resume_ids: (string | null)[];
//     children_resume_ids: (string | null)[];
//   }
// ): Promise<void> => {
//   try {
//     // First, fetch the existing resume
//     const resume = await fetchResume(userid, resumeid);
    
//     // Update only the branch info, keeping everything else the same
//     const updatedResume = {
//       ...resume,
//       metadata: {
//         ...resume.metadata,
//         branch_info: {
//           ...resume.metadata.branch_info,
//           parent_resume_ids: branchInfo.parent_resume_ids,
//           children_resume_ids: branchInfo.children_resume_ids,
//           last_modified: new Date().toISOString()
//         }
//       }
//     };
    
//     // Save the updated resume
//     await axios.put(`${API_BASE_URL}/resumes/${userid}/${resumeid}`, updatedResume);
//   } catch (error) {
//     console.error('Error updating resume branch info:', error);
//     throw error;
//   }
// };

// // Create a new resume (node)
// export const createNewResume = async (
//   userid: string,
//   resumeid: string,
//   parentResumeIds: (string | null)[],
//   filename: string = 'New_Resume.pdf'
// ): Promise<void> => {
//   try {
//     const newResume: Resume = {
//       user_id: userid,
//       resume_id: resumeid,
//       resume: {
//         // Empty resume structure - can be filled later
//       },
//       metadata: {
//         resume_info: {
//           resume_creation_date: new Date().toISOString().split('T')[0],
//           filename: filename,
//           template_used: 'default',
//           section_order: []
//         },
//         branch_info: {
//           parent_resume_ids: parentResumeIds,
//           children_resume_ids: [null],
//           created_date: new Date().toISOString(),
//           last_modified: new Date().toISOString()
//         }
//       }
//     };
    
//     await axios.post(`${API_BASE_URL}/resumes`, newResume);
//   } catch (error) {
//     console.error('Error creating new resume:', error);
//     throw error;
//   }
// };

// // Delete a resume
// export const deleteResume = async (userid: string, resumeid: string): Promise<void> => {
//   try {
//     await axios.delete(`${API_BASE_URL}/resumes/${userid}/${resumeid}`);
//   } catch (error) {
//     console.error('Error deleting resume:', error);
//     throw error;
//   }
// };

// // Update multiple resumes at once (for bulk operations)
// export const bulkUpdateResumes = async (
//   userid: string,
//   updates: Array<{
//     resumeid: string;
//     branchInfo: {
//       parent_resume_ids: (string | null)[];
//       children_resume_ids: (string | null)[];
//     };
//   }>
// ): Promise<void> => {
//   try {
//     // Execute all updates in parallel
//     await Promise.all(
//       updates.map(update =>
//         updateResumeBranchInfo(userid, update.resumeid, update.branchInfo)
//       )
//     );
//   } catch (error) {
//     console.error('Error in bulk update:', error);
//     throw error;
//   }
// };


// // graphApi.ts
// import axios from 'axios';

// // const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
// const API_BASE_URL = 'http://localhost:3000';


// export interface Resume {
//   user_id: string;
//   resume_id: string;
//   resume: any;
//   metadata: {
//     resume_info?: {
//       resume_creation_date?: string;
//       filename?: string;
//       template_used?: string;
//       section_order?: string[];
//     };
//     branch_info?: {
//       parent_resume_ids?: (string | null)[];
//       children_resume_ids?: (string | null)[];
//       created_date?: string;
//       last_modified?: string;
//     };
//   };
// }

// export interface BranchNode {
//   branch_info: {
//     branch_id: string;
//     parent_branch_id: (string | null)[];
//     children_branch_ids: (string | null)[];
//   };
//   categoryId: string;
//   categoryParents?: string[];
// }

// export interface GraphData {
//   categories: Array<{ id: string; label: string; color: string }>;
//   nodes: BranchNode[];
// }

// // Hardcoded category list (same as in BranchPage)
// const DEFAULT_CATEGORIES = [
//   { id: 'cat-1', label: 'FULL STACK', color: '#2D5016' },
//   { id: 'cat-2', label: 'AI/ML', color: '#2D5016' },
//   { id: 'cat-3', label: 'INTERNSHIP', color: '#2D5016' },
//   { id: 'cat-4', label: 'LEADERSHIP', color: '#2D5016' }
// ];

// // Map raw Resume objects to GraphData format
// export const mapResumesToGraphData = (resumes: Resume[]): GraphData => {
//   const nodes: BranchNode[] = resumes.map(r => {
//     const parentIds = r.metadata?.branch_info?.parent_resume_ids ?? [null];
//     const childrenIds = r.metadata?.branch_info?.children_resume_ids ?? [null];
//     const templateUsed = r.metadata?.resume_info?.template_used;

//     // Use template or default category
//     const categoryId = templateUsed && DEFAULT_CATEGORIES.some(c => c.id === templateUsed)
//       ? templateUsed
//       : 'cat-1';

//     return {
//       branch_info: {
//         branch_id: r.resume_id,
//         parent_branch_id: parentIds,
//         children_branch_ids: childrenIds
//       },
//       categoryId,
//       categoryParents: [categoryId]
//     };
//   });

//   return {
//     categories: DEFAULT_CATEGORIES,
//     nodes
//   };
// };

// // Fetch all resumes for a user and build graph data
// export const fetchGraphData = async (userid: string): Promise<GraphData> => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/resumes/${userid}`);
//     const data = response.data;
//     const resumes: Resume[] = Array.isArray(data) ? data : [data];
//     return mapResumesToGraphData(resumes);
//   } catch (error) {
//     console.error('Error fetching graph data:', error);
//     throw error;
//   }
// };

// // Fetch a single resume
// export const fetchResume = async (userid: string, resumeid: string): Promise<Resume> => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/resumes/${userid}/${resumeid}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching resume:', error);
//     throw error;
//   }
// };

// // Create a new resume (node)
// export const createNewResume = async (
//   userid: string,
//   resumeid: string,
//   parentResumeIds: (string | null)[] = [null],
//   filename: string = 'New_Resume.pdf'
// ): Promise<void> => {
//   try {
//     const newResume: Resume = {
//       user_id: userid,
//       resume_id: resumeid,
//       resume: {},
//       metadata: {
//         resume_info: {
//           resume_creation_date: new Date().toISOString().split('T')[0],
//           filename,
//           template_used: 'cat-1',
//           section_order: []
//         },
//         branch_info: {
//           parent_resume_ids: parentResumeIds,
//           children_resume_ids: [null],
//           created_date: new Date().toISOString(),
//           last_modified: new Date().toISOString()
//         }
//       }
//     };
//     await axios.post(`${API_BASE_URL}/resumes`, newResume);
//   } catch (error) {
//     console.error('Error creating new resume:', error);
//     throw error;
//   }
// };

// // Update a resume's branch info (keeping JSON structure intact)
// export const updateResumeBranchInfo = async (
//   userid: string,
//   resumeid: string,
//   branchInfo: {
//     parent_resume_ids: (string | null)[];
//     children_resume_ids: (string | null)[];
//   }
// ): Promise<void> => {
//   try {
//     const resume = await fetchResume(userid, resumeid);
//     const updatedResume: Resume = {
//       ...resume,
//       metadata: {
//         ...resume.metadata,
//         branch_info: {
//           parent_resume_ids: branchInfo.parent_resume_ids,
//           children_resume_ids: branchInfo.children_resume_ids,
//           created_date: resume.metadata.branch_info?.created_date ?? new Date().toISOString(),
//           last_modified: new Date().toISOString()
//         }
//       }
//     };
//     await axios.put(`${API_BASE_URL}/resumes/${userid}/${resumeid}`, updatedResume);
//   } catch (error) {
//     console.error('Error updating resume branch info:', error);
//     throw error;
//   }
// };

// // Delete a resume
// export const deleteResume = async (userid: string, resumeid: string): Promise<void> => {
//   try {
//     await axios.delete(`${API_BASE_URL}/resumes/${userid}/${resumeid}`);
//   } catch (error) {
//     console.error('Error deleting resume:', error);
//     throw error;
//   }
// };

// // Bulk update resumes (for branch relationships)
// export const bulkUpdateResumes = async (
//   userid: string,
//   updates: Array<{
//     resumeid: string;
//     branchInfo: {
//       parent_resume_ids: (string | null)[];
//       children_resume_ids: (string | null)[];
//     };
//   }>
// ): Promise<void> => {
//   try {
//     await Promise.all(
//       updates.map(update =>
//         updateResumeBranchInfo(userid, update.resumeid, update.branchInfo)
//       )
//     );
//   } catch (error) {
//     console.error('Error in bulk update:', error);
//     throw error;
//   }
// };

// graphApi.ts
import axios from 'axios';
export interface BranchNode {
  branch_info: {
    branch_id: string;
    parent_branch_id: (string | null)[];
    children_branch_ids: (string | null)[];
  };
  categoryId: string;
  categoryParents?: string[];
}

export interface Resume {
  user_id: string;
  resume_id: string;
  resume: any;
  metadata: {
    resume_info: {
      resume_creation_date: string;
      filename: string;
      template_used: string;
      section_order: string[];
    };
    branch_info: {
      parent_resume_ids: (string | null)[];
      children_resume_ids: (string | null)[];
      created_date: string;
      last_modified: string;
    };
  };
}

const API_BASE = '/api/resumes'; // Adjust to your backend endpoint

// Fetch all resumes for a user
export const fetchGraphData = async (userId: string): Promise<Resume[]> => {
  const response = await axios.get<Resume[]>(`${API_BASE}?user_id=${userId}`);
  return response.data;
};

// Create a new resume
export const createNewResume = async (userId: string, resume: Partial<Resume>): Promise<Resume> => {
  const response = await axios.post<Resume>(API_BASE, { user_id: userId, ...resume });
  return response.data;
};

// Update branch info for a resume
export const updateResumeBranchInfo = async (
  resumeId: string,
  branchInfo: Resume['metadata']['branch_info']
): Promise<void> => {
  await axios.put(`${API_BASE}/${resumeId}`, { branch_info: branchInfo });
};

// Delete a resume
export const deleteResume = async (resumeId: string): Promise<void> => {
  await axios.delete(`${API_BASE}/${resumeId}`);
};

// Bulk update resumes (for edge connections)
export const bulkUpdateResumes = async (
  userId: string,
  updates: {
    resumeid: string;
    branchInfo: Resume['metadata']['branch_info'];
  }[]
): Promise<void> => {
  await axios.put(`${API_BASE}/bulk`, { user_id: userId, updates });
};

export const mapBranchNodeForAPI = (node: BranchNode) => ({
  parent_resume_ids: node.branch_info.parent_branch_id,
  children_resume_ids: node.branch_info.children_branch_ids,
  created_date: new Date().toISOString(),
  last_modified: new Date().toISOString(),
});
