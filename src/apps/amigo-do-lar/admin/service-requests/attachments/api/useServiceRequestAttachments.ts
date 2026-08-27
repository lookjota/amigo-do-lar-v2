import { useQuery } from '@tanstack/react-query'
import type { AttachmentFilters } from '../types/contracts'
import { attachmentQueryKeys } from './attachment-query-keys'
import { listServiceRequestAttachments } from './service-request-attachments-api'

export function useServiceRequestAttachments(id: string, filters: AttachmentFilters) {
  return useQuery({
    queryKey: attachmentQueryKeys.list(id, filters),
    queryFn: ({ signal }) => listServiceRequestAttachments(id, filters, signal),
    enabled: typeof window !== 'undefined' && Boolean(id),
  })
}
