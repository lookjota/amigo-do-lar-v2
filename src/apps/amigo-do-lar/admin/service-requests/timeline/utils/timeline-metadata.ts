import type { AppointmentStatus } from '../../../appointments/types/contracts'
import type { PaymentStatus, QuoteStatus } from '../../../finance/types/contracts'
import type { ServiceRequestStatus } from '../../types/contracts'
import type { TimelineEvent } from '../types/contracts'
import { appointmentStatusLabels, paymentLabels, quoteLabels, serviceRequestStatusLabels } from './timeline-labels'
import { attachmentCategoryLabels } from '../../attachments/utils/attachment-labels'

const dateTime = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
const format = (value: string) => dateTime.format(new Date(value))

export function timelineMetadataDescription(event: TimelineEvent): string | null {
  if (!event.metadataValid || !event.metadata) return null
  switch (event.type) {
    case 'STATUS_CHANGED': {
      const value = event.metadata as { from: ServiceRequestStatus; to: ServiceRequestStatus }
      return `${serviceRequestStatusLabels[value.from]} → ${serviceRequestStatusLabels[value.to]}`
    }
    case 'APPOINTMENT_CREATED': return `Agendado para ${format((event.metadata as { scheduledAt: string }).scheduledAt)}`
    case 'APPOINTMENT_RESCHEDULED': {
      const value = event.metadata as { scheduledAtFrom: string; scheduledAtTo: string }
      return `De ${format(value.scheduledAtFrom)} para ${format(value.scheduledAtTo)}`
    }
    case 'APPOINTMENT_STATUS_CHANGED': {
      const value = event.metadata as { from: AppointmentStatus; to: AppointmentStatus }
      return `${appointmentStatusLabels[value.from]} → ${appointmentStatusLabels[value.to]}`
    }
    case 'QUOTE_STATUS_CHANGED': {
      const value = event.metadata as { from: QuoteStatus; to: QuoteStatus }
      return `${quoteLabels[value.from]} → ${quoteLabels[value.to]}`
    }
    case 'PAYMENT_STATUS_CHANGED': {
      const value = event.metadata as { from: PaymentStatus; to: PaymentStatus }
      return `${paymentLabels[value.from]} → ${paymentLabels[value.to]}`
    }
    case 'QUOTE_CREATED': return 'Orçamento vinculado à solicitação'
    case 'PAYMENT_CREATED': return 'Pagamento vinculado ao orçamento'
    case 'ATTACHMENT_ADDED': {
      const value = event.metadata as { category: keyof typeof attachmentCategoryLabels; mimeType: string }
      return `${value.mimeType.startsWith('image/') ? 'Imagem' : 'Documento'} adicionada — ${attachmentCategoryLabels[value.category]}`
    }
    case 'ATTACHMENT_REMOVED': {
      const value = event.metadata as { category: keyof typeof attachmentCategoryLabels }
      return `Documento removido — ${attachmentCategoryLabels[value.category]}`
    }
    default: return null
  }
}

export function timelineRelatedLink(event: TimelineEvent): { to: string; label: string } | null {
  if (!event.metadataValid || !event.metadata) return null
  if (event.type === 'APPOINTMENT_CREATED' || event.type === 'APPOINTMENT_RESCHEDULED' || event.type === 'APPOINTMENT_STATUS_CHANGED') {
    const id = (event.metadata as { appointmentId: string }).appointmentId
    return { to: `/admin/agenda?appointment=${encodeURIComponent(id)}`, label: 'Abrir agendamento' }
  }
  if (event.type === 'QUOTE_CREATED' || event.type === 'QUOTE_STATUS_CHANGED') {
    const id = (event.metadata as { quoteId: string }).quoteId
    return { to: `/admin/financeiro?quote=${encodeURIComponent(id)}`, label: 'Abrir orçamento' }
  }
  if (event.type === 'PAYMENT_CREATED' || event.type === 'PAYMENT_STATUS_CHANGED') {
    const id = (event.metadata as { quoteId: string }).quoteId
    return { to: `/admin/financeiro?quote=${encodeURIComponent(id)}`, label: 'Abrir orçamento relacionado' }
  }
  if (event.type === 'ATTACHMENT_ADDED') return { to: '#service-request-attachments', label: 'Abrir anexos' }
  return null
}
