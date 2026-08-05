import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as dashboardApi from './dashboard-api'
import { useDashboardSummary } from './useDashboardSummary'

vi.mock('./dashboard-api')

const response = { data: [], pagination: { page: 1, limit: 1, total: 7, totalPages: 7 } }
const admin = { id: '1', name: 'Admin', email: 'admin@example.com', role: 'ADMIN' as const }
const operator = { ...admin, role: 'OPERATOR' as const }

function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  function Wrapper({ children }: PropsWithChildren) { return <QueryClientProvider client={client}>{children}</QueryClientProvider> }
  return Wrapper
}

describe('useDashboardSummary', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(dashboardApi.getPendingServiceRequests).mockResolvedValue(response)
    vi.mocked(dashboardApi.getInProgressServiceRequests).mockResolvedValue(response)
    vi.mocked(dashboardApi.getServiceRequestsCreatedInRange).mockResolvedValue(response)
    vi.mocked(dashboardApi.getRecentServiceRequests).mockResolvedValue(response)
    vi.mocked(dashboardApi.getCustomerCount).mockResolvedValue(response)
    vi.mocked(dashboardApi.getActiveServiceCount).mockResolvedValue(response)
    vi.mocked(dashboardApi.getAppointmentsInRange).mockResolvedValue(response)
    vi.mocked(dashboardApi.getUpcomingAppointments).mockResolvedValue(response)
    vi.mocked(dashboardApi.getActiveUserCount).mockResolvedValue(response)
  })

  it('expõe loading, totais reais e consultas paralelas para ADMIN', async () => {
    const { result } = renderHook(() => useDashboardSummary(admin, new Date('2026-08-05T12:00:00.000Z')), { wrapper: setup() })
    expect(result.current.isPending).toBe(true)
    expect(vi.mocked(dashboardApi.getPendingServiceRequests)).toHaveBeenCalledOnce()
    expect(vi.mocked(dashboardApi.getUpcomingAppointments)).toHaveBeenCalledOnce()
    expect(vi.mocked(dashboardApi.getActiveUserCount)).toHaveBeenCalledOnce()
    await waitFor(() => expect(result.current.isPending).toBe(false))
    expect(result.current.summary.pendingServiceRequests).toMatchObject({ availability: 'available', value: 7 })
    expect(result.current.summary.activeUsers).toMatchObject({ availability: 'available', value: 7 })
  })

  it('não consulta usuários para OPERATOR', async () => {
    const { result } = renderHook(() => useDashboardSummary(operator), { wrapper: setup() })
    await waitFor(() => expect(result.current.isPending).toBe(false))
    expect(dashboardApi.getActiveUserCount).not.toHaveBeenCalled()
    expect(result.current.summary.activeUsers.availability).toBe('unavailable-permission')
  })

  it('preserva falha parcial e permite retry da seção', async () => {
    vi.mocked(dashboardApi.getRecentServiceRequests).mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(response)
    const { result } = renderHook(() => useDashboardSummary(admin), { wrapper: setup() })
    await waitFor(() => expect(result.current.summary.recentServiceRequests.availability).toBe('error'))
    expect(result.current.summary.totalCustomers.availability).toBe('available')
    await act(async () => { await result.current.retryRecentServiceRequests() })
    await waitFor(() => expect(result.current.summary.recentServiceRequests.availability).toBe('available'))
  })
})
