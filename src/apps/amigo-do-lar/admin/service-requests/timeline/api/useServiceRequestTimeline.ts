import { useInfiniteQuery } from '@tanstack/react-query'
import { listServiceRequestTimeline } from './service-request-timeline-api'
import type { TimelineEventType, TimelineSortOrder } from '../types/contracts'

export const serviceRequestTimelineKey = ['admin', 'service-requests', 'timeline'] as const
export const serviceRequestTimelineListKey = (id: string, type?: TimelineEventType, sortOrder: TimelineSortOrder = 'desc') => [...serviceRequestTimelineKey, id, { type, sortOrder }] as const

export function useServiceRequestTimeline(id: string, type?: TimelineEventType, sortOrder: TimelineSortOrder = 'desc') {
  return useInfiniteQuery({
    queryKey: serviceRequestTimelineListKey(id, type, sortOrder),
    queryFn: ({ pageParam, signal }) => listServiceRequestTimeline(id, { page: pageParam, limit: 10, type, sortOrder }, signal),
    initialPageParam: 1,
    getNextPageParam: (last) => last.pagination.page < last.pagination.totalPages ? last.pagination.page + 1 : undefined,
    enabled: typeof window !== 'undefined' && Boolean(id),
  })
}
