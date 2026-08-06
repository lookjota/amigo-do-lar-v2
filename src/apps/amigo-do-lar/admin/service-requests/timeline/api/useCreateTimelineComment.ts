import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminServiceRequestsKey } from '../../api/useServiceRequests'
import { createServiceRequestComment } from './service-request-timeline-api'
import { serviceRequestTimelineKey } from './useServiceRequestTimeline'
import type { TimelineComment } from '../types/contracts'

export function useCreateTimelineComment(id: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (input: TimelineComment) => createServiceRequestComment(id, input), retry: false,
    onSuccess: async () => Promise.all([
      client.invalidateQueries({ queryKey: [...serviceRequestTimelineKey, id] }),
      client.invalidateQueries({ queryKey: [...adminServiceRequestsKey, 'detail', id] }),
    ]),
  })
}
