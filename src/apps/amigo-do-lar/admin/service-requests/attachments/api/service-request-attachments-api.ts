import { authenticatedApiClient } from '../../../../api/apiClient'
import { HttpError } from '../../../../../../shared/http'
import { attachmentDetailResponseSchema, attachmentFiltersSchema, attachmentListResponseSchema, attachmentUploadResponseSchema, type AttachmentFilters, type AttachmentListResponse, type ServiceRequestAttachment, type UploadAttachmentInput } from '../types/contracts'
import { attachmentUploadInputSchema } from '../validation/attachment-schema'
import { sanitizeDownloadFilename } from '../utils/attachment-labels'

const basePath = (id: string) => `/service-requests/${encodeURIComponent(id)}/attachments`
export function buildAttachmentListPath(id: string, filters: AttachmentFilters) {
  const parsed = attachmentFiltersSchema.parse(filters)
  const params = new URLSearchParams({ page: String(parsed.page), limit: String(parsed.limit), sortOrder: parsed.sortOrder })
  if (parsed.category) params.set('category', parsed.category)
  return `${basePath(id)}?${params.toString()}`
}
export async function listServiceRequestAttachments(id: string, filters: AttachmentFilters, signal: AbortSignal): Promise<AttachmentListResponse> {
  return attachmentListResponseSchema.parse(await authenticatedApiClient.get<unknown>(buildAttachmentListPath(id, filters), { signal }))
}
export async function getServiceRequestAttachment(id: string, attachmentId: string, signal: AbortSignal): Promise<ServiceRequestAttachment> {
  return attachmentDetailResponseSchema.parse(await authenticatedApiClient.get<unknown>(`${basePath(id)}/${encodeURIComponent(attachmentId)}`, { signal }))
}
export async function uploadServiceRequestAttachment(id: string, input: UploadAttachmentInput): Promise<ServiceRequestAttachment> {
  const parsed = attachmentUploadInputSchema.parse(input)
  const form = new FormData()
  form.append('file', parsed.file)
  form.append('category', parsed.category)
  if (parsed.caption) form.append('caption', parsed.caption)
  input.onProgress?.(10)
  const response = await authenticatedApiClient.post<unknown>(basePath(id), form, { signal: parsed.signal })
  input.onProgress?.(100)
  return attachmentUploadResponseSchema.parse(response)
}
export async function deleteServiceRequestAttachment(id: string, attachmentId: string, signal: AbortSignal): Promise<void> {
  await authenticatedApiClient.delete(`${basePath(id)}/${encodeURIComponent(attachmentId)}`, { signal })
}
export async function getServiceRequestAttachmentBlob(id: string, attachmentId: string, signal: AbortSignal): Promise<Blob> {
  const response = await authenticatedApiClient.raw('GET', `${basePath(id)}/${encodeURIComponent(attachmentId)}/download`, { signal })
  if (!response.ok) throw new HttpError({ status: response.status, statusText: response.statusText, responseBody: undefined, url: response.url, method: 'GET' })
  return response.blob()
}
export async function downloadServiceRequestAttachment(id: string, attachment: Pick<ServiceRequestAttachment, 'id' | 'originalName'>, signal: AbortSignal): Promise<void> {
  const blob = await getServiceRequestAttachmentBlob(id, attachment.id, signal)
  const url = URL.createObjectURL(blob)
  try {
    const link = document.createElement('a')
    link.href = url
    link.download = sanitizeDownloadFilename(attachment.originalName)
    link.rel = 'noopener'
    link.click()
  } finally {
    URL.revokeObjectURL(url)
  }
}
