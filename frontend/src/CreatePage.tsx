// import { useState } from 'react';
// //import { Card } from './Components/ui/card';
// import { Checkbox } from './Components/ui/checkbox';
// //import { Label } from './Components/ui/label';
// //import { Badge } from './Components/ui/badge';
// import Sidebar from "./Sidebar";

// interface SectionItem {
//   id: string;
//   text: string;
//   checked: boolean;
// }

// interface EducationItem {
//   id: string;
//   institution: string;
//   degree: string;
//   field: string;
//   startDate: string;
//   endDate: string;
//   gpa?: string;
//   honors?: string;
//   checked: boolean;
// }

// interface ExperienceItem {
//   id: string;
//   company: string;
//   position: string;
//   location: string;
//   startDate: string;
//   endDate: string;
//   description?: string;
//   checked: boolean;
// }

// interface ProjectItem {
//   id: string;
//   name: string;
//   role: string;
//   startDate: string;
//   endDate: string;
//   description?: string;
//   technologies?: string;
//   checked: boolean;
// }

// interface CertificationItem {
//   id: string;
//   name: string;
//   issuer: string;
//   date: string;
//   credentialId?: string;
//   checked: boolean;
// }

// interface SkillItem {
//   id: string;
//   category: string;
//   skills: string[];
//   checked: boolean;
// }

// interface VolunteerItem {
//   id: string;
//   organization: string;
//   role: string;
//   startDate: string;
//   endDate: string;
//   description?: string;
//   checked: boolean;
// }

// interface ResumeSection {
//   id: string;
//   name: string;
//   items?: SectionItem[];
//   educationItems?: EducationItem[];
//   experienceItems?: ExperienceItem[];
//   projectItems?: ProjectItem[];
//   certificationItems?: CertificationItem[];
//   skillItems?: SkillItem[];
//   volunteerItems?: VolunteerItem[];
//   isExpanded: boolean;
// }

// interface Template {
//   id: number;
//   name: string;
//   description: string;
//   category: string;
//   date: string;
// }

