import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from './apiClient'
import { getHealth, getReadiness } from './health-api'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('health API', () => {
  it('consulta o health check com o signal recebido', async () => {
    const controller = new AbortController()
    const get = vi
      .spyOn(apiClient, 'get')
      .mockResolvedValue({ status: 'ok' })

    await expect(getHealth(controller.signal)).resolves.toEqual({ status: 'ok' })
    expect(get).toHaveBeenCalledWith('/health', { signal: controller.signal })
  })

  it('consulta o readiness check', async () => {
    const get = vi
      .spyOn(apiClient, 'get')
      .mockResolvedValue({ status: 'ready' })

    await expect(getReadiness()).resolves.toEqual({ status: 'ready' })
    expect(get).toHaveBeenCalledWith('/ready', { signal: undefined })
  })
})
