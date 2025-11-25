import { Template } from '../../types/template';

interface TemplateCardProps {
  template: Template;
  onClick: (id: number) => void;
}

export function TemplateCard({ template, onClick }: TemplateCardProps) {
  return (
    <div
      style={{
        border: '2px solid #f1f5f9',
        borderRadius: '12px', 
        backgroundColor: 'white',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', 
        width: '220px', 
        height: '200px', 
        margin: '0 auto' 
      }}
      onClick={() => onClick(template.id)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
        e.currentTarget.style.borderColor = '#3b82f6';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
        e.currentTarget.style.borderColor = '#f1f5f9';
      }}
    >
      <div style={{
        height: '80px', 
        backgroundColor: '#eff6ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px' 
      }}>
        {template.thumbnail}
      </div>
      <div style={{ 
        padding: '12px',
        height: 'calc(200px - 80px)', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{
            fontSize: '14px', 
            fontWeight: '700',
            color: '#1e293b',
            margin: '0 0 6px 0', 
            lineHeight: '1.2'
          }}>
            {template.name}
          </h3>
          <p style={{
            fontSize: '11px', //  smaller description 
            color: '#64748b',
            margin: 0,
            lineHeight: '1.3',
            display: '-webkit-box',
            WebkitLineClamp: 2, // Limit to 2 lines
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {template.description}
          </p>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '8px'
        }}>
          <span style={{
            padding: '2px 8px', 
            backgroundColor: '#eff6ff',
            color: '#3b82f6',
            fontSize: '6px', 
            fontWeight: '600',
            borderRadius: '12px'
          }}>
            {template.category}
          </span>
          <span style={{
            fontSize: '10px', 
            color: '#94a3b8',
            fontWeight: '500'
          }}>
            {template.lastEdited}
          </span>
        </div>
      </div>
    </div>
  );
}