// export function CreatePage() {
//   const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
//   const [showInstructions, setShowInstructions] = useState(false);
//   // Sidebar collapse state for Sidebar component
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [sections, setSections] = useState<ResumeSection[]>([
//     {
//       id: 'section-1',
//       name: 'Professional Experience',
//       isExpanded: true,
//       experienceItems: [
//         {
//           id: 'exp-1',
//           company: 'Tech Corp Inc.',
//           position: 'Senior Software Engineer',
//           location: 'San Francisco, CA',
//           startDate: 'Mar 2022',
//           endDate: 'Present',
//           description: 'Lead development of cloud-native applications',
//           checked: false,
//         },
//         {
//           id: 'exp-2',
//           company: 'Startup XYZ',
//           position: 'Full Stack Developer',
//           location: 'Austin, TX',
//           startDate: 'Jan 2020',
//           endDate: 'Mar 2022',
//           description: 'Built and maintained web applications using React and Node.js',
//           checked: false,
//         },
//         {
//           id: 'exp-3',
//           company: 'Digital Solutions LLC',
//           position: 'Junior Developer',
//           location: 'Remote',
//           startDate: 'Jun 2018',
//           endDate: 'Jan 2020',
//           description: 'Developed responsive websites and implemented new features',
//           checked: false,
//         },
//       ],
//     },
//     {
//       id: 'section-2',
//       name: 'Education & Certifications',
//       isExpanded: true,
//       educationItems: [
//         {
//           id: 'edu-1',
//           institution: 'UTD',
//           degree: 'Bachelor of Science',
//           field: 'Computer Science',
//           startDate: 'Sep 2016',
//           endDate: 'Jun 2020',
//           gpa: '3.8/4.0',
//           honors: 'Cum Laude',
//           checked: false,
//         },
//         {
//           id: 'edu-2',
//           institution: 'SMU',
//           degree: 'Master of Science',
//           field: 'Artificial Intelligence + Gender Studies',
//           startDate: 'Sep 2020',
//           endDate: 'Jun 2022',
//           gpa: '3.9/4.0',
//           checked: false,
//         },
//       ],
//       certificationItems: [
//         {
//           id: 'cert-1',
//           name: 'AWS Certified Solutions Architect',
//           issuer: 'Amazon Web Services',
//           date: 'Jun 2023',
//           checked: false,
//         },
//         {
//           id: 'cert-2',
//           name: 'Google Cloud Professional Developer',
//           issuer: 'Google Cloud',
//           date: 'Mar 2023',
//           checked: false,
//         },
//       ],
//     },
//     {
//       id: 'section-3',
//       name: 'Projects',
//       isExpanded: true,
//       projectItems: [
//         {
//           id: 'proj-1',
//           name: 'Name',
//           role: 'Lead Developer',
//           startDate: 'Jan 2023',
//           endDate: 'Jun 2023',
//           description: 'Built platform with React and Node.js',
//           technologies: 'React, Node.js, MongoDB',
//           checked: false,
//         },
//         {
//           id: 'proj-2',
//           name: 'Name',
//           role: 'Data Scientist',
//           startDate: 'Sep 2022',
//           endDate: 'Dec 2022',
//           description: 'Developed a...',
//           technologies: 'Python, TensorFlow',
//           checked: false,
//         },
//       ],
//     },
//     {
//       id: 'section-4',
//       name: 'Skills & Expertise',
//       isExpanded: true,
//       skillItems: [
//         {
//           id: 'skill-1',
//           category: 'Programming Languages',
//           skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++'],
//           checked: false,
//         },
//         {
//           id: 'skill-2',
//           category: 'Frameworks & Libraries',
//           skills: ['React', 'Node.js', 'Express', 'Git'],
//           checked: false,
//         },
//         {
//           id: 'skill-3',
//           category: 'Tools & Technologies',
//           skills: ['AWS', 'Git', 'MongoDB'],
//           checked: false,
//         },
//       ],
//     },
//     {
//       id: 'section-5',
//       name: 'Volunteer Work',
//       isExpanded: true,
//       volunteerItems: [
//         {
//           id: 'vol-1',
//           organization: 'Name',
//           role: 'Volunteer',
//           startDate: 'Jan 2022',
//           endDate: 'Present',
//           description: 'Developed open source tools for...',
//           checked: false,
//         },
//         {
//           id: 'vol-2',
//           organization: 'Tech  Program',
//           role: 'Mentor',
//           startDate: 'Mar 2021',
//           endDate: 'Dec 2022',
//           description: 'Mentored developers in web development',
//           checked: false,
//         },
//       ],
//     },
//   ]);

//   const templates: Template[] = [
//     { 
//       id: 1, 
//       name: 'Professional Template',
//       description: 'Classic layout for traditional industries',
//       category: 'Professional',
//       date: '2024-01-18'
//     },
//     { 
//       id: 2, 
//       name: 'Modern Template',
//       description: 'Contemporary design with accent colors',
//       category: 'Modern',
//       date: '2024-01-15'
//     },
//     { 
//       id: 3, 
//       name: 'Minimal Template',
//       description: 'Clean and simple aesthetic',
//       category: 'Minimal',
//       date: '2024-01-12'
//     },
//     { 
//       id: 4, 
//       name: 'Creative Template',
//       description: 'Unique layout for creative professionals',
//       category: 'Creative',
//       date: '2024-01-10'
//     },
//   ];

//   {/* Selecting different types of content items in resume builder */}
//   const handleItemToggle = (sectionId: string, itemId: string) => {
//     setSections(sections.map(section => 
//       section.id === sectionId 
//         ? {
//             ...section,
//             items: section.items?.map(item =>
//               item.id === itemId ? { ...item, checked: !item.checked } : item
//             )
//           }
//         : section
//     ));
//   };

//   const handleEducationToggle = (sectionId: string, eduId: string) => {
//     setSections(sections.map(section => 
//       section.id === sectionId 
//         ? {
//             ...section,
//             educationItems: section.educationItems?.map(edu =>
//               edu.id === eduId ? { ...edu, checked: !edu.checked } : edu
//             )
//           }
//         : section
//     ));
//   };

//   const handleExperienceToggle = (sectionId: string, expId: string) => {
//     setSections(sections.map(section => 
//       section.id === sectionId 
//         ? {
//             ...section,
//             experienceItems: section.experienceItems?.map(exp =>
//               exp.id === expId ? { ...exp, checked: !exp.checked } : exp
//             )
//           }
//         : section
//     ));
//   };

//   const handleProjectToggle = (sectionId: string, projectId: string) => {
//     setSections(sections.map(section => 
//       section.id === sectionId 
//         ? {
//             ...section,
//             projectItems: section.projectItems?.map(project =>
//               project.id === projectId ? { ...project, checked: !project.checked } : project
//             )
//           }
//         : section
//     ));
//   };

//   const handleCertificationToggle = (sectionId: string, certId: string) => {
//     setSections(sections.map(section => 
//       section.id === sectionId 
//         ? {
//             ...section,
//             certificationItems: section.certificationItems?.map(cert =>
//               cert.id === certId ? { ...cert, checked: !cert.checked } : cert
//             )
//           }
//         : section
//     ));
//   };

//   const handleSkillToggle = (sectionId: string, skillId: string) => {
//     setSections(sections.map(section => 
//       section.id === sectionId 
//         ? {
//             ...section,
//             skillItems: section.skillItems?.map(skill =>
//               skill.id === skillId ? { ...skill, checked: !skill.checked } : skill
//             )
//           }
//         : section
//     ));
//   };

//   const handleVolunteerToggle = (sectionId: string, volId: string) => {
//     setSections(sections.map(section => 
//       section.id === sectionId 
//         ? {
//             ...section,
//             volunteerItems: section.volunteerItems?.map(vol =>
//               vol.id === volId ? { ...vol, checked: !vol.checked } : vol
//             )
//           }
//         : section
//     ));
//   };

//   const handleSelectTemplate = (index: number) => {
//     setSelectedTemplate(index);
//   };

//   const handleExperienceClick = (sectionId: string, expId: string) => {
//     handleExperienceToggle(sectionId, expId);
//   };

//   const handleEducationClick = (sectionId: string, eduId: string) => {
//     handleEducationToggle(sectionId, eduId);
//   };

//   const handleProjectClick = (sectionId: string, projectId: string) => {
//     handleProjectToggle(sectionId, projectId);
//   };

//   const handleCertificationClick = (sectionId: string, certId: string) => {
//     handleCertificationToggle(sectionId, certId);
//   };

//   const handleSkillClick = (sectionId: string, skillId: string) => {
//     handleSkillToggle(sectionId, skillId);
//   };

//   const handleVolunteerClick = (sectionId: string, volId: string) => {
//     handleVolunteerToggle(sectionId, volId);
//   };

//   const handleItemClick = (sectionId: string, itemId: string) => {
//     handleItemToggle(sectionId, itemId);
//   };

//   const handleNavigateToProfile = () => {
//     window.location.href = '/profile';
//   };

//   const toggleSection = (sectionId: string) => {
//     setSections(sections.map(section => 
//       section.id === sectionId 
//         ? { ...section, isExpanded: !section.isExpanded }
//         : section
//     ));
//   };

//   return (
//     <div style={{
//       minHeight: '100vh',
//       backgroundColor: '#f8fafc',
//       padding: '24px',
//       fontFamily: 'system-ui, -apple-system, sans-serif'
//     }}>
//       <div style={{
//         maxWidth: '1400px',
//         margin: '0 auto'
//       }}>
//         {/* Header section with info button and profile button */}
//         <div style={{ 
//           marginBottom: '32px',
//           position: 'relative'
//         }}>
//           <div style={{
//             display: 'flex',
//             alignItems: 'flex-start',
//             justifyContent: 'space-between'
//           }}>
//             <div style={{ flex: 1 }}>
//               <h2 style={{
//                 fontSize: '28px',
//                 fontWeight: '700',
//                 margin: '0 0 12px 0',
//                 color: '#1e293b',
//                 letterSpacing: '-0.02em'
//               }}>
//                 Create Your Resume
//               </h2>
//               <p style={{
//                 color: '#64748b',
//                 margin: 0,
//                 fontSize: '16px',
//                 lineHeight: '1.5'
//               }}>
//                 Select a template and choose which items to include from your profile
//               </p>
//             </div>
            
//             <div style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '12px'
//             }}>
//               {/* Profile Button */}
//               <button
//                 onClick={handleNavigateToProfile}
//                 style={{
//                   padding: '8px 16px',
//                   borderRadius: '8px',
//                   border: '1px solid #d1d5db',
//                   backgroundColor: 'white',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   cursor: 'pointer',
//                   fontSize: '14px',
//                   fontWeight: '500',
//                   color: '#374151',
//                 }}
//               >
//                 Edit Profile
//               </button>
            
//               {/* Info Button */}
//               <button
//                 onClick={() => setShowInstructions(!showInstructions)}
//                 style={{
//                   width: '32px',
//                   height: '32px',
//                   borderRadius: '50%',
//                   border: '1px solid #d1d5db',
//                   backgroundColor: 'white',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   cursor: 'pointer',
//                   fontSize: '16px',
//                   fontWeight: '600',
//                   color: '#6b7280',
//                 }}
//               >
//                 i
//               </button>
//             </div>
//           </div>

//           {/* Instructions Panel */}
//           {showInstructions && (
//             <div style={{
//               backgroundColor: '#ffedd6',
//               border: '1px solid #fdd9ba',
//               borderRadius: '8px',
//               padding: '16px',
//               marginTop: '16px',
//               fontSize: '14px',
//               color: '#63441a'
//             }}>
//               <h4 style={{
//                 fontSize: '14px',
//                 fontWeight: '600',
//                 margin: '0 0 8px 0',
//                 color: '#63441a'
//               }}>
//                 How to create your resume:
//               </h4>
//               <ul style={{
//                 margin: 0,
//                 paddingLeft: '20px',
//                 lineHeight: '1.5'
//               }}>
//                 <li>Choose a template from the left sidebar</li>
//                 <li>Select the checkboxes next to the content you want to include</li>
//                 <li>Your resume will update with your selections</li>
//                 <li><strong>Note:</strong> Content is pulled from your profile. To edit your information, please update your profile first.</li>
//               </ul>
//             </div>
//           )}
//         </div>

//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: '320px 1fr',
//           gap: '24px',
//           alignItems: 'start'
//         }}>

//              {/* Sidebar Component */}
//           <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
//           {/* Template Selector - Left Sidebar */}
//           <div>
//             <div style={{
//               border: '2px solid #f1f5f9',
//               borderRadius: '16px',
//               backgroundColor: 'white',
//               overflow: 'hidden',
//               boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
//               position: 'sticky',
//               top: '24px'
//             }}>
//               <div style={{
//                 padding: '16px 20px',
//                 backgroundColor: '#f8fafc',
//                 borderBottom: '1px solid #f1f5f9',
//                 background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
//               }}>
//                 <h3 style={{
//                   fontSize: '18px',
//                   fontWeight: '700',
//                   margin: 0,
//                   color: '#1e293b',
//                   letterSpacing: '-0.02em'
//                 }}>
//                   Choose a Template
//                 </h3>
//                 <p style={{
//                   fontSize: '14px',
//                   color: '#64748b',
//                   margin: '4px 0 0 0'
//                 }}>
//                   Select a design for your resume
//                 </p>
//               </div>

//               <div style={{ padding: '16px' }}>
//                 <div style={{
//                   display: 'flex',
//                   flexDirection: 'column',
//                   gap: '12px'
//                 }}>
//                   {templates.map((template, index) => (
//                     <div
//                       key={template.id}
//                       style={{
//                         border: selectedTemplate === index ? '2px solid #22c55e' : '1px solid #e2e8f0',
//                         borderRadius: '12px',
//                         backgroundColor: 'white',
//                         overflow: 'hidden',
//                         cursor: 'pointer',
//                         boxShadow: selectedTemplate === index 
//                           ? '0 4px 12px rgba(34, 197, 94, 0.15)' 
//                           : '0 2px 4px rgba(0, 0, 0, 0.04)'
//                       }}
//                       onClick={() => handleSelectTemplate(index)}
//                     >
//                       {/* Preview Area */}
//                       <div style={{
//                         height: '80px',
//                         background: 'linear-gradient(135deg, #dcfce7 0%, #86efac 100%)'
//                       }}></div>
                      
//                       {/* Content Area */}
//                       <div style={{ padding: '12px' }}>
//                         <h4 style={{
//                           fontSize: '14px',
//                           fontWeight: '600',
//                           margin: '0 0 6px 0',
//                           color: '#1e293b'
//                         }}>
//                           {template.name}
//                         </h4>
//                         <p style={{
//                           fontSize: '12px',
//                           color: '#64748b',
//                           margin: '0 0 8px 0',
//                           lineHeight: '1.4'
//                         }}>
//                           {template.description}
//                         </p>
                        
//                         <div style={{
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'space-between'
//                         }}>
//                           <span style={{
//                             backgroundColor: '#dcfce7',
//                             color: '#166534',
//                             padding: '2px 6px',
//                             borderRadius: '4px',
//                             fontSize: '11px',
//                             fontWeight: '600'
//                           }}>
//                             {template.category}
//                           </span>
//                           <span style={{
//                             fontSize: '11px',
//                             color: '#94a3b8'
//                           }}>
//                             {template.date}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Resume Builder - Main Content */}
//           <div>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
//               {sections.map((section) => (
//                 <div key={section.id} style={{
//                   border: '2px solid #f1f5f9',
//                   borderRadius: '16px',
//                   backgroundColor: 'white',
//                   overflow: 'hidden',
//                   boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
//                 }}>
//                   {/* Header Area -- Clickable for collapse/expand */}
//                   <div 
//                     style={{
//                       padding: '16px 24px',
//                       backgroundColor: '#f8fafc',
//                       borderBottom: '1px solid #f1f5f9',
//                       background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
//                       cursor: 'pointer',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'space-between'
//                     }}
//                     onClick={() => toggleSection(section.id)}
//                   >
//                     <h3 style={{
//                       fontSize: '18px',
//                       fontWeight: '700',
//                       margin: 0,
//                       color: '#1e293b',
//                       letterSpacing: '-0.02em'
//                     }}>
//                       {section.name}
//                     </h3>
//                     <svg 
//                       style={{
//                         transform: section.isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
//                         transition: 'transform 0.2s ease',
//                         width: '20px',
//                         height: '20px',
//                         color: '#64748b'
//                       }}
//                       fill="none" 
//                       stroke="currentColor" 
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
                  
//                   {/* Content Area - Conditionally rendered based on isExpanded */}
//                   {section.isExpanded && (
//                     <div style={{ padding: '24px' }}>
//                       {/* Experience Items */}
//                       {section.experienceItems && (
//                         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//                           {section.experienceItems.map((exp) => (
//                             <div 
//                               key={exp.id} 
//                               style={{ 
//                                 display: 'flex', 
//                                 alignItems: 'center', 
//                                 gap: '12px',
//                                 cursor: 'pointer',
//                                 padding: '4px',
//                                 borderRadius: '8px',
//                               }}
//                               onClick={() => handleExperienceClick(section.id, exp.id)}
//                             >
//                               <div style={{ 
//                                 display: 'flex', 
//                                 alignItems: 'center', 
//                                 justifyContent: 'center',
//                                 minWidth: '20px'
//                               }}>
//                                 <Checkbox
//                                   id={exp.id}
//                                   checked={exp.checked}
//                                   onCheckedChange={() => handleExperienceToggle(section.id, exp.id)}
//                                 />
//                               </div>
//                               <div style={{ flex: 1 }}>
//                                 <div style={{
//                                   padding: '16px',
//                                   backgroundColor: exp.checked ? '#f0f9ff' : '#f8fafc',
//                                   borderRadius: '8px',
//                                   border: exp.checked ? '2px solid #3b82f6' : '1px solid #e2e8f0',
//                                 }}>
//                                   <div style={{
//                                     display: 'flex',
//                                     alignItems: 'flex-start',
//                                     justifyContent: 'space-between',
//                                     marginBottom: '8px'
//                                   }}>
//                                     <div>
//                                       <h4 style={{
//                                         fontSize: '16px',
//                                         fontWeight: '600',
//                                         margin: '0 0 4px 0',
//                                         color: '#1e293b'
//                                       }}>
//                                         {exp.position}
//                                       </h4>
//                                       <p style={{
//                                         fontSize: '14px',
//                                         color: '#64748b',
//                                         margin: '0 0 4px 0'
//                                       }}>
//                                         {exp.company} • {exp.location}
//                                       </p>
//                                       {exp.description && (
//                                         <p style={{
//                                           fontSize: '14px',
//                                           color: '#64748b',
//                                           margin: 0,
//                                           fontStyle: 'italic'
//                                         }}>
//                                           {exp.description}
//                                         </p>
//                                       )}
//                                     </div>
//                                     <span style={{
//                                       fontSize: '14px',
//                                       color: '#64748b',
//                                       whiteSpace: 'nowrap',
//                                       marginLeft: '16px'
//                                     }}>
//                                       {exp.startDate} - {exp.endDate}
//                                     </span>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}

//                       {/* Education Items */}
//                       {section.educationItems && (
//                         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//                           {section.educationItems.map((edu) => (
//                             <div 
//                               key={edu.id} 
//                               style={{ 
//                                 display: 'flex', 
//                                 alignItems: 'center', 
//                                 gap: '12px',
//                                 cursor: 'pointer',
//                                 padding: '4px',
//                                 borderRadius: '8px',
//                               }}
//                               onClick={() => handleEducationClick(section.id, edu.id)}
//                             >
//                               <div style={{ 
//                                 display: 'flex', 
//                                 alignItems: 'center', 
//                                 justifyContent: 'center',
//                                 minWidth: '20px'
//                               }}>
//                                 <Checkbox
//                                   id={edu.id}
//                                   checked={edu.checked}
//                                   onCheckedChange={() => handleEducationToggle(section.id, edu.id)}
//                                 />
//                               </div>
//                               <div style={{ flex: 1 }}>
//                                 <div style={{
//                                   padding: '16px',
//                                   backgroundColor: edu.checked ? '#f0f9ff' : '#f8fafc',
//                                   borderRadius: '8px',
//                                   border: edu.checked ? '2px solid #3b82f6' : '1px solid #e2e8f0',
//                                 }}>
//                                   <div style={{
//                                     display: 'flex',
//                                     alignItems: 'flex-start',
//                                     justifyContent: 'space-between',
//                                     marginBottom: '8px'
//                                   }}>
//                                     <div>
//                                       <h4 style={{
//                                         fontSize: '16px',
//                                         fontWeight: '600',
//                                         margin: '0 0 4px 0',
//                                         color: '#1e293b'
//                                       }}>
//                                         {edu.institution}
//                                       </h4>
//                                       <p style={{
//                                         fontSize: '14px',
//                                         color: '#64748b',
//                                         margin: 0
//                                       }}>
//                                         {edu.degree} in {edu.field}
//                                       </p>
//                                     </div>
//                                     <span style={{
//                                       fontSize: '14px',
//                                       color: '#64748b',
//                                       whiteSpace: 'nowrap',
//                                       marginLeft: '16px'
//                                     }}>
//                                       {edu.startDate} - {edu.endDate}
//                                     </span>
//                                   </div>
//                                   {(edu.gpa || edu.honors) && (
//                                     <div style={{
//                                       display: 'flex',
//                                       gap: '16px',
//                                       fontSize: '14px',
//                                       color: '#64748b'
//                                     }}>
//                                       {edu.gpa && <span>GPA: {edu.gpa}</span>}
//                                       {edu.honors && <span>• {edu.honors}</span>}
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}

//                       {/* Certification Items */}
//                       {section.certificationItems && (
//                         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//                           {section.certificationItems.map((cert) => (
//                             <div 
//                               key={cert.id} 
//                               style={{ 
//                                 display: 'flex', 
//                                 alignItems: 'center', 
//                                 gap: '12px',
//                                 cursor: 'pointer',
//                                 padding: '4px',
//                                 borderRadius: '8px',
//                               }}
//                               onClick={() => handleCertificationClick(section.id, cert.id)}
//                             >
//                               <div style={{ 
//                                 display: 'flex', 
//                                 alignItems: 'center', 
//                                 justifyContent: 'center',
//                                 minWidth: '20px'
//                               }}>
//                                 <Checkbox
//                                   id={cert.id}
//                                   checked={cert.checked}
//                                   onCheckedChange={() => handleCertificationToggle(section.id, cert.id)}
//                                 />
//                               </div>
//                               <div style={{ flex: 1 }}>
//                                 <div style={{
//                                   padding: '16px',
//                                   backgroundColor: cert.checked ? '#f0f9ff' : '#f8fafc',
//                                   borderRadius: '8px',
//                                   border: cert.checked ? '2px solid #3b82f6' : '1px solid #e2e8f0',
//                                 }}>
//                                   <div style={{
//                                     display: 'flex',
//                                     alignItems: 'flex-start',
//                                     justifyContent: 'space-between',
//                                     marginBottom: '8px'
//                                   }}>
//                                     <div>
//                                       <h4 style={{
//                                         fontSize: '16px',
//                                         fontWeight: '600',
//                                         margin: '0 0 4px 0',
//                                         color: '#1e293b'
//                                       }}>
//                                         {cert.name}
//                                       </h4>
//                                       <p style={{
//                                         fontSize: '14px',
//                                         color: '#64748b',
//                                         margin: 0
//                                       }}>
//                                         {cert.issuer}
//                                       </p>
//                                     </div>
//                                     <span style={{
//                                       fontSize: '14px',
//                                       color: '#64748b',
//                                       whiteSpace: 'nowrap',
//                                       marginLeft: '16px'
//                                     }}>
//                                       {cert.date}
//                                     </span>
//                                   </div>
//                                   {cert.credentialId && (
//                                     <div style={{
//                                       fontSize: '14px',
//                                       color: '#64748b'
//                                     }}>
//                                       Credential ID: {cert.credentialId}
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}

