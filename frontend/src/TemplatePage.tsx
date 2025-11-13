// import { useState } from 'react';
// import { Template, Resume } from './types/template';
// import { 
//   TemplatesSection, 
//   ResumesSection, 
//   Header, 
//   BackToHome 
// } from './Components';

// function TemplatePage() {
//   const [isListView, setIsListView] = useState(false);
  
//   const [systemTemplates] = useState<Template[]>([
//     { 
//       id: 1, 
//       name: 'Modern Professional', 
//       thumbnail: '', 
//       category: 'Professional',
//       description: 'Clean Design for Corporate Roles',
//       lastEdited: '2024-01-15'
//     },
//     { 
//       id: 2, 
//       name: 'Creative', 
//       thumbnail: '', 
//       category: 'Creative',
//       description: 'Creative Outline for Design Positions',
//       lastEdited: '2024-01-10'
//     },
//     { 
//       id: 3, 
//       name: 'Minimalist', 
//       thumbnail: '', 
//       category: 'Minimal',
//       description: 'Minimal format and a sleek visual',
//       lastEdited: '2024-01-08'
//     },
//     { 
//       id: 4, 
//       name: 'Executive', 
//       thumbnail: '', 
//       category: 'Professional',
//       description: 'Executive resume template',
//       lastEdited: '2024-10-10'
//     },
//   ]);

//   const [userResumes, setUserResumes] = useState<Resume[]>([
//     {
//       id: 'resume-1',
//       name: 'Software Engineer Resume',
//       thumbnail: '',
//       category: 'Professional',
//       description: 'My technical resume for engineering roles',
//       lastEdited: '2024-01-18'
//     }
//   ]);

//   const handleTemplateClick = (templateId: number): void => {
//     window.location.href = `/compare/template/${templateId}`;
//   };

//   const handleResumeClick = (resumeId: string): void => {
//     window.location.href = `/compare/resume/${resumeId}`;
//   };

//   const handleAddResume = (): void => {
//     const newResume: Resume = {
//       id: `resume-${Date.now()}`,
//       name: `My Resume ${userResumes.length + 1}`,
//       thumbnail: '',
//       category: 'Draft',
//       description: 'New resume - click to edit',
//       lastEdited: new Date().toLocaleDateString()
//     };
//     setUserResumes([...userResumes, newResume]);
//   };

//   return (
//     <div style={{
//       minHeight: '100vh',
//       backgroundColor: '#f8fafc',
//       padding: '24px',
//       fontFamily: 'system-ui, -apple-system, sans-serif'
//     }}>
//       <div style={{
//         maxWidth: '1200px',
//         margin: '0 auto'
//       }}>
//         <Header />

//         <BackToHome />
//         {/* Templates Section very top */}
//         {/* 
//         <TemplatesSection 
//           templates={systemTemplates} 
//           onTemplateClick={handleTemplateClick} 
//         /> */}

//         {/* Resumes Section below  */}
//         <ResumesSection 
//           resumes={userResumes}
//           isListView={isListView}
//           onResumeClick={handleResumeClick}
//           onAddResume={handleAddResume}
//           onViewToggle={setIsListView}
//         />

//       </div>
//     </div>
//   );
// }

// export default TemplatePage;


import { useState } from 'react';
import { Resume } from './types/template';
import { 
  ResumesSection, 
  BackToHome 
} from './Components';

function TemplatePage() {
  const [isListView, setIsListView] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('Main Branch');
  
  const branches = [
    'Main Branch',
    'branch 1',
    'branch 2',
    'branch 3',
    'branch 4',
    'branch 5'
  ];

  const [userResumes, setUserResumes] = useState<Resume[]>([
    {
      id: 'resume-1',
      name: 'Software Engineer Resume',
      thumbnail: '',
      category: 'Professional',
      description: 'My technical resume for engineering roles',
      lastEdited: '2024-01-18'
    }
  ]);

  const handleResumeClick = (resumeId: string): void => {
    window.location.href = `/compare/resume/${resumeId}`;
  };

  const handleAddResume = (): void => {
    const newResume: Resume = {
      id: `resume-${Date.now()}`,
      name: `My Resume ${userResumes.length + 1}`,
      thumbnail: '',
      category: 'Draft',
      description: 'New resume - click to edit',
      lastEdited: new Date().toLocaleDateString()
    };
    setUserResumes([...userResumes, newResume]);
  };

  const handleBranchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBranch(event.target.value);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Custom Header with Branch Dropdown */}
        <div style={{ 
          marginBottom: '32px', 
          textAlign: 'left',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px'
          }}>
            <span style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#1e293b',
              letterSpacing: '-0.02em'
            }}>
              Branch:
            </span>
            <select
              value={selectedBranch}
              onChange={handleBranchChange}
              style={{
                padding: '8px 16px',
                paddingRight: '32px',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                backgroundColor: 'white',
                fontSize: '16px',
                fontWeight: '600',
                color: '#1e293b',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.2s ease',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
                backgroundSize: '16px',
                minWidth: '200px'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLSelectElement;
                target.style.borderColor = '#cbd5e1';
                target.style.backgroundColor = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLSelectElement;
                target.style.borderColor = '#e2e8f0';
                target.style.backgroundColor = 'white';
              }}
              onFocus={(e) => {
                const target = e.target as HTMLSelectElement;
                target.style.borderColor = '#3b82f6';
                target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                const target = e.target as HTMLSelectElement;
                target.style.borderColor = '#e2e8f0';
                target.style.boxShadow = 'none';
              }}
            >
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
          <p style={{ 
            color: '#64748b', 
            margin: 0,
            fontSize: '16px',
            fontWeight: '500'
          }}>
            Browse and manage your resumes - Click the dropdown to switch between branches
          </p>
        </div>

        <BackToHome />

        {/* Resumes Section */}
        <ResumesSection 
          resumes={userResumes}
          isListView={isListView}
          onResumeClick={handleResumeClick}
          onAddResume={handleAddResume}
          onViewToggle={setIsListView}
        />

      </div>
    </div>
  );
}

export default TemplatePage;