import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth.js'
import AppLayout from './components/layout/AppLayout.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import RegisterPage from './pages/auth/RegisterPage.jsx'
import LeadsListPage from './pages/leads/LeadsListPage.jsx'
import LeadFormPage from './pages/leads/LeadFormPage.jsx'
import DashboardPage from './pages/dashboard/DashboardPage.jsx'
import NotificationsPage from './pages/notifications/NotificationsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ProtectedRoute from './components/routing/ProtectedRoute.jsx'
import PublicRoute from './components/routing/PublicRoute.jsx'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/leads" element={<LeadsListPage />} />
        <Route path="/leads/new" element={<LeadFormPage />} />
        <Route path="/leads/:id" element={<LeadFormPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      {/* Fallbacks */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
