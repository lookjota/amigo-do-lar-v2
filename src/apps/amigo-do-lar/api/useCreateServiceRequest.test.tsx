import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as serviceRequestsApi from './service-requests-api'
import { useCreateServiceRequest } from './useCreateServiceRequest'

const input: serviceRequestsApi.CreateServiceRequestInput = { customer: { name: 'Pessoa Teste', phone: '61999999999' }, serviceId: 'aa9a8c21-32fb-47ba-aef3-03ef668d727b', description: 'Descrição válida.', address: 'Endereço', city: 'Brasília' }
const response: serviceRequestsApi.CreateServiceRequestResponse = { id: '1ad575e6-0225-45ce-bb18-296407bc558b', customerId: '2ad575e6-0225-45ce-bb18-296407bc558b', serviceId: input.serviceId, description: input.description, status: 'PENDING', preferredDate: null, address: input.address, city: input.city, completedAt: null, cancelledAt: null, createdAt: '2026-08-04T12:00:00.000Z', updatedAt: '2026-08-04T12:00:00.000Z' }

beforeEach(() => vi.restoreAllMocks())

describe('useCreateServiceRequest', () => {
  it('passa por idle, submitting, success e reset sem duplicar', async () => {
    let resolveRequest: (value: serviceRequestsApi.CreateServiceRequestResponse) => void = () => undefined
    const pending = new Promise<serviceRequestsApi.CreateServiceRequestResponse>((resolve) => { resolveRequest = resolve })
    const create = vi.spyOn(serviceRequestsApi, 'createServiceRequest').mockReturnValue(pending)
    const { result } = renderHook(() => useCreateServiceRequest())
    expect(result.current.status).toBe('idle')
    let first: Promise<serviceRequestsApi.CreateServiceRequestResponse | undefined>
    await act(async () => { first = result.current.submit(input); void result.current.submit(input) })
    expect(result.current.status).toBe('submitting')
    expect(create).toHaveBeenCalledTimes(1)
    await act(async () => { resolveRequest(response); await first! })
    expect(result.current.status).toBe('success')
    act(() => result.current.reset())
    expect(result.current.status).toBe('idle')
  })

  it('expõe erro uma única vez e cancela no unmount', async () => {
    const create = vi.spyOn(serviceRequestsApi, 'createServiceRequest').mockRejectedValue(new Error('falha'))
    const { result, unmount } = renderHook(() => useCreateServiceRequest())
    await act(async () => { await result.current.submit(input) })
    expect(result.current.status).toBe('error')
    expect(create).toHaveBeenCalledTimes(1)
    create.mockImplementation((_input, signal) => new Promise((_resolve, reject) => signal?.addEventListener('abort', () => reject(new Error('abort')))))
    act(() => { void result.current.submit(input) })
    await waitFor(() => expect(result.current.status).toBe('submitting'))
    const signal = create.mock.calls[1][1]
    unmount()
    expect(signal?.aborted).toBe(true)
  })
})
