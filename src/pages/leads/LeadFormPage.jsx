import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader.jsx'
import FormField from '../../components/common/FormField.jsx'
import ErrorAlert from '../../components/common/ErrorAlert.jsx'
import LoadingOverlay from '../../components/common/LoadingOverlay.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { hasPermission, PERMISSIONS, ROLES } from '../../utils/permissions.js'
import { createLead, getLead, updateLead } from '../../services/leadsApi.js'
import { getUsers } from '../../services/usersApi.js'

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'won', 'lost']
const SOURCE_OPTIONS = ['website', 'referral', 'cold']

function validate(values) {
  const errors = {}
  if (!values.name || values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.'
  }
  if (values.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address.'
  }
  if (!values.phone) {
    errors.phone = 'Phone is required.'
  }
  return errors
}

function LeadFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    source: '',
    status: 'new',
    notes: '',
    assignedTo: '',
  })
  const [clientErrors, setClientErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])

  const canWrite = hasPermission(user, PERMISSIONS.LEAD_WRITE)
  const canAssign =
    user?.role === ROLES.MANAGER || user?.role === ROLES.ADMIN

  useEffect(() => {
    if (!canAssign) return
    const loadUsers = async () => {
      try {
        const data = await getUsers()
        const list = Array.isArray(data) ? data : data?.users ?? data?.data ?? []
        setUsers(list)
      } catch {
        setUsers([])
      }
    }
    loadUsers()
  }, [canAssign])

  useEffect(() => {
    if (!isEdit) return

    const load = async () => {
      setLoading(true)
      try {
        const { lead } = await getLead(id)
        const assignedId =
          typeof lead.assignedTo === 'object' && lead.assignedTo != null
            ? lead.assignedTo.id || lead.assignedTo._id || ''
            : lead.assignedTo || ''
        setForm({
          name: lead.name || '',
          phone: lead.phone || '',
          email: lead.email || '',
          source: lead.source || '',
          status: lead.status || 'new',
          notes: lead.notes || '',
          assignedTo: assignedId,
        })
      } catch (err) {
        setServerError(err.response?.data?.message || 'Failed to load lead.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setClientErrors((prev) => ({ ...prev, [name]: undefined }))
    setServerError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canWrite) {
      setServerError('You do not have permission to modify leads.')
      return
    }

    const errors = validate(form)
    if (Object.keys(errors).length) {
      setClientErrors(errors)
      return
    }

    setLoading(true)
    try {
      if (isEdit) {
        await updateLead(id, form)
      } else {
        await createLead(form)
      }
      navigate('/leads')
    } catch (err) {
      const validationErrors = err.response?.data?.errors
      if (Array.isArray(validationErrors) && validationErrors.length) {
        setServerError(validationErrors.join(', '))
      } else {
        setServerError(err.response?.data?.message || 'Failed to save lead.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      <div className="rounded-2xl border border-slate-700/70 bg-slate-900/80 p-4 shadow-2xl sm:p-6">
        <PageHeader
          title={isEdit ? 'Edit lead' : 'Add lead'}
          subtitle={
            isEdit
              ? 'Update details and assignment for this lead.'
              : 'Capture a new opportunity in your pipeline.'
          }
        />

        <ErrorAlert message={serverError} />

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={clientErrors.name}
          />
          <FormField
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            error={clientErrors.phone}
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={clientErrors.email}
          />
          <FormField label="Source" name="source">
            <select
              id="source"
              name="source"
              value={form.source}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-600 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            >
              <option value="">Select source</option>
              {SOURCE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Status" name="status">
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-600 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </FormField>
          {canAssign && (
            <FormField label="Assigned to" name="assignedTo">
              <select
                id="assignedTo"
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-600 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id || u._id} value={u.id || u._id}>
                    {u.name || u.email || u.id || u._id}
                    {u.email && u.name ? ` (${u.email})` : ''}
                  </option>
                ))}
              </select>
            </FormField>
          )}
          <FormField label="Notes" name="notes">
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
              className="w-full resize-y rounded-xl border border-slate-600 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            />
          </FormField>
          <div className="mt-4 flex flex-wrap gap-3"> 
            <button type="submit" className="btn">
              Save lead
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/leads')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      {loading && <LoadingOverlay message="Saving lead..." />}
    </div>
  )
}

export default LeadFormPage

