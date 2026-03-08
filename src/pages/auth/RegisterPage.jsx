import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader.jsx'
import FormField from '../../components/common/FormField.jsx'
import ErrorAlert from '../../components/common/ErrorAlert.jsx'
import LoadingOverlay from '../../components/common/LoadingOverlay.jsx'
import { useAuth } from '../../hooks/useAuth.js'

function validate({ name, email, password }) {
  const errors = {}
  if (!name || name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.'
  }
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

function RegisterPage() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [clientErrors, setClientErrors] = useState({})
  const [serverError, setServerError] = useState('')

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

    const result = await register(form)
    if (!result.success) {
      setServerError(result.message)
      return
    }

    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="flex min-h-[100vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border bg-gradient-to-br from-[#141e30] to-[#243b55] p-6 shadow-2xl">
        <PageHeader
          title="Create your account"
          subtitle="Set up a profile to start capturing and managing leads."
        />
        <form onSubmit={handleSubmit} noValidate>
          <ErrorAlert message={serverError} />
          <FormField
            label="Full name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={clientErrors.name}
            autoComplete="name"
          />
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
            autoComplete="new-password"
          />
          <div className="mt-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <button type="submit" className="bg-[#35bdf2] rounded-xl p-2">
              Register
            </button>
            <div className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-sky-400 hover:text-sky-300">
                Log in
              </Link>
            </div>
          </div>
        </form>
      </div>
      {loading && <LoadingOverlay message="Creating your account..." />}
    </div>
  )
}

export default RegisterPage

