import { useEffect, useState } from 'react'
import PageHeader from '../../components/common/PageHeader.jsx'
import ErrorAlert from '../../components/common/ErrorAlert.jsx'
import LoadingOverlay from '../../components/common/LoadingOverlay.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { hasPermission, PERMISSIONS } from '../../utils/permissions.js'
import { getSummary } from '../../services/dashboardApi.js'

function StatCard({ label, value, accent }) {
  return (
    <div
      className="card"
      style={{
        padding: '1rem 1.1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at top right, ${accent}, transparent 60%)`,
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: '1.6rem', fontWeight: 600 }}>{value}</div>
      </div>
    </div>
  )
}

function DashboardPage() {
  const { user } = useAuth()
  const [filters, setFilters] = useState({ createdFrom: '', createdTo: '' })
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const canViewDashboard = hasPermission(user, PERMISSIONS.DASHBOARD_READ)

  const loadStats = async () => {
    if (!canViewDashboard) return
    setLoading(true)
    setError('')
    try {
      const data = await getSummary({
        createdFrom: filters.createdFrom || undefined,
        createdTo: filters.createdTo || undefined,
      })
      setStats(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleApplyFilters = () => {
    loadStats()
  }

  return (
    <div className="relative">
      <div className="rounded-2xl border border-slate-700/70 bg-slate-900/80 p-4 shadow-2xl sm:p-6">
        <PageHeader
          title="Pipeline overview"
          subtitle={
            canViewDashboard
              ? 'Track volume, conversion health, and lead sources.'
              : 'You do not have access to global dashboard metrics.'
          }
        />

        {canViewDashboard && (
          <>
            <div className="mb-4 flex flex-wrap gap-3 text-xs text-slate-300">
              <div>
                <div className="mb-1 text-[0.7rem] uppercase tracking-wide text-slate-400">
                  Created from
                </div>
                <input
                  type="date"
                  name="createdFrom"
                  value={filters.createdFrom}
                  onChange={handleFilterChange}
                  className="rounded-xl border border-slate-600 bg-slate-900/80 px-2 py-1.5 text-xs text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
              </div>
              <div>
                <div className="mb-1 text-[0.7rem] uppercase tracking-wide text-slate-400">
                  Created to
                </div>
                <input
                  type="date"
                  name="createdTo"
                  value={filters.createdTo}
                  onChange={handleFilterChange}
                  className="rounded-xl border border-slate-600 bg-slate-900/80 px-2 py-1.5 text-xs text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
              </div>
              <div className="self-end">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleApplyFilters}
                >
                  Apply
                </button>
              </div>
            </div>
            <ErrorAlert message={error} />

            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total leads"
                value={stats?.totalLeads ?? '—'}
                accent="#22c55e"
              />
              <StatCard
                label="Won"
                value={stats?.byStatus?.won ?? 0}
                accent="#a855f7"
              />
              <StatCard
                label="Lost"
                value={stats?.byStatus?.lost ?? 0}
                accent="#ef4444"
              />
              <StatCard
                label="New this period"
                value={stats?.byStatus?.new ?? 0}
                accent="#38bdf8"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-medium text-slate-100">
                  By status
                </h3>
                <ul className="space-y-1 text-xs text-slate-200">
                  {['new', 'contacted', 'qualified', 'won', 'lost'].map((status) => (
                    <li
                      key={status}
                      className="flex items-center justify-between border-b border-indigo-900/60 py-1"
                    >
                      <span className="capitalize text-slate-200">
                        {status}
                      </span>
                      <span>{stats?.byStatus?.[status] ?? 0}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium text-slate-100">
                  By source
                </h3>
                <ul className="space-y-1 text-xs text-slate-200">
                  {['website', 'referral', 'cold'].map((source) => (
                    <li
                      key={source}
                      className="flex items-center justify-between border-b border-indigo-900/60 py-1"
                    >
                      <span className="capitalize text-slate-200">
                        {source}
                      </span>
                      <span>{stats?.bySource?.[source] ?? 0}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
      {loading && <LoadingOverlay message="Loading dashboard..." />}
    </div>
  )
}

export default DashboardPage