//                       {/* Project Items */}
//                       {section.projectItems && (
//                         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//                           {section.projectItems.map((project) => (
//                             <div 
//                               key={project.id} 
//                               style={{ 
//                                 display: 'flex', 
//                                 alignItems: 'center', 
//                                 gap: '12px',
//                                 cursor: 'pointer',
//                                 padding: '4px',
//                                 borderRadius: '8px',
//                               }}
//                               onClick={() => handleProjectClick(section.id, project.id)}
//                             >
//                               <div style={{ 
//                                 display: 'flex', 
//                                 alignItems: 'center', 
//                                 justifyContent: 'center',
//                                 minWidth: '20px'
//                               }}>
//                                 <Checkbox
//                                   id={project.id}
//                                   checked={project.checked}
//                                   onCheckedChange={() => handleProjectToggle(section.id, project.id)}
//                                 />
//                               </div>
//                               <div style={{ flex: 1 }}>
//                                 <div style={{
//                                   padding: '16px',
//                                   backgroundColor: project.checked ? '#f0f9ff' : '#f8fafc',
//                                   borderRadius: '8px',
//                                   border: project.checked ? '2px solid #3b82f6' : '1px solid #e2e8f0',
//                                 }}>
//                                   <div style={{
//                                     display: 'flex',
//                                     alignItems: 'flex-start',
//                                     justifyContent: 'space-between',
//                                     marginBottom: '8px'
//                                   }}>
//                                     <div>
//                                       <h4 style={{
//                                         fontSize: '16px',
//                                         fontWeight: '600',
//                                         margin: '0 0 4px 0',
//                                         color: '#1e293b'
//                                       }}>
//                                         {project.name}
//                                       </h4>
//                                       <p style={{
//                                         fontSize: '14px',
//                                         color: '#64748b',
//                                         margin: '0 0 4px 0'
//                                       }}>
//                                         {project.role}
//                                       </p>
//                                       {project.description && (
//                                         <p style={{
//                                           fontSize: '14px',
//                                           color: '#64748b',
//                                           margin: '0 0 4px 0',
//                                           fontStyle: 'italic'
//                                         }}>
//                                           {project.description}
//                                         </p>
//                                       )}
//                                       {project.technologies && (
//                                         <p style={{
//                                           fontSize: '14px',
//                                           color: '#64748b',
//                                           margin: 0
//                                         }}>
//                                           <strong>Technologies:</strong> {project.technologies}
//                                         </p>
//                                       )}
//                                     </div>
//                                     <span style={{
//                                       fontSize: '14px',
//                                       color: '#64748b',
//                                       whiteSpace: 'nowrap',
//                                       marginLeft: '16px'
//                                     }}>
//                                       {project.startDate} - {project.endDate}
//                                     </span>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}

