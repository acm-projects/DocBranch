import { Resume } from '../../types/template';

interface ResumeCardProps {
  resume: Resume;
  onClick: (id: string) => void;
}

export function ResumeCard({ resume, onClick }: ResumeCardProps) {
  return (
    <div
      style={{
        border: '2px solid #f1f5f9',
        borderRadius: '16px',
        backgroundColor: 'white',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)'
      }}
      onClick={() => onClick(resume.id)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12)';
        e.currentTarget.style.borderColor = '#3b82f6';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.06)';
        e.currentTarget.style.borderColor = '#f1f5f9';
      }}
    >
      <div style={{
        height: '120px',
        backgroundColor: '#ecfdf5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px'
      }}>
        {resume.thumbnail}
      </div>
      <div style={{ padding: '20px' }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '700',
          color: '#1e293b',
          margin: '0 0 8px 0'
        }}>
          {resume.name}
        </h3>
        <p style={{
          fontSize: '14px',
          color: '#64748b',
          margin: '0 0 12px 0',
          lineHeight: '1.4'
        }}>
          {resume.description}
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            padding: '4px 12px',
            backgroundColor: '#ecfdf5',
            color: '#059669',
            fontSize: '12px',
            fontWeight: '600',
            borderRadius: '20px'
          }}>
            {resume.category}
          </span>
          <span style={{
            fontSize: '12px',
            color: '#94a3b8',
            fontWeight: '500'
          }}>
            {resume.lastEdited}
          </span>
        </div>
      </div>
    </div>
  );
}