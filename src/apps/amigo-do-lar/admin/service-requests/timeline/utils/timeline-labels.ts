import { appointmentStatusLabels } from '../../../appointments/types/contracts'
import { paymentLabels, quoteLabels } from '../../../finance/components/labels'
import { serviceRequestStatusLabels } from '../../types/contracts'
import type { TimelineEventType } from '../types/contracts'

export const timelineTypeLabels: Record<TimelineEventType, string> = {
  REQUEST_CREATED: 'Solicitação criada', STATUS_CHANGED: 'Status alterado', COMMENT_ADDED: 'Comentário interno',
  APPOINTMENT_CREATED: 'Agendamento criado', APPOINTMENT_RESCHEDULED: 'Agendamento reagendado',
  APPOINTMENT_STATUS_CHANGED: 'Status do agendamento alterado', QUOTE_CREATED: 'Orçamento criado',
  QUOTE_STATUS_CHANGED: 'Status do orçamento alterado', PAYMENT_CREATED: 'Pagamento registrado',
  PAYMENT_STATUS_CHANGED: 'Status do pagamento alterado',
}

export const timelineTypeOptions = timelineTypeLabels
export { appointmentStatusLabels, paymentLabels, quoteLabels, serviceRequestStatusLabels }
