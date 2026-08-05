import type { PaymentStatus, QuoteStatus } from '../types/contracts'
export const quoteTransitions: Record<QuoteStatus, readonly QuoteStatus[]> = { DRAFT: ['SENT', 'CANCELLED'], SENT: ['APPROVED', 'REJECTED', 'CANCELLED'], APPROVED: ['CANCELLED'], REJECTED: [], CANCELLED: [] }
export const paymentTransitions: Record<PaymentStatus, readonly PaymentStatus[]> = { PENDING: ['PAID', 'CANCELLED'], PAID: ['REFUNDED'], CANCELLED: [], REFUNDED: [] }
