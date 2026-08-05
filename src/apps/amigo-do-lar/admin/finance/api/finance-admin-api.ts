import { authenticatedApiClient } from '../../../api/apiClient'
import { createPaymentSchema, createQuoteSchema, paymentSchema, paymentsResponseSchema, quoteSchema, quotesResponseSchema, updatePaymentStatusSchema, updateQuoteSchema, updateQuoteStatusSchema, type CreatePaymentInput, type CreateQuoteInput, type Payment, type PaymentsResponse, type Quote, type QuoteFilters, type QuotesResponse, type UpdatePaymentStatusInput, type UpdateQuoteInput, type UpdateQuoteStatusInput } from '../types/contracts'

export function buildQuotesPath(filters: QuoteFilters) {
  const params = new URLSearchParams({ page: String(filters.page), limit: String(filters.limit) })
  const optional = { status: filters.status, serviceRequestId: filters.serviceRequestId, customerId: filters.customerId, createdFrom: filters.createdFrom, createdTo: filters.createdTo, validUntilFrom: filters.validUntilFrom, validUntilTo: filters.validUntilTo, orderBy: filters.orderBy, sortOrder: filters.sortOrder }
  Object.entries(optional).forEach(([key, value]) => { if (value) params.set(key, value) })
  return `/quotes?${params.toString()}`
}
export async function getQuotes(filters: QuoteFilters, signal?: AbortSignal): Promise<QuotesResponse> { return quotesResponseSchema.parse(await authenticatedApiClient.get<unknown>(buildQuotesPath(filters), { signal })) }
export async function getQuote(id: string, signal?: AbortSignal): Promise<Quote> { return quoteSchema.parse(await authenticatedApiClient.get<unknown>(`/quotes/${encodeURIComponent(id)}`, { signal })) }
export async function createQuote(input: CreateQuoteInput, signal?: AbortSignal): Promise<Quote> { return quoteSchema.parse(await authenticatedApiClient.post<unknown>('/quotes', createQuoteSchema.parse(input), { signal })) }
export async function updateQuote(id: string, input: UpdateQuoteInput, signal?: AbortSignal): Promise<Quote> { return quoteSchema.parse(await authenticatedApiClient.patch<unknown>(`/quotes/${encodeURIComponent(id)}`, updateQuoteSchema.parse(input), { signal })) }
export async function updateQuoteStatus(id: string, input: UpdateQuoteStatusInput, signal?: AbortSignal): Promise<Quote> { return quoteSchema.parse(await authenticatedApiClient.patch<unknown>(`/quotes/${encodeURIComponent(id)}/status`, updateQuoteStatusSchema.parse(input), { signal })) }
export async function getPayments(quoteId: string, signal?: AbortSignal): Promise<PaymentsResponse> { return paymentsResponseSchema.parse(await authenticatedApiClient.get<unknown>(`/quotes/${encodeURIComponent(quoteId)}/payments`, { signal })) }
export async function getPayment(id: string, signal?: AbortSignal): Promise<Payment> { return paymentSchema.parse(await authenticatedApiClient.get<unknown>(`/payments/${encodeURIComponent(id)}`, { signal })) }
export async function createPayment(quoteId: string, input: CreatePaymentInput, signal?: AbortSignal): Promise<Payment> { return paymentSchema.parse(await authenticatedApiClient.post<unknown>(`/quotes/${encodeURIComponent(quoteId)}/payments`, createPaymentSchema.parse(input), { signal })) }
export async function updatePaymentStatus(id: string, input: UpdatePaymentStatusInput, signal?: AbortSignal): Promise<Payment> { return paymentSchema.parse(await authenticatedApiClient.patch<unknown>(`/payments/${encodeURIComponent(id)}/status`, updatePaymentStatusSchema.parse(input), { signal })) }
