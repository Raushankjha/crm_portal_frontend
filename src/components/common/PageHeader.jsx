function PageHeader({ title, subtitle, actions }) {
  return (
    <div
      style={{
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}
    >
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions ? <div style={{ display: 'flex', gap: '0.5rem' }}>{actions}</div> : null}
    </div>
  )
}

export default PageHeader

