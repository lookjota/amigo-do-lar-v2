import { z } from 'zod'

export const attachmentCategories = ['BEFORE_SERVICE', 'AFTER_SERVICE', 'RECEIPT', 'DOCUMENT', 'OTHER'] as const
export const attachmentCategorySchema = z.enum(attachmentCategories)
export const attachmentUploaderSchema = z.strictObject({
  id: z.uuid(), name: z.string(), email: z.email(), role: z.enum(['ADMIN', 'OPERATOR']),
})
export const serviceRequestAttachmentSchema = z.strictObject({
  id: z.uuid(), serviceRequestId: z.uuid(), category: attachmentCategorySchema,
  originalName: z.string(), mimeType: z.string(), sizeBytes: z.int().nonnegative(),
  checksum: z.string().nullable(), caption: z.string().nullable(), createdAt: z.iso.datetime(),
  uploadedBy: attachmentUploaderSchema,
})
export const attachmentPaginationSchema = z.strictObject({
  page: z.int().min(1), limit: z.int().min(1).max(100), total: z.int().nonnegative(), totalPages: z.int().nonnegative(),
})
export const attachmentFiltersSchema = z.strictObject({
  page: z.int().min(1), limit: z.int().min(1).max(100), category: attachmentCategorySchema.optional(),
  sortOrder: z.enum(['asc', 'desc']),
})
export const attachmentListResponseSchema = z.strictObject({ data: z.array(serviceRequestAttachmentSchema), pagination: attachmentPaginationSchema })
export const attachmentUploadResponseSchema = serviceRequestAttachmentSchema
export const attachmentDetailResponseSchema = serviceRequestAttachmentSchema

export type AttachmentCategory = z.infer<typeof attachmentCategorySchema>
export type ServiceRequestAttachment = z.infer<typeof serviceRequestAttachmentSchema>
export type AttachmentFilters = z.infer<typeof attachmentFiltersSchema>
export type AttachmentListResponse = z.infer<typeof attachmentListResponseSchema>
export interface UploadAttachmentInput {
  file: File
  category: AttachmentCategory
  caption?: string
  signal: AbortSignal
  onProgress?: (progress: number) => void
}
