import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UploadAttachmentInput } from '../types/contracts'
import { invalidateAttachmentQueries } from './invalidateAttachmentQueries'
import { uploadServiceRequestAttachment } from './service-request-attachments-api'

export function useUploadServiceRequestAttachment(id: string) {
  const client = useQueryClient()
  return useMutation({ mutationFn: (input: UploadAttachmentInput) => uploadServiceRequestAttachment(id, input), retry: false, onSuccess: () => invalidateAttachmentQueries(client, id) })
}
