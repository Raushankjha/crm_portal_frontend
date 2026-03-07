import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import NotificationBell from '../notifications/NotificationBell.jsx'

function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-slate-700/70 bg-slate-900/80 px-4 py-3 backdrop-blur-md md:px-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full shadow-sm ring-1 ring-slate-500/60 bg-[radial-gradient(circle_at_30%_20%,#22c55e,transparent_60%),radial-gradient(circle_at_70%_70%,#0ea5e9,transparent_55%)]" />
          <div>
            <div className="text-sm font-semibold tracking-wide text-slate-50">
              CRM+ Lead Manager
            </div>
            <div className="text-[0.7rem] text-slate-400">
              Sales pipeline &amp; notifications
            </div>
          </div>
        </div>

        <nav className="hidden items-center gap-5 text-xs font-medium text-slate-200 md:flex">
          <NavLink
            to="/dashboard"
            style={({ isActive }) => ({
              color: isActive ? '#f9fafb' : '#cbd5f5',
              fontWeight: isActive ? 600 : 400,
            })}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/leads"
            style={({ isActive }) => ({
              color: isActive ? '#f9fafb' : '#cbd5f5',
              fontWeight: isActive ? 600 : 400,
            })}
          >
            Leads
          </NavLink>
          <NavLink
            to="/notifications"
            style={({ isActive }) => ({
              color: isActive ? '#f9fafb' : '#cbd5f5',
              fontWeight: isActive ? 600 : 400,
            })}
          >
            Notifications
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <NotificationBell />
          <div className="hidden text-right text-xs md:block">
            <div className="font-medium text-slate-50">
              {user?.name || 'User'}
            </div>
            <div className="capitalize text-slate-400">
              {user?.role || 'role'}
            </div>
          </div>
          <button className="btn btn-secondary" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 px-3 py-4 md:px-6 md:py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row">
          <aside className="order-2 w-full md:order-1 md:w-64">
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4 shadow-lg">
              <h2 className="mb-2 text-sm font-semibold text-slate-100">
                Quick filters
              </h2>
              <p className="text-xs text-slate-400">
                Use the controls on each page to slice your leads by status, owner, and time.
              </p>
            </div>
          </aside>
          <section className="order-1 w-full md:order-2">
            <Outlet />
          </section>
        </div>
      </main>
    </div>
  )
}

export default AppLayout

