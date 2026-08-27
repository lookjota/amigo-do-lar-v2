import type { AttachmentCategory } from '../types/contracts'

export const attachmentCategoryLabels: Record<AttachmentCategory, string> = {
  BEFORE_SERVICE: 'Antes do serviço', AFTER_SERVICE: 'Depois do serviço', RECEIPT: 'Comprovante',
  DOCUMENT: 'Documento', OTHER: 'Outro',
}
export function formatAttachmentSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} KB`
  return `${(bytes / 1024 / 1024).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB`
}
export function sanitizeDownloadFilename(value: string) {
  const basename = value.split(/[\\/]/).pop()?.split('').filter((character) => {
    const code = character.charCodeAt(0)
    return code > 31 && code !== 127
  }).join('').trim()
  return (basename || 'anexo').slice(0, 255)
}
