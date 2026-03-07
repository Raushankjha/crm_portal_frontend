import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="rounded-2xl border border-slate-700/70 bg-slate-900/80 p-6 text-center shadow-2xl">
      <h1 className="page-title">404</h1>
      <p className="page-subtitle">The page you are looking for does not exist.</p>
      <div className="mt-4">
        <Link to="/" className="btn">
          Go to dashboard
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage

