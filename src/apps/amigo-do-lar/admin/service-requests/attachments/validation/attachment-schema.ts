import { z } from 'zod'
import { attachmentCategorySchema } from '../types/contracts'

export const ATTACHMENT_MAX_SIZE = 10 * 1024 * 1024
export const allowedAttachmentTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'] as const
export const attachmentFileSchema = z.instanceof(File)
  .refine((file) => file.size > 0, 'O arquivo não pode estar vazio.')
  .refine((file) => file.size <= ATTACHMENT_MAX_SIZE, 'O arquivo deve ter no máximo 10 MB.')
  .refine((file) => allowedAttachmentTypes.some((type) => type === file.type), 'Envie uma imagem JPEG, PNG ou WebP ou um documento PDF.')
export const attachmentUploadInputSchema = z.strictObject({
  file: attachmentFileSchema,
  category: attachmentCategorySchema,
  caption: z.string().trim().max(500, 'A legenda deve ter no máximo 500 caracteres.').optional(),
  signal: z.instanceof(AbortSignal),
  onProgress: z.function().optional(),
})
