import { apiClient } from './apiClient.js'

export async function getSummary(params) {
  const { data } = await apiClient.get('/leads/stats/summary', { params })
  return data
}

