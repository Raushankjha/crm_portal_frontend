function FormField({ label, name, type = 'text', value, onChange, error, children, ...rest }) {
  const isCustom = Boolean(children)

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label
        htmlFor={name}
        style={{
          display: 'block',
          marginBottom: '0.35rem',
          fontSize: '0.85rem',
          fontWeight: 500,
          color: '#e5e7eb',
        }}
      >
        {label}
      </label>
      {isCustom ? (
        children
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          {...rest}
          style={{
            width: '100%',
            padding: '0.55rem 0.75rem',
            borderRadius: 10,
            border: '1px solid rgba(148,163,184,0.5)',
            // background: 'rgba(15,23,42,0.85)',
            color: '#e5e7eb',
            fontSize: '0.9rem',
          }}
        />
      )}
      {error && (
        <div style={{ marginTop: '0.25rem', fontSize: '0.8rem', color: '#f97373' }}>
          {error}
        </div>
      )}
    </div>
  )
}

export default FormField

