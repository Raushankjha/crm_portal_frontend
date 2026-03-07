function EmptyState({ title = 'No data found', description }) {
  return (
    <div
      style={{
        padding: '2rem',
        textAlign: 'center',
        color: '#9ca3af',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          margin: '0 auto 0.75rem',
          border: '1px dashed rgba(148,163,184,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem',
        }}
      >
        ⓘ
      </div>
      <div style={{ fontWeight: 500, marginBottom: '0.25rem', color: '#e5e7eb' }}>{title}</div>
      {description && <div style={{ fontSize: '0.85rem' }}>{description}</div>}
    </div>
  )
}

export default EmptyState

