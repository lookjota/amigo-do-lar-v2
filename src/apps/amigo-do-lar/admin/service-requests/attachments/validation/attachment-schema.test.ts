import { describe, expect, it } from 'vitest'
import { attachmentCategories } from '../types/contracts'
import { attachmentCategoryLabels } from '../utils/attachment-labels'
import { attachmentFileSchema, attachmentUploadInputSchema } from './attachment-schema'

describe('attachmentUploadInputSchema', () => {
  it.each(['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])('aceita %s', (type) => {
    expect(attachmentFileSchema.safeParse(new File(['content'], 'file.bin', { type })).success).toBe(true)
  })
  it.each(['image/svg+xml', 'text/html'])('rejeita %s', (type) => {
    expect(attachmentFileSchema.safeParse(new File(['content'], 'file.bin', { type })).success).toBe(false)
  })
  it('rejeita vazio, arquivo acima de 10 MB e legenda longa', () => {
    expect(attachmentFileSchema.safeParse(new File([], 'empty.png', { type: 'image/png' })).success).toBe(false)
    expect(attachmentFileSchema.safeParse(new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'large.png', { type: 'image/png' })).success).toBe(false)
    expect(attachmentUploadInputSchema.safeParse({ file: new File(['x'], 'x.webp', { type: 'image/webp' }), category: 'DOCUMENT', caption: 'x'.repeat(501), signal: new AbortController().signal }).success).toBe(false)
  })
  it.each(['BEFORE_SERVICE', 'AFTER_SERVICE', 'RECEIPT', 'DOCUMENT', 'OTHER'])('aceita a categoria %s', (category) => {
    expect(attachmentUploadInputSchema.safeParse({ file: new File(['x'], 'x.png', { type: 'image/png' }), category, signal: new AbortController().signal }).success).toBe(true)
  })
  it('expõe exatamente as cinco categorias do backend e o rótulo de documento', () => {
    expect(attachmentCategories).toEqual(['BEFORE_SERVICE', 'AFTER_SERVICE', 'RECEIPT', 'DOCUMENT', 'OTHER'])
    expect(attachmentCategoryLabels.DOCUMENT).toBe('Documento')
  })
})
