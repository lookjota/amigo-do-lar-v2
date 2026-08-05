import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthContext, type AuthContextValue } from '../../../auth/auth-context'
import * as api from './finance-admin-api'
import { financeKeys, useCreatePayment, useCreateQuote, useQuotes, useUpdatePaymentStatus, useUpdateQuote, useUpdateQuoteStatus } from './finance-hooks'

vi.mock('./finance-admin-api')
const id = '11111111-1111-4111-8111-111111111111'
const quote = { id, serviceRequestId: id, subtotalCents: 10000, discountCents: 0, totalCents: 10000, description: null, notes: null, status: 'DRAFT', validUntil: null, approvedAt: null, rejectedAt: null, cancelledAt: null, createdAt: '2026-08-05T12:00:00.000Z', updatedAt: '2026-08-05T12:00:00.000Z', serviceRequest: { id, status: 'QUOTED', description: 'Teste', customer: { id, name: 'Ana', phone: '61999999999', email: null }, service: { id, name: 'Elétrica', slug: 'eletrica', category: 'Casa' } }, paidTotalCents: 0, remainingCents: 10000, paymentStatus: 'UNPAID' } as const
const payment = { id, quoteId: id, amountCents: 1000, method: 'PIX', status: 'PENDING', paidAt: null, reference: null, notes: null, createdAt: quote.createdAt, updatedAt: quote.updatedAt } as const

function setup(role: 'ADMIN' | 'OPERATOR' = 'ADMIN') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  const auth: AuthContextValue = { status: 'authenticated', user: { id, name: 'Usuário', email: 'user@example.com', role }, login: vi.fn(), logout: vi.fn() }
  function Wrapper({ children }: PropsWithChildren) { return <AuthContext.Provider value={auth}><QueryClientProvider client={client}>{children}</QueryClientProvider></AuthContext.Provider> }
  return { client, Wrapper }
}

describe('finance hooks', () => {
  beforeEach(() => vi.clearAllMocks())
  it('expõe loading, erro, retry, sucesso e AbortSignal', async () => {
    vi.mocked(api.getQuotes).mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ data: [quote], pagination: { page: 1, limit: 20, total: 1, totalPages: 1 } })
    const { Wrapper } = setup(); const { result, unmount } = renderHook(() => useQuotes({ page: 1, limit: 20 }), { wrapper: Wrapper })
    expect(result.current.isPending).toBe(true); await waitFor(() => expect(result.current.isError).toBe(true)); await act(async () => { await result.current.refetch() }); await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(api.getQuotes).toHaveBeenCalledWith({ page: 1, limit: 20 }, expect.any(AbortSignal)); const signal = vi.mocked(api.getQuotes).mock.calls.at(-1)?.[1]; unmount(); expect(signal).toBeInstanceOf(AbortSignal)
  })

  it('invalida os caches exigidos após orçamento e pagamento', async () => {
    vi.mocked(api.createQuote).mockResolvedValue(quote); vi.mocked(api.updateQuote).mockResolvedValue(quote); vi.mocked(api.updateQuoteStatus).mockResolvedValue({ ...quote, status: 'SENT' }); vi.mocked(api.createPayment).mockResolvedValue(payment); vi.mocked(api.updatePaymentStatus).mockResolvedValue({ ...payment, status: 'PAID' })
    const { client, Wrapper } = setup(); const invalidate = vi.spyOn(client, 'invalidateQueries')
    const create = renderHook(() => useCreateQuote(), { wrapper: Wrapper }); const update = renderHook(() => useUpdateQuote(id), { wrapper: Wrapper }); const status = renderHook(() => useUpdateQuoteStatus(id), { wrapper: Wrapper }); const pay = renderHook(() => useCreatePayment(id), { wrapper: Wrapper }); const payStatus = renderHook(() => useUpdatePaymentStatus(id, id), { wrapper: Wrapper })
    await act(async () => { await create.result.current.mutateAsync({ serviceRequestId: id, subtotalCents: 10000 }); await update.result.current.mutateAsync({ notes: 'ok' }); await status.result.current.mutateAsync({ status: 'SENT' }); await pay.result.current.mutateAsync({ amountCents: 1000, method: 'PIX' }); await payStatus.result.current.mutateAsync({ status: 'PAID' }) })
    expect(invalidate).toHaveBeenCalledWith({ queryKey: financeKeys.quotes() }); expect(invalidate).toHaveBeenCalledWith({ queryKey: financeKeys.quote(id) }); expect(invalidate).toHaveBeenCalledWith({ queryKey: financeKeys.payments(id) }); expect(invalidate).toHaveBeenCalledWith({ queryKey: financeKeys.payment(id) })
  })

  it('ADMIN dispara mutações administrativas', async () => {
    vi.mocked(api.updateQuoteStatus).mockResolvedValue(quote); vi.mocked(api.createPayment).mockResolvedValue(payment); vi.mocked(api.updatePaymentStatus).mockResolvedValue(payment)
    const { Wrapper } = setup('ADMIN'); const status = renderHook(() => useUpdateQuoteStatus(id), { wrapper: Wrapper }); const create = renderHook(() => useCreatePayment(id), { wrapper: Wrapper }); const paymentStatus = renderHook(() => useUpdatePaymentStatus(id, id), { wrapper: Wrapper })
    await act(async () => { await status.result.current.mutateAsync({ status: 'SENT' }); await create.result.current.mutateAsync({ amountCents: 100, method: 'PIX' }); await paymentStatus.result.current.mutateAsync({ status: 'PAID' }) })
    expect(api.updateQuoteStatus).toHaveBeenCalledOnce(); expect(api.createPayment).toHaveBeenCalledOnce(); expect(api.updatePaymentStatus).toHaveBeenCalledOnce()
  })

  it('OPERATOR não dispara mutações administrativas mesmo se a hook for chamada', async () => {
    const { Wrapper } = setup('OPERATOR'); const status = renderHook(() => useUpdateQuoteStatus(id), { wrapper: Wrapper }); const create = renderHook(() => useCreatePayment(id), { wrapper: Wrapper }); const paymentStatus = renderHook(() => useUpdatePaymentStatus(id, id), { wrapper: Wrapper })
    await expect(status.result.current.mutateAsync({ status: 'SENT' })).rejects.toThrow('não autorizada'); await expect(create.result.current.mutateAsync({ amountCents: 100, method: 'PIX' })).rejects.toThrow('não autorizada'); await expect(paymentStatus.result.current.mutateAsync({ status: 'PAID' })).rejects.toThrow('não autorizada')
    expect(api.updateQuoteStatus).not.toHaveBeenCalled(); expect(api.createPayment).not.toHaveBeenCalled(); expect(api.updatePaymentStatus).not.toHaveBeenCalled()
  })
})