//                       {/* Skill Items */}
//                       {section.skillItems && (
//                         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//                           {section.skillItems.map((skill) => (
//                             <div 
//                               key={skill.id} 
//                               style={{ 
//                                 display: 'flex', 
//                                 alignItems: 'center', 
//                                 gap: '12px',
//                                 cursor: 'pointer',
//                                 padding: '4px',
//                                 borderRadius: '8px',
//                               }}
//                               onClick={() => handleSkillClick(section.id, skill.id)}
//                             >
//                               <div style={{ 
//                                 display: 'flex', 
//                                 alignItems: 'center', 
//                                 justifyContent: 'center',
//                                 minWidth: '20px'
//                               }}>
//                                 <Checkbox
//                                   id={skill.id}
//                                   checked={skill.checked}
//                                   onCheckedChange={() => handleSkillToggle(section.id, skill.id)}
//                                 />
//                               </div>
//                               <div style={{ flex: 1 }}>
//                                 <div style={{
//                                   padding: '16px',
//                                   backgroundColor: skill.checked ? '#f0f9ff' : '#f8fafc',
//                                   borderRadius: '8px',
//                                   border: skill.checked ? '2px solid #3b82f6' : '1px solid #e2e8f0',
//                                 }}>
//                                   <h4 style={{
//                                     fontSize: '16px',
//                                     fontWeight: '600',
//                                     margin: '0 0 8px 0',
//                                     color: '#1e293b'
//                                   }}>
//                                     {skill.category}
//                                   </h4>
//                                   <div style={{
//                                     display: 'flex',
//                                     flexWrap: 'wrap',
//                                     gap: '8px'
//                                   }}>
//                                     {skill.skills.map((skillItem, index) => (
//                                       <span
//                                         key={index}
//                                         style={{
//                                           backgroundColor: '#e2e8f0',
//                                           color: '#475569',
//                                           padding: '4px 8px',
//                                           borderRadius: '4px',
//                                           fontSize: '14px',
//                                           fontWeight: '500'
//                                         }}
//                                       >
//                                         {skillItem}
//                                       </span>
//                                     ))}
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}

