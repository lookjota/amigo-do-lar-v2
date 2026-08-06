import { authenticatedApiClient } from '../../../../api/apiClient'
import {
  timelineCommentSchema, timelineEventSchema, timelineFiltersSchema,
  timelineListResponseSchema, type TimelineComment, type TimelineEvent,
  type TimelineFilters, type TimelineListResponse,
} from '../types/contracts'

export function buildServiceRequestTimelinePath(serviceRequestId: string, filters: TimelineFilters) {
  const parsed = timelineFiltersSchema.parse(filters)
  const params = new URLSearchParams({ page: String(parsed.page), limit: String(parsed.limit), sortOrder: parsed.sortOrder })
  if (parsed.type) params.set('type', parsed.type)
  return `/service-requests/${encodeURIComponent(serviceRequestId)}/timeline?${params.toString()}`
}

export async function listServiceRequestTimeline(serviceRequestId: string, filters: TimelineFilters, signal?: AbortSignal): Promise<TimelineListResponse> {
  const response = await authenticatedApiClient.get<unknown>(buildServiceRequestTimelinePath(serviceRequestId, filters), { signal })
  return timelineListResponseSchema.parse(response)
}

export async function createServiceRequestComment(serviceRequestId: string, input: TimelineComment): Promise<TimelineEvent> {
  const payload = timelineCommentSchema.parse(input)
  const response = await authenticatedApiClient.post<unknown>(`/service-requests/${encodeURIComponent(serviceRequestId)}/comments`, payload)
  return timelineEventSchema.parse(response)
}
