import { publicConfig } from './environment'

export const apiConfig = {
  baseUrl: publicConfig.apiUrl,
  timeoutMs: 10_000,
} as const
