import { afterEach, describe, expect, it, vi } from 'vitest'
import { HttpError, NetworkError } from '../../../../../shared/http'
import { authenticatedApiClient } from '../../../api/apiClient'
import {
  buildAdminServiceRequestsPath,
  getAdminServiceRequest,
  getAdminServiceRequests,
  updateAdminServiceRequestStatus,
} from './service-requests-admin-api'

const request = {
  id: '1ad575e6-0225-45ce-bb18-296407bc558b',
  customerId: '2ad575e6-0225-45ce-bb18-296407bc558b',
  serviceId: '3ad575e6-0225-45ce-bb18-296407bc558b',
  description: 'A tomada da cozinha parou de funcionar.',
  status: 'PENDING' as const,
  preferredDate: null,
  address: 'Taguatinga Norte',
  city: 'Brasília',
  internalNotes: null,
  completedAt: null,
  cancelledAt: null,
  createdAt: '2026-08-04T12:00:00.000Z',
  updatedAt: '2026-08-04T12:00:00.000Z',
  customer: {
    id: '2ad575e6-0225-45ce-bb18-296407bc558b',
    name: 'João da Silva',
    phone: '61999999999',
    email: 'joao@example.com',
    isActive: true,
  },
  service: {
    id: '3ad575e6-0225-45ce-bb18-296407bc558b',
    name: 'Elétrica',
    slug: 'eletrica',
    category: 'ELECTRICAL',
    isActive: true,
  },
}

afterEach(() => vi.restoreAllMocks())

describe('service requests admin API', () => {
  it('monta paginação e apenas filtros preenchidos', () => {
    const path = buildAdminServiceRequestsPath({
      page: 2,
      limit: 20,
      search: '  tomada ',
      status: 'PENDING',
      createdFrom: '2026-08-01T00:00:00.000Z',
    })
    expect(path).toBe('/service-requests?page=2&limit=20&search=tomada&status=PENDING&createdFrom=2026-08-01T00%3A00%3A00.000Z')
    expect(path).not.toContain('serviceId')
  })

  it('lista pelo cliente autenticado, encaminha signal e valida paginação', async () => {
    const controller = new AbortController()
    const response = { data: [request], pagination: { page: 1, limit: 20, total: 1, totalPages: 1 } }
    const get = vi.spyOn(authenticatedApiClient, 'get').mockResolvedValue(response)
    await expect(getAdminServiceRequests({ page: 1, limit: 20 }, controller.signal)).resolves.toEqual(response)
    expect(get).toHaveBeenCalledWith('/service-requests?page=1&limit=20', { signal: controller.signal })
  })

  it('consulta detalhes no endpoint confirmado', async () => {
    const get = vi.spyOn(authenticatedApiClient, 'get').mockResolvedValue(request)
    await expect(getAdminServiceRequest(request.id)).resolves.toEqual(request)
    expect(get).toHaveBeenCalledWith(`/service-requests/${request.id}`, { signal: undefined })
  })

  it('envia somente status no PATCH confirmado', async () => {
    const updated = { ...request, status: 'CONTACTED' as const }
    const patch = vi.spyOn(authenticatedApiClient, 'patch').mockResolvedValue(updated)
    await expect(updateAdminServiceRequestStatus(request.id, { status: 'CONTACTED' })).resolves.toEqual(updated)
    expect(patch).toHaveBeenCalledWith(`/service-requests/${request.id}/status`, { status: 'CONTACTED' }, { signal: undefined })
  })

  it('rejeita respostas de lista, detalhe e atualização fora do contrato', async () => {
    vi.spyOn(authenticatedApiClient, 'get').mockResolvedValueOnce({ data: [], pagination: { page: 0 } }).mockResolvedValueOnce({ id: 'inválido' })
    vi.spyOn(authenticatedApiClient, 'patch').mockResolvedValue({ ...request, status: 'UNKNOWN' })
    await expect(getAdminServiceRequests({ page: 1, limit: 20 })).rejects.toMatchObject({ name: 'ZodError' })
    await expect(getAdminServiceRequest(request.id)).rejects.toMatchObject({ name: 'ZodError' })
    await expect(updateAdminServiceRequestStatus(request.id, { status: 'CONTACTED' })).rejects.toMatchObject({ name: 'ZodError' })
  })

  it.each([401, 403, 404])('preserva erro HTTP %s', async (status) => {
    const error = new HttpError({ status, statusText: 'Error', responseBody: {}, url: 'https://api.example.com/service-requests', method: 'GET' })
    vi.spyOn(authenticatedApiClient, 'get').mockRejectedValue(error)
    await expect(getAdminServiceRequests({ page: 1, limit: 20 })).rejects.toBe(error)
  })

  it('preserva erro de rede', async () => {
    const error = new NetworkError()
    vi.spyOn(authenticatedApiClient, 'get').mockRejectedValue(error)
    await expect(getAdminServiceRequests({ page: 1, limit: 20 })).rejects.toBe(error)
  })
})
