import { apiClient } from './apiClient'
import type { HealthResponse, ReadinessResponse } from './api-types'

export function getHealth(signal?: AbortSignal): Promise<HealthResponse> {
  return apiClient.get<HealthResponse>('/health', { signal })
}

export function getReadiness(
  signal?: AbortSignal,
): Promise<ReadinessResponse> {
  return apiClient.get<ReadinessResponse>('/ready', { signal })
}
