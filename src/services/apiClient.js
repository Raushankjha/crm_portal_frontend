import { clearAuth, getToken } from '../utils/storage.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

function buildUrl(path, params) {
  const isAbsolute = /^https?:\/\//i.test(path)
  const base = isAbsolute ? path : `${API_BASE_URL.replace(/\/$/, '')}${path}`
  const url = new URL(base)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.append(key, value)
      }
    })
  }

  return url.toString()
}

async function request(path, { method = 'GET', body, params } = {}) {
  const token = getToken()
  const url = buildUrl(path, params)

  const headers = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const contentType = response.headers.get('content-type') || ''
  let data = null

  if (contentType.includes('application/json')) {
    try {
      data = await response.json()
    } catch {
      data = null
    }
  } else {
    try {
      data = await response.text()
    } catch {
      data = null
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      clearAuth()
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    const message =
      (data && typeof data === 'object' && data.message) ||
      `Request failed with status ${response.status}`

    const error = new Error(message)
    error.response = {
      status: response.status,
      data,
    }
    throw error
  }

  return { data }
}

export const apiClient = {
  get: (path, config = {}) => request(path, { method: 'GET', params: config.params }),
  post: (path, body) => request(path, { method: 'POST', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
}
