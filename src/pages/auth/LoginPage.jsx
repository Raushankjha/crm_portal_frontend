import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader.jsx'
import FormField from '../../components/common/FormField.jsx'
import ErrorAlert from '../../components/common/ErrorAlert.jsx'
import LoadingOverlay from '../../components/common/LoadingOverlay.jsx'
import { useAuth } from '../../hooks/useAuth.js'

function validate({ email, password }) {
  const errors = {}
  if (!email) {
    errors.email = 'Email is required.'
  } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    errors.email = 'Enter a valid email address.'
  }
  if (!password) {
    errors.password = 'Password is required.'
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }
  return errors
}

function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [clientErrors, setClientErrors] = useState({})
  const [serverError, setServerError] = useState('')

  const from = location.state?.from?.pathname || '/dashboard'

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setClientErrors((prev) => ({ ...prev, [name]: undefined }))
    setServerError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validate(form)
    if (Object.keys(errors).length) {
      setClientErrors(errors)
      return
    }

    const result = await login(form)
    if (!result.success) {
      setServerError(result.message)
      return
    }

    navigate(from, { replace: true })
  }

  return (
    <div className="relative mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-700/70 bg-slate-900/80 p-6 shadow-2xl">
        <PageHeader
          title="Welcome back"
          subtitle="Sign in to manage your sales pipeline and leads."
        />
        <form onSubmit={handleSubmit} noValidate>
          <ErrorAlert message={serverError} />
          <FormField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={clientErrors.email}
            autoComplete="email"
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={clientErrors.password}
            autoComplete="current-password"
          />
          <div className="mt-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <button type="submit" className="btn">
              Login
            </button>
            <div className="text-xs text-slate-400">
              New here?{' '}
              <Link to="/register" className="font-medium text-sky-400 hover:text-sky-300">
                Create an account
              </Link>
            </div>
          </div>
        </form>
      </div>
      {loading && <LoadingOverlay message="Signing you in..." />}
    </div>
  )
}

export default LoginPage

