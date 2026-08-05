import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { dashboardQueryKey } from '../../dashboard/api/useDashboardSummary'
import { adminServiceRequestsKey } from '../../service-requests/api/useServiceRequests'
import { hasRole } from '../../../auth/authorization'
import { useAuth } from '../../../auth/useAuth'
import { createPayment, createQuote, getPayment, getPayments, getQuote, getQuotes, updatePaymentStatus, updateQuote, updateQuoteStatus } from './finance-admin-api'
import type { CreatePaymentInput, CreateQuoteInput, QuoteFilters, UpdatePaymentStatusInput, UpdateQuoteInput, UpdateQuoteStatusInput } from '../types/contracts'

export const financeKeys = {
  all: ['admin', 'finance'] as const,
  quotes: () => ['admin', 'finance', 'quotes'] as const,
  quote: (id: string) => ['admin', 'finance', 'quotes', 'detail', id] as const,
  payments: (quoteId: string) => ['admin', 'finance', 'quotes', quoteId, 'payments'] as const,
  payment: (id: string) => ['admin', 'finance', 'payments', 'detail', id] as const,
}
async function invalidateQuote(client: QueryClient, id?: string, serviceRequestId?: string) {
  const tasks = [client.invalidateQueries({ queryKey: financeKeys.quotes() }), client.invalidateQueries({ queryKey: dashboardQueryKey }), client.invalidateQueries({ queryKey: adminServiceRequestsKey })]
  if (id) tasks.push(client.invalidateQueries({ queryKey: financeKeys.quote(id) }))
  if (serviceRequestId) tasks.push(client.invalidateQueries({ queryKey: [...adminServiceRequestsKey, 'detail', serviceRequestId] }))
  await Promise.all(tasks)
}
async function invalidatePayment(client: QueryClient, quoteId: string, paymentId?: string) {
  const tasks = [client.invalidateQueries({ queryKey: financeKeys.payments(quoteId) }), client.invalidateQueries({ queryKey: financeKeys.quote(quoteId) }), client.invalidateQueries({ queryKey: financeKeys.quotes() }), client.invalidateQueries({ queryKey: dashboardQueryKey })]
  if (paymentId) tasks.push(client.invalidateQueries({ queryKey: financeKeys.payment(paymentId) }))
  await Promise.all(tasks)
}
const browser = typeof window !== 'undefined'
export function useQuotes(filters: QuoteFilters) { return useQuery({ queryKey: [...financeKeys.quotes(), filters], queryFn: ({ signal }) => getQuotes(filters, signal), enabled: browser, placeholderData: (previous) => previous }) }
export function useQuote(id: string) { return useQuery({ queryKey: financeKeys.quote(id), queryFn: ({ signal }) => getQuote(id, signal), enabled: browser && Boolean(id) }) }
export function usePayments(quoteId: string) { return useQuery({ queryKey: financeKeys.payments(quoteId), queryFn: ({ signal }) => getPayments(quoteId, signal), enabled: browser && Boolean(quoteId) }) }
export function usePayment(id: string) { return useQuery({ queryKey: financeKeys.payment(id), queryFn: ({ signal }) => getPayment(id, signal), enabled: browser && Boolean(id) }) }
export function useCreateQuote() { const client = useQueryClient(); return useMutation({ mutationFn: (input: CreateQuoteInput) => createQuote(input), retry: false, onSuccess: (quote) => invalidateQuote(client, quote.id, quote.serviceRequestId) }) }
export function useUpdateQuote(id: string) { const client = useQueryClient(); return useMutation({ mutationFn: (input: UpdateQuoteInput) => updateQuote(id, input), retry: false, onSuccess: (quote) => invalidateQuote(client, quote.id, quote.serviceRequestId) }) }
export function useUpdateQuoteStatus(id: string) { const client = useQueryClient(); const auth = useAuth(); return useMutation({ mutationFn: (input: UpdateQuoteStatusInput) => { if (!hasRole(auth.user, ['ADMIN'])) throw new Error('Ação administrativa não autorizada.'); return updateQuoteStatus(id, input) }, retry: false, onSuccess: (quote) => invalidateQuote(client, quote.id, quote.serviceRequestId) }) }
export function useCreatePayment(quoteId: string) { const client = useQueryClient(); const auth = useAuth(); return useMutation({ mutationFn: (input: CreatePaymentInput) => { if (!hasRole(auth.user, ['ADMIN'])) throw new Error('Ação administrativa não autorizada.'); return createPayment(quoteId, input) }, retry: false, onSuccess: (payment) => invalidatePayment(client, quoteId, payment.id) }) }
export function useUpdatePaymentStatus(quoteId: string, id: string) { const client = useQueryClient(); const auth = useAuth(); return useMutation({ mutationFn: (input: UpdatePaymentStatusInput) => { if (!hasRole(auth.user, ['ADMIN'])) throw new Error('Ação administrativa não autorizada.'); return updatePaymentStatus(id, input) }, retry: false, onSuccess: (payment) => invalidatePayment(client, quoteId, payment.id) }) }
