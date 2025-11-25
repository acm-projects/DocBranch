import { Link } from 'react-router-dom';

export function BackToHome() {
  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <Link 
        to="/" 
        style={{
          color: '#3b82f6',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '600',
          transition: 'color 0.2s ease-in-out'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#2563eb';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#3b82f6';
        }}
      >
        ← Go back to Home Page
      </Link>
    </div>
  );
}