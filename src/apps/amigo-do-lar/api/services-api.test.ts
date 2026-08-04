import { afterEach, describe, expect, it, vi } from 'vitest'
import { HttpError } from '../../../shared/http'
import { apiClient } from './apiClient'
import { getServices, type ServicesResponse } from './services-api'

const activeService = {
  id: '1ad575e6-0225-45ce-bb18-296407bc558b',
  name: 'Elétrica',
  slug: 'eletrica',
  description: 'Reparos elétricos residenciais.',
  category: 'ELECTRICAL',
  isActive: true,
  createdAt: '2026-07-30T12:00:00.000Z',
  updatedAt: '2026-07-30T12:00:00.000Z',
} satisfies ServicesResponse['data'][number]

function response(
  data: ServicesResponse['data'] = [activeService],
): ServicesResponse {
  return {
    data,
    pagination: { page: 1, limit: 20, total: data.length, totalPages: 1 },
  }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('getServices', () => {
  it('consulta somente o endpoint público correto e faz o parsing do contrato', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue(response())

    await expect(getServices()).resolves.toEqual([activeService])
    expect(get).toHaveBeenCalledOnce()
    expect(get).toHaveBeenCalledWith('/services', { signal: undefined })
  })

  it('encaminha o AbortSignal recebido', async () => {
    const controller = new AbortController()
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue(response())

    await getServices(controller.signal)

    expect(get).toHaveBeenCalledWith('/services', {
      signal: controller.signal,
    })
  })

  it('preserva erros HTTP normalizados', async () => {
    const error = new HttpError({
      status: 503,
      statusText: 'Service Unavailable',
      responseBody: { error: { code: 'UNAVAILABLE' } },
      url: 'https://api.example.com/services',
      method: 'GET',
    })
    vi.spyOn(apiClient, 'get').mockRejectedValue(error)

    await expect(getServices()).rejects.toBe(error)
  })

  it('remove defensivamente serviços inativos', async () => {
    const inactive = { ...activeService, id: 'inactive', isActive: false }
    vi.spyOn(apiClient, 'get').mockResolvedValue(response([
      activeService,
      inactive,
    ]))

    await expect(getServices()).resolves.toEqual([activeService])
  })

  it('rejeita respostas fora do contrato público', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValue({ data: [{}] })

    await expect(getServices()).rejects.toMatchObject({ name: 'ZodError' })
  })
})
