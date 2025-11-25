import { Resume } from '../../types/template';

interface ResumeListItemProps {
  resume: Resume;
  onClick: (id: string) => void;
  isLast: boolean;
}

export function ResumeListItem({ resume, onClick, isLast }: ResumeListItemProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px 20px',
        cursor: 'pointer',
        backgroundColor: 'white',
        transition: 'all 0.2s ease-in-out',
        borderBottom: !isLast ? '1px solid #f1f5f9' : 'none',
        minHeight: '70px'
      }}
      onClick={() => onClick(resume.id)}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f8fafc';
        e.currentTarget.style.transform = 'translateX(4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'white';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      <div style={{
        width: '50px',
        height: '50px',
        backgroundColor: '#ecfdf5',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        flexShrink: 0
      }}>
        {resume.thumbnail}
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{
          fontSize: '15px',
          fontWeight: '600',
          color: '#1e293b',
          margin: '0 0 2px 0'
        }}>
          {resume.name}
        </h4>
        <p style={{
          fontSize: '13px',
          color: '#64748b',
          margin: 0
        }}>
          {resume.description}
        </p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <span style={{
          display: 'inline-block',
          padding: '3px 10px',
          backgroundColor: '#ecfdf5',
          color: '#059669',
          fontSize: '11px',
          fontWeight: '600',
          borderRadius: '16px'
        }}>
          {resume.category}
        </span>
        <p style={{
          fontSize: '11px',
          color: '#94a3b8',
          margin: '3px 0 0 0'
        }}>
          {resume.lastEdited}
        </p>
      </div>
    </div>
  );
}