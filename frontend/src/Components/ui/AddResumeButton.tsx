import { Plus } from 'lucide-react';

interface AddResumeButtonProps {
  onClick: () => void;
}

export function AddResumeButton({ onClick }: AddResumeButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.2s ease-in-out',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
      }}
    >
      <Plus size={18} />
      Add New Resume
    </button>
  );
}