import type { QueryClient } from '@tanstack/react-query'
import { notificationQueryKeys } from '../../../notifications/api/notification-query-keys'
import { adminServiceRequestsKey } from '../../api/useServiceRequests'
import { serviceRequestTimelineKey } from '../../timeline/api/useServiceRequestTimeline'
import { attachmentQueryKeys } from './attachment-query-keys'

export async function invalidateAttachmentQueries(client: QueryClient, id: string) {
  await Promise.all([
    client.invalidateQueries({ queryKey: attachmentQueryKeys.request(id) }),
    client.invalidateQueries({ queryKey: [...serviceRequestTimelineKey, id] }),
    client.invalidateQueries({ queryKey: [...adminServiceRequestsKey, 'detail', id] }),
    client.invalidateQueries({ queryKey: notificationQueryKeys.all }),
  ])
}
