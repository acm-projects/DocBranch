import { useState, useRef, useEffect } from 'react';
import { FileText, Lightbulb } from 'lucide-react';

const ComparePage = () => {
  const [activeTab, setActiveTab] = useState('comments');
  const [resumes] = useState([
    { id: 1, name: 'Kida_Khanooni' },
    { id: 2, name: 'Kida_Khanooni' }
  ]);

  const [leftNavWidth, setLeftNavWidth] = useState(250);
  const [currentResumeWidth, setCurrentResumeWidth] = useState(400);
  const [generatedResumeWidth, setGeneratedResumeWidth] = useState(400);
  const [aiInsightsWidth, setAiInsightsWidth] = useState(240);
  const [commentBoxHeight, setCommentBoxHeight] = useState(150);
  const [isDragging, setIsDragging] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();

      if (isDragging === 'left-nav') {
        const newWidth = e.clientX - containerRect.left;
        if (newWidth >= 200 && newWidth <= 400) {
          setLeftNavWidth(newWidth);
        }
      } else if (isDragging === 'current-resume') {
        const leftOffset = containerRect.left + leftNavWidth;
        const newWidth = e.clientX - leftOffset;
        if (newWidth >= 300 && newWidth <= 600) {
          setCurrentResumeWidth(newWidth);
        }
      } else if (isDragging === 'generated-resume') {
        //const leftOffset = containerRect.left + leftNavWidth + currentResumeWidth;
        const leftOffset = containerRect.left + leftNavWidth + aiInsightsWidth;
        const newWidth = e.clientX - leftOffset;
        if (newWidth >= 300 && newWidth <= 600) {
          setGeneratedResumeWidth(newWidth);
        }
      } else if (isDragging === 'ai-insights') {
        const newWidth = containerRect.right - e.clientX;
        if (newWidth >= 200 && newWidth <= 400) {
          setAiInsightsWidth(newWidth);
        }
      } else if (isDragging === 'comment-box') {
        const currentResumePanel = document.getElementById('current-resume-panel');
        if (currentResumePanel) {
          const panelRect = currentResumePanel.getBoundingClientRect();
          const resumeDisplayHeight = document.getElementById('resume-display')?.offsetHeight || 0;
          const dividerHeight = 17;
          const buttonsHeight = 47;
          const availableHeight = panelRect.height - resumeDisplayHeight - dividerHeight - buttonsHeight - 48;
          
          const mouseYRelativeToButtons = e.clientY - (panelRect.top + resumeDisplayHeight + dividerHeight + buttonsHeight + 24);
          const newHeight = Math.max(100, Math.min(mouseYRelativeToButtons, availableHeight));
          setCommentBoxHeight(newHeight);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(null);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, leftNavWidth, currentResumeWidth, generatedResumeWidth]);

  const ResizeHandle = ({ direction, onMouseDown }: { direction: string; onMouseDown: () => void }) => (
    <div
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown();
      }}
      style={{
        position: 'absolute',
        [direction === 'vertical' ? 'right' : 'bottom']: 0,
        [direction === 'vertical' ? 'top' : 'left']: 0,
        [direction === 'vertical' ? 'width' : 'height']: '4px',
        [direction === 'vertical' ? 'height' : 'width']: '100%',
        cursor: direction === 'vertical' ? 'ew-resize' : 'ns-resize',
        zIndex: 10,
        backgroundColor: 'transparent',
        transition: 'background-color 0.2s'
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.3)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    />
  );

  return (
    <div style={{ 
      height: '100vh', 
      backgroundColor: '#f3f4f6',
      display: 'flex',
      overflow: 'hidden'
    }} ref={containerRef}>
      {/* Left Navigation Sidebar */}
      <div style={{
        width: `${leftNavWidth}px`,
        backgroundColor: 'white',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #e5e7eb',
        flexShrink: 0,
        position: 'relative'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            cursor: 'pointer'
          }}>
            <div style={{ 
              width: '1.25rem', 
              height: '0.125rem', 
              backgroundColor: '#374151',
              position: 'relative'
            }}>
              <div style={{ 
                width: '1.25rem', 
                height: '0.125rem', 
                backgroundColor: '#374151',
                position: 'absolute',
                top: '-0.375rem'
              }}></div>
              <div style={{ 
                width: '1.25rem', 
                height: '0.125rem', 
                backgroundColor: '#374151',
                position: 'absolute',
                top: '0.375rem'
              }}></div>
            </div>
          </div>
          
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
            Recent Resumes
          </h2>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflowY: 'auto' }}>
          {resumes.map((resume) => (
            <div
              key={resume.id}
              style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                backgroundColor: '#f3f4f6'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{resume.name}</span>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>...</div>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>2 days ago</div>
            </div>
          ))}
        </div>
        <ResizeHandle direction="vertical" onMouseDown={() => setIsDragging('left-nav')} />
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        padding: '1.5rem',
        display: 'flex',
        gap: '1.5rem',
        overflow: 'hidden'
      }}>
        {/* Current Resume Panel */}
        <div id="current-resume-panel" style={{
          width: `${currentResumeWidth}px`,
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '1.5rem',
          border: '2px solid #34d399',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minHeight: 0,
          position: 'relative',
          flexShrink: 0
        }}>
          <h3 style={{ textAlign: 'center', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '1rem' }}>
            Current Resume
          </h3>
          
          <div id="resume-display" style={{ 
            flex: 1, 
            backgroundColor: '#f9fafb', 
            borderRadius: '0.5rem', 
            marginBottom: '1rem',
            overflowY: 'auto'
          }}></div>
          
          <div style={{ borderTop: '1px solid #e5e7eb', marginBottom: '1rem' }}></div>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => setActiveTab('comments')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: activeTab === 'comments' ? '1.25rem' : '0.375rem',
                fontSize: '0.8125rem',
                fontWeight: '500',
                backgroundColor: activeTab === 'comments' ? '#10b981' : 'transparent',
                color: activeTab === 'comments' ? 'white' : '#6b7280',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'comments') e.currentTarget.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'comments') e.currentTarget.style.color = '#6b7280';
              }}
            >
              Comments
            </button>
            <button
              onClick={() => setActiveTab('job-description')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: activeTab === 'job-description' ? '1.25rem' : '0.375rem',
                fontSize: '0.8125rem',
                fontWeight: '500',
                backgroundColor: activeTab === 'job-description' ? '#10b981' : 'transparent',
                color: activeTab === 'job-description' ? 'white' : '#6b7280',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'job-description') e.currentTarget.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'job-description') e.currentTarget.style.color = '#6b7280';
              }}
            >
              Job Description
            </button>
          </div>

          <div style={{ 
            backgroundColor: '#f9fafb', 
            borderRadius: '0.5rem',
            padding: '1rem',
            height: `${commentBoxHeight}px`,
            overflowY: 'auto',
            position: 'relative'
          }}>
            {activeTab === 'comments' && (
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                <p>Comments section - Add your feedback and notes here.</p>
              </div>
            )}
            {activeTab === 'job-description' && (
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                <p>Job Description - Paste or type the job description here.</p>
              </div>
            )}
            <ResizeHandle direction="horizontal" onMouseDown={() => setIsDragging('comment-box')} />
          </div>
          <ResizeHandle direction="vertical" onMouseDown={() => setIsDragging('current-resume')} />
        </div>

        {/* Generated Resume Panel */}
        <div style={{
          width: `${generatedResumeWidth}px`,
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '1.5rem',
          border: '2px solid #34d399',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minHeight: 0,
          position: 'relative',
          flexShrink: 0
        }}>
          <h3 style={{ textAlign: 'center', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '1rem' }}>
            Generated Resume
          </h3>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto' }}>
            {['Education', 'Skills', 'Professional Experience', 'Organizations', 'Awards & Honors'].map((section) => (
              <div key={section} style={{ backgroundColor: '#f3f4f6', borderRadius: '0.5rem', padding: '1rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.75rem' }}>
                  {section}
                </h4>
                <div style={{ backgroundColor: 'white', borderRadius: '0.375rem', height: '4rem' }}></div>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
            >
              Preview
            </button>
          </div>
          <ResizeHandle direction="vertical" onMouseDown={() => setIsDragging('generated-resume')} />
        </div>

        {/* AI Insights Sidebar */}
        <div style={{
          width: `${aiInsightsWidth}px`,
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '1.5rem',
          position: 'relative',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lightbulb style={{ width: '1.25rem', height: '1.25rem', color: '#10b981' }} />
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>AI Insights</h2>
          </div>
          <ResizeHandle direction="vertical" onMouseDown={() => setIsDragging('ai-insights')} />
        </div>
      </div>
    </div>
  );
};

export default ComparePage;