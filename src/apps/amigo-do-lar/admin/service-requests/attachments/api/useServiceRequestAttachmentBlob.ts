import { useQuery } from '@tanstack/react-query'
import { attachmentQueryKeys } from './attachment-query-keys'
import { getServiceRequestAttachmentBlob } from './service-request-attachments-api'

export function useServiceRequestAttachmentBlob(serviceRequestId: string, attachmentId: string, enabled = true) {
  return useQuery({
    queryKey: [...attachmentQueryKeys.detail(serviceRequestId, attachmentId), 'blob'],
    queryFn: ({ signal }) => getServiceRequestAttachmentBlob(serviceRequestId, attachmentId, signal),
    enabled: typeof window !== 'undefined' && enabled,
    staleTime: 5 * 60 * 1000,
  })
}
