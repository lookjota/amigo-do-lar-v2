import type { NotificationResourceType, NotificationType } from '../types/contracts'

export const notificationTypeLabels: Record<NotificationType, string> = {
  SERVICE_REQUEST_CREATED: 'Nova solicitação', SERVICE_REQUEST_STATUS_CHANGED: 'Status da solicitação', COMMENT_ADDED: 'Comentário interno', APPOINTMENT_CREATED: 'Novo agendamento', APPOINTMENT_RESCHEDULED: 'Agendamento reagendado', APPOINTMENT_STATUS_CHANGED: 'Status do agendamento', QUOTE_CREATED: 'Novo orçamento', QUOTE_STATUS_CHANGED: 'Status do orçamento', PAYMENT_CREATED: 'Novo pagamento', PAYMENT_STATUS_CHANGED: 'Status do pagamento',
  ATTACHMENT_ADDED: 'Anexo adicionado', ATTACHMENT_REMOVED: 'Anexo removido',
}
export const notificationResourceLabels: Record<NotificationResourceType, string> = { SERVICE_REQUEST: 'Solicitação', APPOINTMENT: 'Agendamento', QUOTE: 'Orçamento', PAYMENT: 'Pagamento' }
