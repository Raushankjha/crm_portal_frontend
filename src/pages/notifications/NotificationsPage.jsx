import { useEffect, useState } from 'react'
import PageHeader from '../../components/common/PageHeader.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import ErrorAlert from '../../components/common/ErrorAlert.jsx'
import LoadingOverlay from '../../components/common/LoadingOverlay.jsx'
import { listNotifications, markNotificationRead } from '../../services/notificationsApi.js'

function NotificationsPage() {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const load = async (pageToLoad = 1) => {
    setLoading(true)
    setError('')
    try {
      const { data, pagination } = await listNotifications({ page: pageToLoad, limit: 10 })
      setItems(data || [])
      setPage(pagination?.page || pageToLoad)
      setTotalPages(pagination?.totalPages || 1)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load notifications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id)
      setItems((prev) =>
        prev.map((n) => (n.id === id || n._id === id ? { ...n, read: true } : n)),
      )
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark notification as read.')
    }
  }

  return (
    <div className="relative">
      <div className="rounded-2xl border border-slate-700/70 bg-slate-900/80 p-4 shadow-2xl sm:p-6">
        <PageHeader
          title="Notifications"
          subtitle="Realtime activity about your leads and assignments."
        />
        <ErrorAlert message={error} />

        {items.length === 0 && !loading ? (
          <EmptyState
            title="You are all caught up"
            description="New notifications will appear here in real time."
          />
        ) : (
          <ul
            className="mt-2 flex flex-col gap-2 text-xs text-slate-200 sm:text-sm"
          >
            {items.map((n) => {
              const id = n.id || n._id
              return (
                <li
                  key={id}
                  className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 ${
                    n.read
                      ? 'border-slate-700/70 bg-slate-900/80'
                      : 'border-indigo-600/70 bg-gradient-to-r from-slate-900 to-indigo-900'
                  }`}
                >
                  <div>
                    <div className="text-slate-50">{n.title || n.message}</div>
                    <div className="text-[0.7rem] text-slate-300 sm:text-xs">
                      {n.type} · {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                    </div>
                  </div>
                  {!n.read && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ fontSize: '0.78rem' }}
                      onClick={() => handleMarkRead(id)}
                    >
                      Mark as read
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )}

        <Pagination page={page} totalPages={totalPages} onChange={load} />
      </div>
      {loading && <LoadingOverlay message="Loading notifications..." />}
    </div>
  )
}

export default NotificationsPage

