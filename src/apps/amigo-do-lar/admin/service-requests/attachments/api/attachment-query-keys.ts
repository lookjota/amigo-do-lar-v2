import type { AttachmentFilters } from '../types/contracts'

export const attachmentQueryKeys = {
  all: ['admin', 'service-requests', 'attachments'] as const,
  request: (id: string) => ['admin', 'service-requests', 'attachments', id] as const,
  list: (id: string, filters: AttachmentFilters) => ['admin', 'service-requests', 'attachments', id, 'list', filters] as const,
  detail: (id: string, attachmentId: string) => ['admin', 'service-requests', 'attachments', id, 'detail', attachmentId] as const,
}
