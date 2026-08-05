import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  getAdminServiceRequest,
  getAdminServiceRequests,
  updateAdminServiceRequestStatus,
} from './service-requests-admin-api'
import { useServiceRequest } from './useServiceRequest'
import { useServiceRequests } from './useServiceRequests'
import { useUpdateServiceRequestStatus } from './useUpdateServiceRequestStatus'

vi.mock('./service-requests-admin-api', () => ({
  getAdminServiceRequests: vi.fn(),
  getAdminServiceRequest: vi.fn(),
  updateAdminServiceRequestStatus: vi.fn(),
}))

const listResponse = {
  data: [],
  pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
}

function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
  return { client, Wrapper }
}

afterEach(() => vi.clearAllMocks())

describe('hooks administrativos de solicitações', () => {
  it('expõe loading, success, filtros e paginação sem duplicar a consulta', async () => {
    vi.mocked(getAdminServiceRequests).mockResolvedValue(listResponse)
    const { Wrapper } = setup()
    const filters = { page: 1, limit: 20, status: 'PENDING' as const }
    const { result } = renderHook(() => useServiceRequests(filters), { wrapper: Wrapper })
    expect(result.current.isPending).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(listResponse)
    expect(getAdminServiceRequests).toHaveBeenCalledOnce()
    expect(getAdminServiceRequests).toHaveBeenCalledWith(filters, expect.any(AbortSignal))
  })

  it('expõe erro e retry', async () => {
    vi.mocked(getAdminServiceRequests).mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(listResponse)
    const { Wrapper } = setup()
    const { result, unmount } = renderHook(() => useServiceRequests({ page: 1, limit: 20 }), { wrapper: Wrapper })
    await waitFor(() => expect(result.current.isError).toBe(true))
    await act(async () => { await result.current.refetch() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    unmount()
  })

  it('cancela uma consulta pendente ao desmontar', async () => {
    vi.mocked(getAdminServiceRequests).mockReturnValue(new Promise(() => undefined))
    const { Wrapper } = setup()
    const { unmount } = renderHook(() => useServiceRequests({ page: 1, limit: 20 }), { wrapper: Wrapper })
    await waitFor(() => expect(getAdminServiceRequests).toHaveBeenCalledOnce())
    const signal = vi.mocked(getAdminServiceRequests).mock.calls[0][1]
    expect(signal?.aborted).toBe(false)
    unmount()
    expect(signal?.aborted).toBe(true)
  })

  it('mantém detalhe idle sem id', () => {
    const { Wrapper } = setup()
    const { result } = renderHook(() => useServiceRequest(), { wrapper: Wrapper })
    expect(result.current.fetchStatus).toBe('idle')
    expect(getAdminServiceRequest).not.toHaveBeenCalled()
  })

  it('atualiza uma vez, sem retry, e invalida lista após sucesso', async () => {
    const updated = { id: 'request', status: 'CONTACTED' }
    vi.mocked(updateAdminServiceRequestStatus).mockResolvedValue(updated as never)
    const { client, Wrapper } = setup()
    const invalidate = vi.spyOn(client, 'invalidateQueries')
    const { result } = renderHook(() => useUpdateServiceRequestStatus('request'), { wrapper: Wrapper })
    await act(async () => { await result.current.mutateAsync({ status: 'CONTACTED' }) })
    expect(updateAdminServiceRequestStatus).toHaveBeenCalledOnce()
    expect(invalidate).toHaveBeenCalledOnce()
  })
})
