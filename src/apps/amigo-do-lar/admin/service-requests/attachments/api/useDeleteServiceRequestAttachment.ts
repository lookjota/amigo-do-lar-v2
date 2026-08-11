import { useMutation, useQueryClient } from '@tanstack/react-query'
import { invalidateAttachmentQueries } from './invalidateAttachmentQueries'
import { deleteServiceRequestAttachment } from './service-request-attachments-api'

export function useDeleteServiceRequestAttachment(id: string) {
  const client = useQueryClient()
  return useMutation({ mutationFn: ({ attachmentId, signal }: { attachmentId: string; signal: AbortSignal }) => deleteServiceRequestAttachment(id, attachmentId, signal), retry: false, onSuccess: () => invalidateAttachmentQueries(client, id) })
}
