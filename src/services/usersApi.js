import { apiClient } from './apiClient.js'

/**
 * Fetch list of users (for assignment dropdown).
 * Backend: GET /users is typically admin-only; some APIs expose a lighter list for managers.
 */
export async function getUsers(params) {
  const { data } = await apiClient.get('/users', { params })
  return data
}
