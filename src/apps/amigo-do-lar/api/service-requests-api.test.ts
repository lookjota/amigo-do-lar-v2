import { afterEach, describe, expect, it, vi } from 'vitest'
import { ZodError } from 'zod'
import { apiClient } from './apiClient'
import { createServiceRequest, type CreateServiceRequestInput } from './service-requests-api'

const input: CreateServiceRequestInput = { customer: { name: 'Pessoa Teste', phone: '61999999999' }, serviceId: 'aa9a8c21-32fb-47ba-aef3-03ef668d727b', description: 'Reparo elétrico de teste.', address: 'Endereço de teste', city: 'Brasília' }
const response = { id: '1ad575e6-0225-45ce-bb18-296407bc558b', customerId: '2ad575e6-0225-45ce-bb18-296407bc558b', serviceId: input.serviceId, description: input.description, status: 'PENDING', preferredDate: null, address: input.address, city: input.city, completedAt: null, cancelledAt: null, createdAt: '2026-08-04T12:00:00.000Z', updatedAt: '2026-08-04T12:00:00.000Z' }

afterEach(() => vi.restoreAllMocks())

describe('createServiceRequest', () => {
  it('usa o endpoint real, payload e AbortSignal', async () => {
    const controller = new AbortController()
    const post = vi.spyOn(apiClient, 'post').mockResolvedValue(response)
    await expect(createServiceRequest(input, controller.signal)).resolves.toEqual(response)
    expect(post).toHaveBeenCalledWith('/service-requests', input, { signal: controller.signal })
  })

  it('preserva erro HTTP e rejeita resposta fora do contrato', async () => {
    const failure = new Error('failure')
    vi.spyOn(apiClient, 'post').mockRejectedValueOnce(failure)
    await expect(createServiceRequest(input)).rejects.toBe(failure)
    vi.spyOn(apiClient, 'post').mockResolvedValueOnce({ id: 'inválido' })
    await expect(createServiceRequest(input)).rejects.toBeInstanceOf(ZodError)
  })
})
