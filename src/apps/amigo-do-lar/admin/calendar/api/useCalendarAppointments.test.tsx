import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as appointmentsApi from '../../appointments/api/appointments-admin-api'
import { getCalendarRange } from '../utils/calendar-range'
import { CALENDAR_PAGE_SIZE, useCalendarAppointments } from './useCalendarAppointments'

vi.mock('../../appointments/api/appointments-admin-api')

function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  function Wrapper({ children }: PropsWithChildren) { return <QueryClientProvider client={client}>{children}</QueryClientProvider> }
  return { client, Wrapper }
}

const response = (page: number, totalPages = 1) => ({ data: [], pagination: { page, limit: CALENDAR_PAGE_SIZE, total: totalPages * CALENDAR_PAGE_SIZE, totalPages } })

describe('useCalendarAppointments', () => {
  beforeEach(() => vi.resetAllMocks())

  it('expõe loading, sucesso e envia intervalo, ordenação e signal', async () => {
    vi.mocked(appointmentsApi.getAdminAppointments).mockResolvedValue(response(1))
    const range = getCalendarRange(new Date(2026, 7, 5), 'week')
    const { Wrapper } = setup()
    const { result } = renderHook(() => useCalendarAppointments(range), { wrapper: Wrapper })
    expect(result.current.isPending).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(appointmentsApi.getAdminAppointments).toHaveBeenCalledWith({ page: 1, limit: 100, scheduledFrom: range.from, scheduledTo: range.to, sortBy: 'scheduledAt', sortOrder: 'asc' }, expect.any(AbortSignal))
  })

  it('carrega a próxima página sem limite arbitrário', async () => {
    vi.mocked(appointmentsApi.getAdminAppointments).mockImplementation(({ page }) => Promise.resolve(response(page, 2)))
    const { Wrapper } = setup()
    const { result } = renderHook(() => useCalendarAppointments(getCalendarRange(new Date(2026, 7, 5), 'month')), { wrapper: Wrapper })
    await waitFor(() => expect(result.current.hasNextPage).toBe(true))
    await act(async () => { await result.current.fetchNextPage() })
    expect(appointmentsApi.getAdminAppointments).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2, limit: 100 }), expect.any(AbortSignal))
  })

  it('expõe erro, permite retry e refaz a consulta ao mudar período', async () => {
    vi.mocked(appointmentsApi.getAdminAppointments).mockRejectedValueOnce(new Error('offline')).mockResolvedValue(response(1))
    const first = getCalendarRange(new Date(2026, 7, 5), 'day')
    const second = getCalendarRange(new Date(2026, 7, 6), 'day')
    const { Wrapper } = setup()
    const { result, rerender } = renderHook(({ range }) => useCalendarAppointments(range), { initialProps: { range: first }, wrapper: Wrapper })
    await waitFor(() => expect(result.current.isError).toBe(true))
    await act(async () => { await result.current.refetch() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    rerender({ range: second })
    await waitFor(() => expect(appointmentsApi.getAdminAppointments).toHaveBeenCalledWith(expect.objectContaining({ scheduledFrom: second.from }), expect.any(AbortSignal)))
  })

  it('compartilha a chave-base invalidada pelo reagendamento', async () => {
    vi.mocked(appointmentsApi.getAdminAppointments).mockResolvedValue(response(1))
    const { client, Wrapper } = setup()
    const { result } = renderHook(() => useCalendarAppointments(getCalendarRange(new Date(2026, 7, 5), 'week')), { wrapper: Wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    await client.invalidateQueries({ queryKey: ['admin', 'appointments'] })
    await waitFor(() => expect(appointmentsApi.getAdminAppointments).toHaveBeenCalledTimes(2))
  })
})
