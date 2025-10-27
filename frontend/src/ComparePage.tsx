import React from 'react';
import { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { ResumeEditor } from './Components/ResumeEditor';

const ComparePage = () => {
  const [activeTab, setActiveTab] = useState('comments');
  const [resumes] = useState([
    { id: 1, name: 'Kida_Khanooni' },
    { id: 2, name: 'Kida_Khanooni' }
  ]);
  const [commentBoxHeight, setCommentBoxHeight] = useState(150);
  const [leftWidth, setLeftWidth] = useState(15);
  const [middleLeftWidth, setMiddleLeftWidth] = useState(50);
  const [rightWidth, setRightWidth] = useState(15);
  const [rightTab, setRightTab] = useState('ai-insights');

  const handleCommentResize = (e: { preventDefault: () => void; clientY: any; }) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = commentBoxHeight;

    const handleMouseMove = (moveEvent: { clientY: number; }) => {
      const deltaY = -moveEvent.clientY + startY;
      const newHeight = Math.max(0, Math.min(startHeight + deltaY, 400));
      setCommentBoxHeight(newHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleLeftResize = (e: { preventDefault: () => void; clientX: any; }) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftWidth;

    const handleMouseMove = (moveEvent: { clientX: number; }) => {
      const containerWidth = window.innerWidth - 48;
      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / containerWidth) * 100;
      const newWidth = Math.max(10, Math.min(startWidth + deltaPercent, 40));
      setLeftWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMiddleResize = (e: { preventDefault: () => void; clientX: any; }) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = middleLeftWidth;

    const handleMouseMove = (moveEvent: { clientX: number; }) => {
      const containerWidth = window.innerWidth - 48;
      const middleTotal = 100 - leftWidth - rightWidth;
      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / containerWidth) * 100;
      const newWidth = Math.max(30, Math.min(startWidth + (deltaPercent / middleTotal) * 100, 70));
      setMiddleLeftWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleRightResize = (e: { preventDefault: () => void; clientX: any; }) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = rightWidth;

    const handleMouseMove = (moveEvent: { clientX: number; }) => {
      const containerWidth = window.innerWidth - 48;
      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / containerWidth) * 100;
      const newWidth = Math.max(10, Math.min(startWidth - deltaPercent, 40));
      setRightWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const middleTotal = 100 - leftWidth - rightWidth;

  return (
    <div
      style={{
        height: '100vh',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        gap: '0.5rem',
        padding: '1.5rem',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {/* Left Navigation */}
      <div
        style={{
          width: `${leftWidth}%`,
          backgroundColor: 'white',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '1rem',
          minWidth: '150px',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        <div style={{ marginBottom: '2rem', flexShrink: 0 }}>
          <div
            style={{
              width: '2rem',
              height: '2rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              cursor: 'pointer'
            }}
          >
            <div
              style={{
                width: '1.25rem',
                height: '0.125rem',
                backgroundColor: '#374151',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: '1.25rem',
                  height: '0.125rem',
                  backgroundColor: '#374151',
                  position: 'absolute',
                  top: '-0.375rem'
                }}
              ></div>
              <div
                style={{
                  width: '1.25rem',
                  height: '0.125rem',
                  backgroundColor: '#374151',
                  position: 'absolute',
                  top: '0.375rem'
                }}
              ></div>
            </div>
          </div>

          <h2
            style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '1rem'
            }}
          >
            Recent Resumes
          </h2>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            flex: 1,
            overflowY: 'auto'
          }}
        >
          {resumes.map((resume) => (
            <div
              key={resume.id}
              style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                backgroundColor: '#f3f4f6'
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#e5e7eb')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = '#f3f4f6')
              }
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.25rem'
                }}
              >
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#111827',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {resume.name}
                </span>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>...</div>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                2 days ago
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resize Handle 1 */}
      <div
        style={{
          width: '8px',
          cursor: 'ew-resize',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
        onMouseDown={handleLeftResize}
      >
        <div
          style={{
            width: '3px',
            height: '40px',
            backgroundColor: '#d1d5db',
            borderRadius: '2px'
          }}
        ></div>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          width: `${middleTotal}%`,
          display: 'flex',
          gap: '0.5rem',
          minWidth: 0,
          overflow: 'hidden'
        }}
      >
        {/* Current Resume Panel */}
        { <div
          style={{
            width: `${middleLeftWidth}%`,
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            border: '2px solid #34d399',
            display: 'flex',
            flexDirection: 'column',
            minWidth: '250px',
            boxSizing: 'border-box',
            overflow: 'hidden'
          }}
        >
          <h3
            style={{
              textAlign: 'center',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '1rem',
              flexShrink: 0
            }}
          >
            Current Resume
          </h3>

          <div
            style={{
              flex: 1,
              backgroundColor: '#f9fafb',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              overflowY: 'auto',
              minHeight: 0
            }}
          ></div>

          <div
            style={{
              borderTop: '1px solid #e5e7eb',
              height: '8px',
              cursor: 'ns-resize',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.5rem',
              flexShrink: 0
            }}
            onMouseDown={handleCommentResize}
          >
            <div
              style={{
                width: '40px',
                height: '3px',
                backgroundColor: '#d1d5db',
                borderRadius: '2px'
              }}
            ></div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              flexShrink: 0
            }}
          >
            <button
              onClick={() => setActiveTab('comments')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: activeTab === 'comments' ? '1.25rem' : '0.375rem',
                fontSize: '0.8125rem',
                fontWeight: '500',
                backgroundColor:
                  activeTab === 'comments' ? '#10b981' : 'transparent',
                color: activeTab === 'comments' ? 'white' : '#6b7280',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Comments
            </button>
            <button
              onClick={() => setActiveTab('job-description')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius:
                  activeTab === 'job-description' ? '1.25rem' : '0.375rem',
                fontSize: '0.8125rem',
                fontWeight: '500',
                backgroundColor:
                  activeTab === 'job-description' ? '#10b981' : 'transparent',
                color: activeTab === 'job-description' ? 'white' : '#6b7280',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Job Description
            </button>
          </div>

          <div className='hide-scrollbar'
            style={{
              backgroundColor: '#f9fafb',
              borderRadius: '0.5rem',
              padding: '1rem',
              height: `${commentBoxHeight}px`,
              overflowY: 'auto',
              minHeight: 0,
              flexShrink: 0,
              display: commentBoxHeight === 0 ? 'none' : 'block'
            }}
          >
            {activeTab === 'comments' && <div className='hide-scrollbar'>Comments section</div>}
            {activeTab === 'job-description' && <div className='hide-scrollbar'>Job Description</div>}
          </div>
        </div> }

        {/* Resize Handle 2 */}
        { <div
          style={{
            width: '8px',
            cursor: 'ew-resize',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
          onMouseDown={handleMiddleResize}
        >
          <div
            style={{
              width: '3px',
              height: '40px',
              backgroundColor: '#d1d5db',
              borderRadius: '2px'
            }}
          ></div>
        </div> }

        {/* Generated Resume Panel */}
        <div className='hide-scrollbar'
          style={{
            flex: 1,
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            border: '2px solid #34d399',
            display: 'flex',
            flexDirection: 'column',
            minWidth: '250px',
            boxSizing: 'border-box',
            overflow: 'hidden'
          }}
        >
          //resumeEditor goes here 
          <ResumeEditor></ResumeEditor>
        </div>
      </div>

      {/* Resize Handle 3 */}
      <div
        style={{
          width: '8px',
          cursor: 'ew-resize',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
        onMouseDown={handleRightResize}
      >
        <div
          style={{
            width: '3px',
            height: '40px',
            backgroundColor: '#d1d5db',
            borderRadius: '2px'
          }}
        ></div>
      </div>

      {/* AI Insights Sidebar */}
      <div
        style={{
          width: `${rightWidth}%`,
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '1.5rem',
          minWidth: '150px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            flexShrink: 0
          }}
        >
          <button
            onClick={() => setRightTab('ai-insights')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: rightTab === 'ai-insights' ? '1.25rem' : '0.375rem',
              fontSize: '0.8125rem',
              fontWeight: '500',
              backgroundColor:
                rightTab === 'ai-insights' ? '#10b981' : 'transparent',
              color: rightTab === 'ai-insights' ? 'white' : '#6b7280',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem'
            }}
          >
            <Lightbulb
              style={{
                width: '1rem',
                height: '1rem',
                flexShrink: 0
              }}
            />
            AI Insights
          </button>
          <button
            onClick={() => setRightTab('job-description')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius:
                rightTab === 'job-description' ? '1.25rem' : '0.375rem',
              fontSize: '0.8125rem',
              fontWeight: '500',
              backgroundColor:
                rightTab === 'job-description' ? '#10b981' : 'transparent',
              color: rightTab === 'job-description' ? 'white' : '#6b7280',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Job Description
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            minHeight: 0
          }}
        >
          {rightTab === 'ai-insights' && (
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                AI-generated insights will appear here based on your resume and job description.
              </p>
            </div>
          )}
          {rightTab === 'job-description' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center' }}>
                Add a job description to get AI-powered insights and recommendations.
              </p>
              <button
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '0.625rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Add Job Description
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparePage;