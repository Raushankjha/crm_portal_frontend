function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const handlePrev = () => {
    if (page > 1) onChange(page - 1)
  }

  const handleNext = () => {
    if (page < totalPages) onChange(page + 1)
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '1rem',
        fontSize: '0.85rem',
        color: '#9ca3af',
      }}
    >
      <div>
        Page {page} of {totalPages}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handlePrev}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleNext}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Pagination

