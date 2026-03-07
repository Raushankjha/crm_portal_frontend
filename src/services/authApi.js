import { apiClient } from './apiClient.js'

export async function login(payload) {
  const { data } = await apiClient.post('/auth/login', payload)
  return data
}

export async function register(payload) {
  const { data } = await apiClient.post('/auth/register', payload)
  return data
}

export async function logout() {
  try {
    await apiClient.post('/auth/logout')
  } catch {
    // best effort only
  }
}
