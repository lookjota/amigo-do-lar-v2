import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { getUnreadNotificationCount, listNotifications, markAllNotificationsAsRead, markNotificationAsRead } from './notifications-admin-api'
import { notificationQueryKeys } from './notification-query-keys'
import type { NotificationFilters } from '../types/contracts'

const browser = typeof window !== 'undefined'
export function useNotifications(filters: NotificationFilters, enabled = true) {
  return useQuery({ queryKey: notificationQueryKeys.list(filters), queryFn: ({ signal }) => listNotifications(filters, signal), enabled: browser && enabled, placeholderData: (previous) => previous })
}
export function useUnreadNotificationCount() {
  return useQuery({ queryKey: notificationQueryKeys.unreadCount(), queryFn: ({ signal }) => getUnreadNotificationCount(signal), enabled: browser, staleTime: 60_000, refetchOnWindowFocus: true })
}
export async function invalidateNotificationQueries(client: QueryClient) {
  await Promise.all([client.invalidateQueries({ queryKey: notificationQueryKeys.lists() }), client.invalidateQueries({ queryKey: notificationQueryKeys.unreadCount() })])
}
export function useMarkNotificationAsRead() {
  const client = useQueryClient()
  return useMutation({ mutationFn: markNotificationAsRead, retry: false, onSuccess: () => invalidateNotificationQueries(client) })
}
export function useMarkAllNotificationsAsRead() {
  const client = useQueryClient()
  return useMutation({ mutationFn: markAllNotificationsAsRead, retry: false, onSuccess: async () => { client.setQueryData(notificationQueryKeys.unreadCount(), { count: 0 }); await invalidateNotificationQueries(client) } })
}

