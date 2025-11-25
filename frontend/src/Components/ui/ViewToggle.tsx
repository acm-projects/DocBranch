import { Grid, List } from 'lucide-react';

interface ViewToggleProps {
  isListView: boolean;
  onToggle: (isList: boolean) => void;
}

export function ViewToggle({ isListView, onToggle }: ViewToggleProps) {
  return (
    <div style={{
      display: 'flex',
      gap: '4px',
      backgroundColor: '#f8fafc',
      padding: '6px',
      borderRadius: '10px',
      border: '1px solid #e2e8f0'
    }}>
      <button
        onClick={() => onToggle(false)}
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: !isListView ? 'white' : 'transparent',
          color: !isListView ? '#1e293b' : '#64748b',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: !isListView ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
          transition: 'all 0.2s ease-in-out'
        }}
      >
        <Grid size={16} />
        Grid
      </button>
      <button
        onClick={() => onToggle(true)}
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: isListView ? 'white' : 'transparent',
          color: isListView ? '#1e293b' : '#64748b',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: isListView ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
          transition: 'all 0.2s ease-in-out'
        }}
      >
        <List size={16} />
        List
      </button>
    </div>
  );
}