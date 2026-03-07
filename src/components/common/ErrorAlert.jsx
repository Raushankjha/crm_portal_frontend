function ErrorAlert({ message }) {
  if (!message) return null

  return (
    <div
      style={{
        marginBottom: '0.75rem',
        padding: '0.6rem 0.8rem',
        borderRadius: 10,
        border: '1px solid rgba(248,113,113,0.6)',
        background: 'rgba(248,113,113,0.08)',
        fontSize: '0.85rem',
        color: '#fecaca',
      }}
    >
      {message}
    </div>
  )
}

export default ErrorAlert

