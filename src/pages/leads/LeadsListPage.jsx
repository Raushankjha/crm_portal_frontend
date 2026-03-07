import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import PageHeader from '../../components/common/PageHeader.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import ErrorAlert from '../../components/common/ErrorAlert.jsx'
import LoadingOverlay from '../../components/common/LoadingOverlay.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { hasPermission, PERMISSIONS, ROLES } from '../../utils/permissions.js'
import { listLeads, deleteLead } from '../../services/leadsApi.js'

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'won', 'lost']
const SOURCE_OPTIONS = ['website', 'referral', 'cold']

function LeadsListPage() {
  const { user } = useAuth()
  const [filters, setFilters] = useState({
    q: '',
    status: '',
    source: '',
    assignedTo: '',
    createdFrom: '',
    createdTo: '',
    sort: 'createdAt:desc',
    page: 1,
    limit: 10,
  })
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const canCreateLead = hasPermission(user, PERMISSIONS.LEAD_WRITE)
  const canDeleteLead = hasPermission(user, PERMISSIONS.LEAD_DELETE)
  const canAssignFilter =
    user?.role === ROLES.MANAGER || user?.role === ROLES.ADMIN

  const loadLeads = async (override = {}) => {
    setLoading(true)
    setError('')
    try {
      const params = { ...filters, ...override }
      const response = await listLeads(params)
      setData(response.data || [])
      setPagination(response.pagination || { page: params.page, limit: params.limit, total: 0, totalPages: 1 })
      setFilters(params)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load leads.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeads()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    const next = { ...filters, [name]: value, page: 1 }
    setFilters(next)
  }

  const handleApplyFilters = () => {
    loadLeads({ page: 1 })
  }

  const handlePageChange = (page) => {
    loadLeads({ page })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead?')) return
    try {
      await deleteLead(id)
      loadLeads()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete lead.')
    }
  }

  const totalCount = pagination.total || data.length

  return (
    <div className="relative">
      <div className="rounded-2xl border border-slate-700/70 bg-slate-900/80 p-4 shadow-2xl sm:p-6">
        <PageHeader
          title="Leads"
          subtitle="Search, filter, and manage your sales leads."
          actions={
            canCreateLead ? (
              <Link to="/leads/new" className="btn">
                + Add lead
              </Link>
            ) : null
          }
        />

        <ErrorAlert message={error} />

        {/* Filters */}
        <div className="mb-4 grid grid-cols-1 gap-3 text-xs text-slate-300 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-1 text-[0.7rem] uppercase tracking-wide text-slate-400">
              Search
            </div>
            <input
              type="search"
              name="q"
              placeholder="Name, email, phone"
              value={filters.q}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-600 bg-slate-900/80 px-2 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            />
          </div>
          <div>
            <div className="mb-1 text-[0.7rem] uppercase tracking-wide text-slate-400">
              Status
            </div>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-600 bg-slate-900/80 px-2 py-1.5 text-xs text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            >
              <option value="">All</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="mb-1 text-[0.7rem] uppercase tracking-wide text-slate-400">
              Source
            </div>
            <select
              name="source"
              value={filters.source}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-600 bg-slate-900/80 px-2 py-1.5 text-xs text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            >
              <option value="">All</option>
              {SOURCE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="mb-1 text-[0.7rem] uppercase tracking-wide text-slate-400">
              Created from
            </div>
            <input
              type="date"
              name="createdFrom"
              value={filters.createdFrom}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-600 bg-slate-900/80 px-2 py-1.5 text-xs text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
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
              className="w-full rounded-xl border border-slate-600 bg-slate-900/80 px-2 py-1.5 text-xs text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            />
          </div>
          {canAssignFilter && (
            <div>
              <div className="mb-1 text-[0.7rem] uppercase tracking-wide text-slate-400">
                Assigned to (user id)
              </div>
              <input
                type="text"
                name="assignedTo"
                placeholder="User ID"
                value={filters.assignedTo}
                onChange={handleFilterChange}
                className="w-full rounded-xl border border-slate-600 bg-slate-900/80 px-2 py-1.5 text-xs text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
              />
            </div>
          )}
          <div>
            <div className="mb-1 text-[0.7rem] uppercase tracking-wide text-slate-400">
              Sort
            </div>
            <select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-600 bg-slate-900/80 px-2 py-1.5 text-xs text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            >
              <option value="createdAt:desc">Newest first</option>
              <option value="createdAt:asc">Oldest first</option>
              <option value="name:asc">Name A–Z</option>
              <option value="name:desc">Name Z–A</option>
            </select>
          </div>
        </div>
        <div className="mb-4 flex justify-end">
          <button type="button" className="btn btn-secondary" onClick={handleApplyFilters}>
            Apply filters
          </button>
        </div>

        {/* Table */}
        {data.length === 0 && !loading ? (
          <EmptyState
            title="No leads found"
            description="Try adjusting your filters or add a new lead."
          />
        ) : (
          <div
            className="overflow-x-auto rounded-xl border border-indigo-700/70 bg-slate-950/40"
          >
            <table
              className="min-w-full border-collapse text-xs sm:text-sm"
            >
              <thead className="bg-gradient-to-r from-slate-900 to-indigo-900 text-left text-slate-100">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Source</th>
                  <th className="px-3 py-2">Owner</th>
                  <th className="px-3 py-2">Created</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((lead) => (
                  <tr
                    key={lead.id || lead._id}
                    className="border-t border-indigo-900/60 bg-slate-900/80"
                  >
                    <td className="px-3 py-2 align-top text-slate-50">
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-[0.7rem] text-slate-400">
                        {lead.email || lead.phone}
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-3 py-2 align-top text-slate-200">
                      {lead.source || '—'}
                    </td>
                    <td className="px-3 py-2 align-top text-slate-200">
                      {lead.assignedTo?.name || lead.assignedTo || 'Unassigned'}
                    </td>
                    <td className="px-3 py-2 align-top text-slate-400">
                      {lead.createdAt
                        ? format(new Date(lead.createdAt), 'dd MMM yyyy')
                        : '—'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right align-top">
                      <Link
                        to={`/leads/${lead.id || lead._id}`}
                        className="btn btn-ghost text-[0.7rem] sm:text-xs"
                      >
                        Edit
                      </Link>
                      {canDeleteLead && (
                        <button
                          type="button"
                          className="btn btn-ghost text-[0.7rem] text-rose-300 sm:text-xs"
                          onClick={() => handleDelete(lead.id || lead._id)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between text-[0.7rem] text-slate-400 sm:text-xs">
          <span>Total leads: {totalCount}</span>
        </div>

        <Pagination
          page={pagination.page || 1}
          totalPages={pagination.totalPages || 1}
          onChange={handlePageChange}
        />
      </div>
      {loading && <LoadingOverlay message="Fetching leads..." />}
    </div>
  )
}

export default LeadsListPage

