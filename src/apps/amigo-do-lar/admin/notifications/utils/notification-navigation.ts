import type { Notification } from '../types/contracts'

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
function metadataQuoteId(metadata: unknown) {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return undefined
  const value = (metadata as Record<string, unknown>).quoteId
  return typeof value === 'string' && uuid.test(value) ? value : undefined
}
export function getNotificationTarget(notification: Notification) {
  if (notification.resourceType === 'SERVICE_REQUEST') return notification.resourceId ? `/admin/solicitacoes?request=${encodeURIComponent(notification.resourceId)}` : '/admin/solicitacoes'
  if (notification.resourceType === 'APPOINTMENT') return notification.resourceId ? `/admin/agenda?appointment=${encodeURIComponent(notification.resourceId)}` : '/admin/agenda'
  if (notification.resourceType === 'QUOTE') return notification.resourceId ? `/admin/financeiro?quote=${encodeURIComponent(notification.resourceId)}` : '/admin/financeiro'
  const quoteId = metadataQuoteId(notification.metadata)
  return quoteId ? `/admin/financeiro?quote=${encodeURIComponent(quoteId)}` : '/admin/financeiro'
}