//                       {/* Volunteer Items */}
//                       {section.volunteerItems && (
//                         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//                           {section.volunteerItems.map((vol) => (
//                             <div 
//                               key={vol.id} 
//                               style={{ 
//                                 display: 'flex', 
//                                 alignItems: 'center', 
//                                 gap: '12px',
//                                 cursor: 'pointer',
//                                 padding: '4px',
//                                 borderRadius: '8px',
//                               }}
//                               onClick={() => handleVolunteerClick(section.id, vol.id)}
//                             >
//                               <div style={{ 
//                                 display: 'flex', 
//                                 alignItems: 'center', 
//                                 justifyContent: 'center',
//                                 minWidth: '20px'
//                               }}>
//                                 <Checkbox
//                                   id={vol.id}
//                                   checked={vol.checked}
//                                   onCheckedChange={() => handleVolunteerToggle(section.id, vol.id)}
//                                 />
//                               </div>
//                               <div style={{ flex: 1 }}>
//                                 <div style={{
//                                   padding: '16px',
//                                   backgroundColor: vol.checked ? '#f0f9ff' : '#f8fafc',
//                                   borderRadius: '8px',
//                                   border: vol.checked ? '2px solid #3b82f6' : '1px solid #e2e8f0',
//                                 }}>
//                                   <div style={{
//                                     display: 'flex',
//                                     alignItems: 'flex-start',
//                                     justifyContent: 'space-between',
//                                     marginBottom: '8px'
//                                   }}>
//                                     <div>
//                                       <h4 style={{
//                                         fontSize: '16px',
//                                         fontWeight: '600',
//                                         margin: '0 0 4px 0',
//                                         color: '#1e293b'
//                                       }}>
//                                         {vol.organization}
//                                       </h4>
//                                       <p style={{
//                                         fontSize: '14px',
//                                         color: '#64748b',
//                                         margin: '0 0 4px 0'
//                                       }}>
//                                         {vol.role}
//                                       </p>
//                                       {vol.description && (
//                                         <p style={{
//                                           fontSize: '14px',
//                                           color: '#64748b',
//                                           margin: 0,
//                                           fontStyle: 'italic'
//                                         }}>
//                                           {vol.description}
//                                         </p>
//                                       )}
//                                     </div>
//                                     <span style={{
//                                       fontSize: '14px',
//                                       color: '#64748b',
//                                       whiteSpace: 'nowrap',
//                                       marginLeft: '16px'
//                                     }}>
//                                       {vol.startDate} - {vol.endDate}
//                                     </span>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}

//                       {/* Regular Items */}
//                       {section.items && (
//                         <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//                           {section.items.map((item) => (
//                             <div 
//                               key={item.id} 
//                               style={{ 
//                                 display: 'flex', 
//                                 alignItems: 'center', 
//                                 gap: '12px',
//                                 cursor: 'pointer',
//                                 padding: '8px',
//                                 borderRadius: '6px',
//                               }}
//                               onClick={() => handleItemClick(section.id, item.id)}
//                             >
//                               <div style={{ 
//                                 display: 'flex', 
//                                 alignItems: 'center', 
//                                 justifyContent: 'center',
//                                 minWidth: '20px'
//                               }}>
//                                 <Checkbox
//                                   id={item.id}
//                                   checked={item.checked}
//                                   onCheckedChange={() => handleItemToggle(section.id, item.id)}
//                                 />
//                               </div>
//                               <div style={{
//                                 color: item.checked ? '#1e40af' : '#374151',
//                                 fontSize: '14px',
//                                 lineHeight: '1.5',
//                                 fontWeight: item.checked ? '600' : '400'
//                               }}>
//                                 {item.text}
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useState } from 'react';
import { Checkbox } from './Components/ui/checkbox';
import Sidebar from "./Sidebar";
import { useNavigate } from 'react-router-dom';

interface SectionItem {
  id: string;
  text: string;
  checked: boolean;
}

interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
  checked: boolean;
}

interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description?: string;
  checked: boolean;
}

interface ProjectItem {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  description?: string;
  technologies?: string;
  checked: boolean;
}

interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  checked: boolean;
}

interface SkillItem {
  id: string;
  category: string;
  skills: string[];
  checked: boolean;
}

interface VolunteerItem {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description?: string;
  checked: boolean;
}

interface ResumeSection {
  id: string;
  name: string;
  items?: SectionItem[];
  educationItems?: EducationItem[];
  experienceItems?: ExperienceItem[];
  projectItems?: ProjectItem[];
  certificationItems?: CertificationItem[];
  skillItems?: SkillItem[];
  volunteerItems?: VolunteerItem[];
  isExpanded: boolean;
}

interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  date: string;
}

