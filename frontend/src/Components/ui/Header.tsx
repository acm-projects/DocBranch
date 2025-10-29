export function Header() {
  return (
    <div style={{ 
      marginBottom: '32px', 
      textAlign: 'center',
    }}>
      <h1 style={{ 
        fontSize: '28px', 
        fontWeight: '800', 
        margin: '0 0 12px 0',
        color: '#1e293b',
        letterSpacing: '-0.02em'
      }}>
        Resume Templates
      </h1>
      <p style={{ 
        color: '#64748b', 
        margin: 0,
        fontSize: '16px',
        fontWeight: '500'
      }}>
        Browse templates or create your own resume - Drag sections to reorder
      </p>
    </div>
  );
}