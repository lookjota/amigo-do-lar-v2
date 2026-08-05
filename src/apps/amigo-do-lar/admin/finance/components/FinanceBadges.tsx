import type { PaymentStatus, QuoteStatus } from '../types/contracts'
import { paymentLabels, quoteLabels } from './labels'
export function QuoteStatusBadge({ status }: { status: QuoteStatus }) { return <span className={`amigo-admin-status amigo-admin-status-${status.toLowerCase()}`}>{quoteLabels[status]}</span> }
export function PaymentStatusBadge({ status }: { status: PaymentStatus }) { return <span className={`amigo-admin-status amigo-admin-status-${status.toLowerCase()}`}>{paymentLabels[status]}</span> }
