import { z } from 'zod'

export const quoteStatuses = ['DRAFT', 'SENT', 'APPROVED', 'REJECTED', 'CANCELLED'] as const
export const paymentStatuses = ['PENDING', 'PAID', 'CANCELLED', 'REFUNDED'] as const
export const paymentMethods = ['PIX', 'CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'OTHER'] as const
export const paymentSituations = ['UNPAID', 'PARTIALLY_PAID', 'PAID'] as const
export const quoteStatusSchema = z.enum(quoteStatuses)
export const paymentStatusSchema = z.enum(paymentStatuses)
export const paymentMethodSchema = z.enum(paymentMethods)
export const paymentSituationSchema = z.enum(paymentSituations)
export type QuoteStatus = z.infer<typeof quoteStatusSchema>
export type PaymentStatus = z.infer<typeof paymentStatusSchema>
export type PaymentMethod = z.infer<typeof paymentMethodSchema>

const nullableDate = z.iso.datetime().nullable()
const cents = z.number().int().nonnegative().safe()
const serviceRequestStatusSchema = z.enum(['PENDING', 'CONTACTED', 'QUOTED', 'APPROVED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
const customer = z.object({ id: z.uuid(), name: z.string(), phone: z.string(), email: z.string().nullable() }).strict()
const service = z.object({ id: z.uuid(), name: z.string(), slug: z.string(), category: z.string() }).strict()
const serviceRequest = z.object({ id: z.uuid(), status: serviceRequestStatusSchema, description: z.string(), customer, service }).strict()

export const quoteSchema = z.object({
  id: z.uuid(), serviceRequestId: z.uuid(), subtotalCents: cents, discountCents: cents,
  totalCents: cents, description: z.string().nullable(), notes: z.string().nullable(), status: quoteStatusSchema,
  validUntil: nullableDate, approvedAt: nullableDate, rejectedAt: nullableDate, cancelledAt: nullableDate,
  createdAt: z.iso.datetime(), updatedAt: z.iso.datetime(), serviceRequest,
  paidTotalCents: cents, remainingCents: cents, paymentStatus: paymentSituationSchema,
}).strict()
export const paymentSchema = z.object({
  id: z.uuid(), quoteId: z.uuid(), amountCents: cents.positive(), method: paymentMethodSchema,
  status: paymentStatusSchema, paidAt: nullableDate, reference: z.string().nullable(), notes: z.string().nullable(),
  createdAt: z.iso.datetime(), updatedAt: z.iso.datetime(),
}).strict()
const pagination = z.object({ page: z.number().int().min(1), limit: z.number().int().min(1).max(100), total: z.number().int().nonnegative(), totalPages: z.number().int().nonnegative() }).strict()
export const quotesResponseSchema = z.object({ data: z.array(quoteSchema), pagination }).strict()
export const paymentsResponseSchema = z.array(paymentSchema)

export const createQuoteSchema = z.object({ serviceRequestId: z.uuid(), subtotalCents: cents, discountCents: cents.optional(), description: z.string().max(2000).optional(), notes: z.string().max(4000).optional(), validUntil: nullableDate.optional() }).strict()
export const updateQuoteSchema = z.object({ subtotalCents: cents.optional(), discountCents: cents.optional(), description: z.string().max(2000).nullable().optional(), notes: z.string().max(4000).nullable().optional(), validUntil: nullableDate.optional() }).strict().refine((value) => Object.values(value).some((item) => item !== undefined), 'Informe ao menos uma alteração.')
export const updateQuoteStatusSchema = z.object({ status: z.enum(['SENT', 'APPROVED', 'REJECTED', 'CANCELLED']) }).strict()
export const createPaymentSchema = z.object({ amountCents: cents.positive(), method: paymentMethodSchema, status: z.enum(['PENDING', 'PAID']).optional(), paidAt: nullableDate.optional(), reference: z.string().max(300).optional(), notes: z.string().max(4000).optional() }).strict()
export const updatePaymentStatusSchema = z.object({ status: z.enum(['PAID', 'CANCELLED', 'REFUNDED']), paidAt: nullableDate.optional() }).strict()

export type Quote = z.infer<typeof quoteSchema>
export type Payment = z.infer<typeof paymentSchema>
export type QuotesResponse = z.infer<typeof quotesResponseSchema>
export type PaymentsResponse = z.infer<typeof paymentsResponseSchema>
export type CreateQuoteInput = z.infer<typeof createQuoteSchema>
export type UpdateQuoteInput = z.infer<typeof updateQuoteSchema>
export type UpdateQuoteStatusInput = z.infer<typeof updateQuoteStatusSchema>
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>
export type UpdatePaymentStatusInput = z.infer<typeof updatePaymentStatusSchema>
export interface QuoteFilters { page: number; limit: number; status?: QuoteStatus; serviceRequestId?: string; customerId?: string; createdFrom?: string; createdTo?: string; validUntilFrom?: string; validUntilTo?: string; orderBy?: 'createdAt' | 'updatedAt' | 'validUntil' | 'status' | 'totalCents'; sortOrder?: 'asc' | 'desc' }
