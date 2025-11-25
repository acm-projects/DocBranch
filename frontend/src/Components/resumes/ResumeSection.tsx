import { Resume } from '../../types/template';
import { ResumeCard } from './ResumeCard';
import { ResumeListItem } from './ResumeListItem';
import { ViewToggle } from '../ui/ViewToggle';
import { AddResumeButton } from '../ui/AddResumeButton';

interface ResumesSectionProps {
  resumes: Resume[];
  isListView: boolean;
  onResumeClick: (id: string) => void;
  onAddResume: () => void;
  onViewToggle: (isList: boolean) => void;
}

export function ResumesSection({ resumes, isListView, onResumeClick, onAddResume, onViewToggle }: ResumesSectionProps) {
  if (resumes.length === 0) {
    return (
      <div style={{
        border: '2px solid #f1f5f9',
        borderRadius: '16px',
        backgroundColor: 'white',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        marginBottom: '24px'
      }}>
        <div style={{
          padding: '20px 24px',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #f1f5f9',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            margin: 0,
            color: '#1e293b',
            letterSpacing: '-0.02em'
          }}>
            My Resumes
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <AddResumeButton onClick={onAddResume} />
            <ViewToggle isListView={isListView} onToggle={onViewToggle} />
          </div>
        </div>
        <div style={{ padding: '24px' }}>
          <div style={{
            textAlign: 'center',
            padding: '48px 24px',
            border: '2px dashed #cbd5e1',
            borderRadius: '12px',
            backgroundColor: '#f8fafc'
          }}>
            <p style={{
              color: '#64748b',
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '500'
            }}>
              You haven't created any resumes yet
            </p>
            <button
              onClick={onAddResume}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s ease-in-out',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
              }}
            >
              Create Your First Resume
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      border: '2px solid #f1f5f9',
      borderRadius: '16px',
      backgroundColor: 'white',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      marginBottom: '24px'
    }}>
      <div style={{
        padding: '20px 24px',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #f1f5f9',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          margin: 0,
          color: '#1e293b',
          letterSpacing: '-0.02em'
        }}>
          My Resumes
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <AddResumeButton onClick={onAddResume} />
          <ViewToggle isListView={isListView} onToggle={onViewToggle} />
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {isListView ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #f1f5f9'
          }}>
            {resumes.map((resume, index) => (
              <ResumeListItem
                key={resume.id}
                resume={resume}
                onClick={onResumeClick}
                isLast={index === resumes.length - 1}
              />
            ))}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {resumes.map(resume => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onClick={onResumeClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}