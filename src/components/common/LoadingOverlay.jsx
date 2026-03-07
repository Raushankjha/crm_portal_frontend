function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15,23,42,0.65)',
        borderRadius: 16,
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#e5e7eb' }}>
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: '9999px',
            border: '2px solid rgba(148,163,184,0.6)',
            borderTopColor: '#22c55e',
            animation: 'spin 0.7s linear infinite',
          }}
        />
        <span style={{ fontSize: '0.9rem' }}>{message}</span>
      </div>
    </div>
  )
}

export default LoadingOverlay

