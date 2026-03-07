import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../services/authApi.js'
import { clearAuth, getStoredUser, getToken, saveAuth } from '../utils/storage.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser())
  const [token, setToken] = useState(() => getToken())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // keep user and token in sync with storage
    if (!token || !user) {
      return
    }
  }, [token, user])

  const handleLogin = async (credentials) => {
    setLoading(true)
    try {
      const result = await apiLogin(credentials)
      const { token: jwt, user: userPayload } = result
      saveAuth({ token: jwt, user: userPayload })
      setUser(userPayload)
      setToken(jwt)
      return { success: true, user: userPayload }
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to login. Please try again.'
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (payload) => {
    setLoading(true)
    try {
      const result = await apiRegister(payload)
      const { token: jwt, user: userPayload } = result
      saveAuth({ token: jwt, user: userPayload })
      setUser(userPayload)
      setToken(jwt)
      return { success: true, user: userPayload }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (Array.isArray(error.response?.data?.errors)
          ? error.response.data.errors.join(', ')
          : 'Unable to register. Please check your details.')
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await apiLogout()
    } finally {
      clearAuth()
      setUser(null)
      setToken(null)
    }
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      loading,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      setUser,
    }),
    [user, token, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return ctx
}

