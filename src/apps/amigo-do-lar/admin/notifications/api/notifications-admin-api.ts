import { authenticatedApiClient } from '../../../api/apiClient'
import { markAllNotificationsReadResponseSchema, notificationFiltersSchema, notificationListResponseSchema, notificationSchema, unreadNotificationCountSchema, type Notification, type NotificationFilters, type NotificationListResponse } from '../types/contracts'

export function buildNotificationsPath(filters: NotificationFilters) {
  const parsed = notificationFiltersSchema.parse(filters)
  const params = new URLSearchParams({ page: String(parsed.page), limit: String(parsed.limit), sortOrder: parsed.sortOrder })
  if (parsed.unreadOnly) params.set('unreadOnly', 'true')
  if (parsed.type) params.set('type', parsed.type)
  if (parsed.resourceType) params.set('resourceType', parsed.resourceType)
  return `/notifications?${params.toString()}`
}

export async function listNotifications(filters: NotificationFilters, signal?: AbortSignal): Promise<NotificationListResponse> {
  return notificationListResponseSchema.parse(await authenticatedApiClient.get<unknown>(buildNotificationsPath(filters), { signal }))
}
export async function getUnreadNotificationCount(signal?: AbortSignal) {
  return unreadNotificationCountSchema.parse(await authenticatedApiClient.get<unknown>('/notifications/unread-count', { signal }))
}
export async function markNotificationAsRead(id: string): Promise<Notification> {
  return notificationSchema.parse(await authenticatedApiClient.patch<unknown>(`/notifications/${encodeURIComponent(id)}/read`, {}))
}
export async function markAllNotificationsAsRead() {
  return markAllNotificationsReadResponseSchema.parse(await authenticatedApiClient.patch<unknown>('/notifications/read-all', {}))
}

