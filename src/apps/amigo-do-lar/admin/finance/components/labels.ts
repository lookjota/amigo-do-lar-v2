import type { PaymentMethod, PaymentStatus, QuoteStatus } from '../types/contracts'
export const quoteLabels: Record<QuoteStatus, string> = { DRAFT: 'Rascunho', SENT: 'Enviado', APPROVED: 'Aprovado', REJECTED: 'Rejeitado', CANCELLED: 'Cancelado' }
export const paymentLabels: Record<PaymentStatus, string> = { PENDING: 'Pendente', PAID: 'Pago', CANCELLED: 'Cancelado', REFUNDED: 'Reembolsado' }
export const methodLabels: Record<PaymentMethod, string> = { PIX: 'PIX', CASH: 'Dinheiro', CREDIT_CARD: 'Cartão de crédito', DEBIT_CARD: 'Cartão de débito', BANK_TRANSFER: 'Transferência bancária', OTHER: 'Outro' }