export function CreatePage() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sections, setSections] = useState<ResumeSection[]>([
    {
      id: 'section-1',
      name: 'Professional Experience',
      isExpanded: false,
      experienceItems: [
        {
          id: 'exp-1',
          company: 'Tech Corp Inc.',
          position: 'Senior Software Engineer',
          location: 'San Francisco, CA',
          startDate: 'Mar 2022',
          endDate: 'Present',
          description: 'Lead development of cloud-native applications',
          checked: false,
        },
        {
          id: 'exp-2',
          company: 'Startup XYZ',
          position: 'Full Stack Developer',
          location: 'Austin, TX',
          startDate: 'Jan 2020',
          endDate: 'Mar 2022',
          description: 'Built and maintained web applications using React and Node.js',
          checked: false,
        },
        {
          id: 'exp-3',
          company: 'Digital Solutions LLC',
          position: 'Junior Developer',
          location: 'Remote',
          startDate: 'Jun 2018',
          endDate: 'Jan 2020',
          description: 'Developed responsive websites and implemented new features',
          checked: false,
        },
      ],
    },
    {
      id: 'section-2',
      name: 'Education & Certifications',
      isExpanded: false,
      educationItems: [
        {
          id: 'edu-1',
          institution: 'UTD',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startDate: 'Sep 2016',
          endDate: 'Jun 2020',
          gpa: '3.8/4.0',
          honors: 'Cum Laude',
          checked: false,
        },
        {
          id: 'edu-2',
          institution: 'SMU',
          degree: 'Master of Science',
          field: 'Artificial Intelligence + Gender Studies',
          startDate: 'Sep 2020',
          endDate: 'Jun 2022',
          gpa: '3.9/4.0',
          checked: false,
        },
      ],
      certificationItems: [
        {
          id: 'cert-1',
          name: 'AWS Certified Solutions Architect',
          issuer: 'Amazon Web Services',
          date: 'Jun 2023',
          checked: false,
        },
        {
          id: 'cert-2',
          name: 'Google Cloud Professional Developer',
          issuer: 'Google Cloud',
          date: 'Mar 2023',
          checked: false,
        },
      ],
    },
    {
      id: 'section-3',
      name: 'Projects',
      isExpanded: false,
      projectItems: [
        {
          id: 'proj-1',
          name: 'Name',
          role: 'Lead Developer',
          startDate: 'Jan 2023',
          endDate: 'Jun 2023',
          description: 'Built platform with React and Node.js',
          technologies: 'React, Node.js, MongoDB',
          checked: false,
        },
        {
          id: 'proj-2',
          name: 'Name',
          role: 'Data Scientist',
          startDate: 'Sep 2022',
          endDate: 'Dec 2022',
          description: 'Developed a...',
          technologies: 'Python, TensorFlow',
          checked: false,
        },
      ],
    },
    {
      id: 'section-4',
      name: 'Skills & Expertise',
      isExpanded: false,
      skillItems: [
        {
          id: 'skill-1',
          category: 'Programming Languages',
          skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++'],
          checked: false,
        },
        {
          id: 'skill-2',
          category: 'Frameworks & Libraries',
          skills: ['React', 'Node.js', 'Express', 'Git'],
          checked: false,
        },
        {
          id: 'skill-3',
          category: 'Tools & Technologies',
          skills: ['AWS', 'Git', 'MongoDB'],
          checked: false,
        },
      ],
    },
    {
      id: 'section-5',
      name: 'Volunteer Work',
      isExpanded: false,
      volunteerItems: [
        {
          id: 'vol-1',
          organization: 'Name',
          role: 'Volunteer',
          startDate: 'Jan 2022',
          endDate: 'Present',
          description: 'Developed open source tools for...',
          checked: false,
        },
        {
          id: 'vol-2',
          organization: 'Tech  Program',
          role: 'Mentor',
          startDate: 'Mar 2021',
          endDate: 'Dec 2022',
          description: 'Mentored developers in web development',
          checked: false,
        },
      ],
    },
  ]);

  const templates: Template[] = [
    { 
      id: 1, 
      name: 'Professional Template',
      description: 'Classic layout for traditional industries',
      category: 'Professional',
      date: '2024-01-18'
    },
    { 
      id: 2, 
      name: 'Modern Template',
      description: 'Contemporary design with accent colors',
      category: 'Modern',
      date: '2024-01-15'
    },
    { 
      id: 3, 
      name: 'Minimal Template',
      description: 'Clean and simple aesthetic',
      category: 'Minimal',
      date: '2024-01-12'
    },
    { 
      id: 4, 
      name: 'Creative Template',
      description: 'Unique layout for creative professionals',
      category: 'Creative',
      date: '2024-01-10'
    },
  ];

  const handleItemToggle = (sectionId: string, itemId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            items: section.items?.map(item =>
              item.id === itemId ? { ...item, checked: !item.checked } : item
            )
          }
        : section
    ));
  };

  const handleEducationToggle = (sectionId: string, eduId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            educationItems: section.educationItems?.map(edu =>
              edu.id === eduId ? { ...edu, checked: !edu.checked } : edu
            )
          }
        : section
    ));
  };

  const handleExperienceToggle = (sectionId: string, expId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            experienceItems: section.experienceItems?.map(exp =>
              exp.id === expId ? { ...exp, checked: !exp.checked } : exp
            )
          }
        : section
    ));
  };

  const handleProjectToggle = (sectionId: string, projectId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            projectItems: section.projectItems?.map(project =>
              project.id === projectId ? { ...project, checked: !project.checked } : project
            )
          }
        : section
    ));
  };

  const handleCertificationToggle = (sectionId: string, certId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            certificationItems: section.certificationItems?.map(cert =>
              cert.id === certId ? { ...cert, checked: !cert.checked } : cert
            )
          }
        : section
    ));
  };

  const handleSkillToggle = (sectionId: string, skillId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            skillItems: section.skillItems?.map(skill =>
              skill.id === skillId ? { ...skill, checked: !skill.checked } : skill
            )
          }
        : section
    ));
  };

  const handleVolunteerToggle = (sectionId: string, volId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            volunteerItems: section.volunteerItems?.map(vol =>
              vol.id === volId ? { ...vol, checked: !vol.checked } : vol
            )
          }
        : section
    ));
  };

  const handleSelectTemplate = (index: number) => {
    setSelectedTemplate(index);
  };

  const handleExperienceClick = (sectionId: string, expId: string) => {
    handleExperienceToggle(sectionId, expId);
  };

  const handleEducationClick = (sectionId: string, eduId: string) => {
    handleEducationToggle(sectionId, eduId);
  };

  const handleProjectClick = (sectionId: string, projectId: string) => {
    handleProjectToggle(sectionId, projectId);
  };

  const handleCertificationClick = (sectionId: string, certId: string) => {
    handleCertificationToggle(sectionId, certId);
  };

  const handleSkillClick = (sectionId: string, skillId: string) => {
    handleSkillToggle(sectionId, skillId);
  };

  const handleVolunteerClick = (sectionId: string, volId: string) => {
    handleVolunteerToggle(sectionId, volId);
  };

  const handleItemClick = (sectionId: string, itemId: string) => {
    handleItemToggle(sectionId, itemId);
  };

  const handleNavigateToProfile = () => {
    navigate('/Profile');
  };

  const handleNavigateToComparison = () => {
    navigate('/ComparePage');
  };

  const toggleSection = (sectionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, isExpanded: !section.isExpanded }
        : section
    ));
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex'
    }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div style={{
        flex: 1,
        padding: '24px',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div style={{ 
            marginBottom: '32px',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between'
            }}>
              <div style={{ flex: 1 }}>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  margin: '0 0 12px 0',
                  color: '#1e293b',
                  letterSpacing: '-0.02em'
                }}>
                  Create Your Resume
                </h2>
                <p style={{
                  color: '#64748b',
                  margin: 0,
                  fontSize: '16px',
                  lineHeight: '1.5'
                }}>
                  Select a template and choose which items to include from your profile
                </p>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <button
                  onClick={handleNavigateToComparison}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                  }}
                >
                  Create
                </button>

                <button
                  onClick={handleNavigateToProfile}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                  }}
                >
                  Edit Profile
                </button>
              
                <button
                  onClick={() => setShowInstructions(!showInstructions)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#6b7280',
                  }}
                >
                  i
                </button>
              </div>
            </div>

            {showInstructions && (
              <div style={{
                backgroundColor: '#ffedd6',
                border: '1px solid #fdd9ba',
                borderRadius: '8px',
                padding: '16px',
                marginTop: '16px',
                fontSize: '14px',
                color: '#63441a'
              }}>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                  color: '#63441a'
                }}>
                  How to create your resume:
                </h4>
                <ul style={{
                  margin: 0,
                  paddingLeft: '20px',
                  lineHeight: '1.5'
                }}>
                  <li>Choose a template from the left sidebar</li>
                  <li>Select the checkboxes next to the content you want to include</li>
                  <li>Your resume will update with your selections</li>
                  <li><strong>Note:</strong> Content is pulled from your profile. To edit your information, please update your profile first.</li>
                </ul>
              </div>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '320px 1fr',
            gap: '24px',
            alignItems: 'start'
          }}>
            <div>
              <div style={{
                border: '2px solid #f1f5f9',
                borderRadius: '16px',
                backgroundColor: 'white',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                position: 'sticky',
                top: '24px'
              }}>
                <div style={{
                  padding: '16px 20px',
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid #f1f5f9',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    margin: 0,
                    color: '#1e293b',
                    letterSpacing: '-0.02em'
                  }}>
                    Choose a Template
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#64748b',
                    margin: '4px 0 0 0'
                  }}>
                    Select a design for your resume
                  </p>
                </div>

                <div style={{ padding: '16px' }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    {templates.map((template, index) => (
                      <div
                        key={template.id}
                        style={{
                          border: selectedTemplate === index ? '2px solid #22c55e' : '1px solid #e2e8f0',
                          borderRadius: '12px',
                          backgroundColor: 'white',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          boxShadow: selectedTemplate === index 
                            ? '0 4px 12px rgba(34, 197, 94, 0.15)' 
                            : '0 2px 4px rgba(0, 0, 0, 0.04)'
                        }}
                        onClick={() => handleSelectTemplate(index)}
                      >
                        <div style={{
                          height: '80px',
                          background: 'linear-gradient(135deg, #dcfce7 0%, #86efac 100%)'
                        }}></div>
                        
                        <div style={{ padding: '12px' }}>
                          <h4 style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            margin: '0 0 6px 0',
                            color: '#1e293b'
                          }}>
                            {template.name}
                          </h4>
                          <p style={{
                            fontSize: '12px',
                            color: '#64748b',
                            margin: '0 0 8px 0',
                            lineHeight: '1.4'
                          }}>
                            {template.description}
                          </p>
                          
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}>
                            <span style={{
                              backgroundColor: '#dcfce7',
                              color: '#166534',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '600'
                            }}>
                              {template.category}
                            </span>
                            <span style={{
                              fontSize: '11px',
                              color: '#94a3b8'
                            }}>
                              {template.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {sections.map((section) => (
                  <div key={section.id} style={{
                    border: '2px solid #f1f5f9',
                    borderRadius: '16px',
                    backgroundColor: 'white',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                  }}>
                    <div 
                      style={{
                        padding: '16px 24px',
                        backgroundColor: '#f8fafc',
                        borderBottom: '1px solid #f1f5f9',
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onClick={() => toggleSection(section.id)}
                    >
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        margin: 0,
                        color: '#1e293b',
                        letterSpacing: '-0.02em'
                      }}>
                        {section.name}
                      </h3>
                      <svg 
                        style={{
                          transform: section.isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                          width: '20px',
                          height: '20px',
                          color: '#64748b'
                        }}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    {section.isExpanded && (
                      <div style={{ padding: '24px' }}>
                        {section.experienceItems && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {section.experienceItems.map((exp) => (
                              <div 
                                key={exp.id} 
                                style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '12px',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  borderRadius: '8px',
                                }}
                                onClick={() => handleExperienceClick(section.id, exp.id)}
                              >
                                <div style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  minWidth: '20px'
                                }}>
                                  <Checkbox
                                    id={exp.id}
                                    checked={exp.checked}
                                    onCheckedChange={() => handleExperienceToggle(section.id, exp.id)}
                                  />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{
                                    padding: '16px',
                                    backgroundColor: exp.checked ? '#f0f9ff' : '#f8fafc',
                                    borderRadius: '8px',
                                    border: exp.checked ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                  }}>
                                    <div style={{
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      justifyContent: 'space-between',
                                      marginBottom: '8px'
                                    }}>
                                      <div>
                                        <h4 style={{
                                          fontSize: '16px',
                                          fontWeight: '600',
                                          margin: '0 0 4px 0',
                                          color: '#1e293b'
                                        }}>
                                          {exp.position}
                                        </h4>
                                        <p style={{
                                          fontSize: '14px',
                                          color: '#64748b',
                                          margin: '0 0 4px 0'
                                        }}>
                                          {exp.company} • {exp.location}
                                        </p>
                                        {exp.description && (
                                          <p style={{
                                            fontSize: '14px',
                                            color: '#64748b',
                                            margin: 0,
                                            fontStyle: 'italic'
                                          }}>
                                            {exp.description}
                                          </p>
                                        )}
                                      </div>
                                      <span style={{
                                        fontSize: '14px',
                                        color: '#64748b',
                                        whiteSpace: 'nowrap',
                                        marginLeft: '16px'
                                      }}>
                                        {exp.startDate} - {exp.endDate}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {section.educationItems && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {section.educationItems.map((edu) => (
                              <div 
                                key={edu.id} 
                                style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '12px',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  borderRadius: '8px',
                                }}
                                onClick={() => handleEducationClick(section.id, edu.id)}
                              >
                                <div style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  minWidth: '20px'
                                }}>
                                  <Checkbox
                                    id={edu.id}
                                    checked={edu.checked}
                                    onCheckedChange={() => handleEducationToggle(section.id, edu.id)}
                                  />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{
                                    padding: '16px',
                                    backgroundColor: edu.checked ? '#f0f9ff' : '#f8fafc',
                                    borderRadius: '8px',
                                    border: edu.checked ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                  }}>
                                    <div style={{
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      justifyContent: 'space-between',
                                      marginBottom: '8px'
                                    }}>
                                      <div>
                                        <h4 style={{
                                          fontSize: '16px',
                                          fontWeight: '600',
                                          margin: '0 0 4px 0',
                                          color: '#1e293b'
                                        }}>
                                          {edu.institution}
                                        </h4>
                                        <p style={{
                                          fontSize: '14px',
                                          color: '#64748b',
                                          margin: 0
                                        }}>
                                          {edu.degree} in {edu.field}
                                        </p>
                                      </div>
                                      <span style={{
                                        fontSize: '14px',
                                        color: '#64748b',
                                        whiteSpace: 'nowrap',
                                        marginLeft: '16px'
                                      }}>
                                        {edu.startDate} - {edu.endDate}
                                      </span>
                                    </div>
                                    {(edu.gpa || edu.honors) && (
                                      <div style={{
                                        display: 'flex',
                                        gap: '16px',
                                        fontSize: '14px',
                                        color: '#64748b'
                                      }}>
                                        {edu.gpa && <span>GPA: {edu.gpa}</span>}
                                        {edu.honors && <span>• {edu.honors}</span>}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {section.certificationItems && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {section.certificationItems.map((cert) => (
                              <div 
                                key={cert.id} 
                                style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '12px',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  borderRadius: '8px',
                                }}
                                onClick={() => handleCertificationClick(section.id, cert.id)}
                              >
                                <div style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  minWidth: '20px'
                                }}>
                                  <Checkbox
                                    id={cert.id}
                                    checked={cert.checked}
                                    onCheckedChange={() => handleCertificationToggle(section.id, cert.id)}
                                  />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{
                                    padding: '16px',
                                    backgroundColor: cert.checked ? '#f0f9ff' : '#f8fafc',
                                    borderRadius: '8px',
                                    border: cert.checked ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                  }}>
                                    <div style={{
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      justifyContent: 'space-between',
                                      marginBottom: '8px'
                                    }}>
                                      <div>
                                        <h4 style={{
                                          fontSize: '16px',
                                          fontWeight: '600',
                                          margin: '0 0 4px 0',
                                          color: '#1e293b'
                                        }}>
                                          {cert.name}
                                        </h4>
                                        <p style={{
                                          fontSize: '14px',
                                          color: '#64748b',
                                          margin: 0
                                        }}>
                                          {cert.issuer}
                                        </p>
                                      </div>
                                      <span style={{
                                        fontSize: '14px',
                                        color: '#64748b',
                                        whiteSpace: 'nowrap',
                                        marginLeft: '16px'
                                      }}>
                                        {cert.date}
                                      </span>
                                    </div>
                                    {cert.credentialId && (
                                      <div style={{
                                        fontSize: '14px',
                                        color: '#64748b'
                                      }}>
                                        Credential ID: {cert.credentialId}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {section.projectItems && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {section.projectItems.map((project) => (
                              <div 
                                key={project.id} 
                                style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '12px',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  borderRadius: '8px',
                                }}
                                onClick={() => handleProjectClick(section.id, project.id)}
                              >
                                <div style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  minWidth: '20px'
                                }}>
                                  <Checkbox
                                    id={project.id}
                                    checked={project.checked}
                                    onCheckedChange={() => handleProjectToggle(section.id, project.id)}
                                  />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{
                                    padding: '16px',
                                    backgroundColor: project.checked ? '#f0f9ff' : '#f8fafc',
                                    borderRadius: '8px',
                                    border: project.checked ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                  }}>
                                    <div style={{
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      justifyContent: 'space-between',
                                      marginBottom: '8px'
                                    }}>
                                      <div>
                                        <h4 style={{
                                          fontSize: '16px',
                                          fontWeight: '600',
                                          margin: '0 0 4px 0',
                                          color: '#1e293b'
                                        }}>
                                          {project.name}
                                        </h4>
                                        <p style={{
                                          fontSize: '14px',
                                          color: '#64748b',
                                          margin: '0 0 4px 0'
                                        }}>
                                          {project.role}
                                        </p>
                                        {project.description && (
                                          <p style={{
                                            fontSize: '14px',
                                            color: '#64748b',
                                            margin: '0 0 4px 0',
                                            fontStyle: 'italic'
                                          }}>
                                            {project.description}
                                          </p>
                                        )}
                                        {project.technologies && (
                                          <p style={{
                                            fontSize: '14px',
                                            color: '#64748b',
                                            margin: 0
                                          }}>
                                            <strong>Technologies:</strong> {project.technologies}
                                          </p>
                                        )}
                                      </div>
                                      <span style={{
                                        fontSize: '14px',
                                        color: '#64748b',
                                        whiteSpace: 'nowrap',
                                        marginLeft: '16px'
                                      }}>
                                        {project.startDate} - {project.endDate}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {section.skillItems && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {section.skillItems.map((skill) => (
                              <div 
                                key={skill.id} 
                                style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '12px',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  borderRadius: '8px',
                                }}
                                onClick={() => handleSkillClick(section.id, skill.id)}
                              >
                                <div style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  minWidth: '20px'
                                }}>
                                  <Checkbox
                                    id={skill.id}
                                    checked={skill.checked}
                                    onCheckedChange={() => handleSkillToggle(section.id, skill.id)}
                                  />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{
                                    padding: '16px',
                                    backgroundColor: skill.checked ? '#f0f9ff' : '#f8fafc',
                                    borderRadius: '8px',
                                    border: skill.checked ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                  }}>
                                    <h4 style={{
                                      fontSize: '16px',
                                      fontWeight: '600',
                                      margin: '0 0 8px 0',
                                      color: '#1e293b'
                                    }}>
                                      {skill.category}
                                    </h4>
                                    <div style={{
                                      display: 'flex',
                                      flexWrap: 'wrap',
                                      gap: '8px'
                                    }}>
                                      {skill.skills.map((skillItem, index) => (
                                        <span
                                          key={index}
                                          style={{
                                            backgroundColor: '#e2e8f0',
                                            color: '#475569',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '14px',
                                            fontWeight: '500'
                                          }}
                                        >
                                          {skillItem}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {section.volunteerItems && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {section.volunteerItems.map((vol) => (
                              <div 
                                key={vol.id} 
                                style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '12px',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  borderRadius: '8px',
                                }}
                                onClick={() => handleVolunteerClick(section.id, vol.id)}
                              >
                                <div style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  minWidth: '20px'
                                }}>
                                  <Checkbox
                                    id={vol.id}
                                    checked={vol.checked}
                                    onCheckedChange={() => handleVolunteerToggle(section.id, vol.id)}
                                  />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{
                                    padding: '16px',
                                    backgroundColor: vol.checked ? '#f0f9ff' : '#f8fafc',
                                    borderRadius: '8px',
                                    border: vol.checked ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                  }}>
                                    <div style={{
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      justifyContent: 'space-between',
                                      marginBottom: '8px'
                                    }}>
                                      <div>
                                        <h4 style={{
                                          fontSize: '16px',
                                          fontWeight: '600',
                                          margin: '0 0 4px 0',
                                          color: '#1e293b'
                                        }}>
                                          {vol.organization}
                                        </h4>
                                        <p style={{
                                          fontSize: '14px',
                                          color: '#64748b',
                                          margin: '0 0 4px 0'
                                        }}>
                                          {vol.role}
                                        </p>
                                        {vol.description && (
                                          <p style={{
                                            fontSize: '14px',
                                            color: '#64748b',
                                            margin: 0,
                                            fontStyle: 'italic'
                                          }}>
                                            {vol.description}
                                          </p>
                                        )}
                                      </div>
                                      <span style={{
                                        fontSize: '14px',
                                        color: '#64748b',
                                        whiteSpace: 'nowrap',
                                        marginLeft: '16px'
                                      }}>
                                        {vol.startDate} - {vol.endDate}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {section.items && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {section.items.map((item) => (
                              <div 
                                key={item.id} 
                                style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '12px',
                                  cursor: 'pointer',
                                  padding: '8px',
                                  borderRadius: '6px',
                                }}
                                onClick={() => handleItemClick(section.id, item.id)}
                              >
                                <div style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  minWidth: '20px'
                                }}>
                                  <Checkbox
                                    id={item.id}
                                    checked={item.checked}
                                    onCheckedChange={() => handleItemToggle(section.id, item.id)}
                                  />
                                </div>
                                <div style={{
                                  color: item.checked ? '#1e40af' : '#374151',
                                  fontSize: '14px',
                                  lineHeight: '1.5',
                                  fontWeight: item.checked ? '600' : '400'
                                }}>
                                  {item.text}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}