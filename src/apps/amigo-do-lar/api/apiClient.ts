import { HttpClient } from '../../../shared/http'
import { apiConfig } from '../config/api'
import {
  clearStoredSession,
  getStoredAccessToken,
  notifySessionExpired,
} from '../auth/sessionStorage'

export const apiClient = new HttpClient({
  ...apiConfig,
})

export const authenticatedApiClient = new HttpClient({
  ...apiConfig,
  getAccessToken: getStoredAccessToken,
  onUnauthorized: () => {
    clearStoredSession()
    notifySessionExpired()
  },
})
