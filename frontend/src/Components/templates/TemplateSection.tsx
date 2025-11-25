import { Template } from '../../types/template';
import { TemplateCard } from './TemplateCard';

interface TemplatesSectionProps {
  templates: Template[];
  onTemplateClick: (id: number) => void;
}

export function TemplatesSection({ templates, onTemplateClick }: TemplatesSectionProps) {
  return (
    <div style={{
      border: '2px solid #f1f5f9',
      borderRadius: '16px',
      backgroundColor: 'white',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      marginBottom: '32px',
      width: '100%'
    }}>
      <div style={{
        padding: '16px 24px',
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
      </div>

      <div style={{ padding: '20px' }}> {/* Slightly less padding */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '16px', 
          width: '100%',
          justifyContent: 'center' 
        }}>
          {templates.map(template => (
            <TemplateCard 
              key={template.id} 
              template={template} 
              onClick={onTemplateClick} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}