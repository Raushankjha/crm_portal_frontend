const STATUS_COLORS = {
  new: '#38bdf8',
  contacted: '#a855f7',
  qualified: '#22c55e',
  won: '#16a34a',
  lost: '#ef4444',
}

function StatusBadge({ status }) {
  if (!status) return null
  const normalized = String(status).toLowerCase()
  const color = STATUS_COLORS[normalized] || '#9ca3af'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.15rem 0.55rem',
        borderRadius: 9999,
        fontSize: '0.75rem',
        fontWeight: 500,
        backgroundColor: 'rgba(15,23,42,0.9)',
        border: `1px solid ${color}`,
        color,
        textTransform: 'capitalize',
      }}
    >
      {normalized}
    </span>
  )
}

export default StatusBadge

