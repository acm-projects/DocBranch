import { useState } from 'react';
import { Resume } from './types/template';
import { 
  ResumesSection
} from './Components';
import Sidebar from "./Sidebar";

function TemplatePage() {
  const [collapsed, setCollapsed] = useState(false);
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
    <div style={{ display: 'flex' }}>

      {/* Sidebar added here */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      {/* Main Content Area */}
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      flex: 1
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Custom Header with a Branch Dropdown */}
        <div style={{ 
          marginBottom: '32px', 
          textAlign: 'left',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '8px',
            flexWrap: 'wrap'
          }}>
            <select
              value={selectedBranch}
              onChange={handleBranchChange}
              style={{
                padding: '12px 48px 12px 16px',
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                backgroundColor: 'white',
                fontSize: '20px',
                fontWeight: '700',
                color: '#1e293b',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.2s ease',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 16px center',
                backgroundSize: '20px',
                minWidth: '240px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLSelectElement;
                target.style.borderColor = '#cbd5e1';
                target.style.backgroundColor = '#f8fafc';
                target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLSelectElement;
                target.style.borderColor = '#e2e8f0';
                target.style.backgroundColor = 'white';
                target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
              }}
              onFocus={(e) => {
                const target = e.target as HTMLSelectElement;
                target.style.borderColor = '#3b82f6';
                target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 6px rgba(0, 0, 0, 0.07)';
              }}
              onBlur={(e) => {
                const target = e.target as HTMLSelectElement;
                target.style.borderColor = '#e2e8f0';
                target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
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
            margin: '8px 0 0 0',
            fontSize: '16px',
            fontWeight: '500',
            paddingLeft: '4px'
          }}>
            Browse and manage your resumes - Select a branch to switch between different versions
          </p>
        </div>

        {/* <BackToHome /> */}

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
    </div>
  );
}

export default TemplatePage;