import type { NotificationFilters } from '../types/contracts'

export const notificationQueryKeys = {
  all: ['admin', 'notifications'] as const,
  lists: () => ['admin', 'notifications', 'list'] as const,
  list: (filters: NotificationFilters) => ['admin', 'notifications', 'list', filters] as const,
  unreadCount: () => ['admin', 'notifications', 'unread-count'] as const,
}

