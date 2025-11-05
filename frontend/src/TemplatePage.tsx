import { useState } from 'react';
import { Template, Resume } from './types/template';
import { 
  TemplatesSection, 
  ResumesSection, 
  Header, 
  BackToHome 
} from './Components';

function TemplatePage() {
  const [isListView, setIsListView] = useState(false);
  
  const [systemTemplates] = useState<Template[]>([
    { 
      id: 1, 
      name: 'Modern Professional', 
      thumbnail: '', 
      category: 'Professional',
      description: 'Clean Design for Corporate Roles',
      lastEdited: '2024-01-15'
    },
    { 
      id: 2, 
      name: 'Creative', 
      thumbnail: '', 
      category: 'Creative',
      description: 'Creative Outline for Design Positions',
      lastEdited: '2024-01-10'
    },
    { 
      id: 3, 
      name: 'Minimalist', 
      thumbnail: '', 
      category: 'Minimal',
      description: 'Minimal format and a sleek visual',
      lastEdited: '2024-01-08'
    },
    { 
      id: 4, 
      name: 'Executive', 
      thumbnail: '', 
      category: 'Professional',
      description: 'Executive resume template',
      lastEdited: '2024-10-10'
    },
  ]);

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

  const handleTemplateClick = (templateId: number): void => {
    window.location.href = `/compare/template/${templateId}`;
  };

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
        <Header />

        <BackToHome />
        {/* Templates Section very top */}
        {/* 
        <TemplatesSection 
          templates={systemTemplates} 
          onTemplateClick={handleTemplateClick} 
        /> */}

        {/* Resumes Section below  */}
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