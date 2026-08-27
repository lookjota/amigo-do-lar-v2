import { useEffect, useRef, useState } from 'react'
import { toUiError } from '../../../../api/errors'
import type { ServiceRequestAttachment } from '../types/contracts'
import { attachmentCategoryLabels, formatAttachmentSize } from '../utils/attachment-labels'
import { downloadServiceRequestAttachment } from '../api/service-request-attachments-api'
import { AttachmentImage } from './AttachmentImage'

interface Props { serviceRequestId: string; attachment: ServiceRequestAttachment; canDelete: boolean; onDelete: (attachment: ServiceRequestAttachment) => void }
export function AttachmentCard({ serviceRequestId, attachment, canDelete, onDelete }: Props) {
  const [downloading, setDownloading] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [error, setError] = useState('')
  const downloadController = useRef<AbortController>(undefined)
  useEffect(() => () => downloadController.current?.abort(), [])
  async function download() {
    if (downloading) return
    setDownloading(true); setError('')
    downloadController.current = new AbortController()
    try { await downloadServiceRequestAttachment(serviceRequestId, attachment, downloadController.current.signal) }
    catch (caught) { setError(toUiError(caught).userMessage) }
    finally { setDownloading(false) }
  }
  const created = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(attachment.createdAt))
  return <li className="amigo-attachment-card">
    {attachment.mimeType.startsWith('image/') ? <AttachmentImage serviceRequestId={serviceRequestId} attachmentId={attachment.id} name={attachment.originalName} previewOpen={previewOpen} onOpen={() => setPreviewOpen(true)} onClose={() => setPreviewOpen(false)} /> : <div className="amigo-attachment-file-kind" aria-hidden="true">ARQUIVO</div>}
    <span className="amigo-admin-badge">{attachmentCategoryLabels[attachment.category]}</span>
    <h4>{attachment.originalName}</h4>{attachment.caption && <p>{attachment.caption}</p>}
    <dl><div><dt>Tamanho</dt><dd>{formatAttachmentSize(attachment.sizeBytes)}</dd></div><div><dt>Data</dt><dd>{created}</dd></div><div><dt>Autor</dt><dd>{attachment.uploadedBy.name} ({attachment.uploadedBy.role})</dd></div></dl>
    <div className="amigo-attachment-actions"><button type="button" onClick={() => void download()} disabled={downloading}>{downloading ? 'Baixando…' : 'Baixar'}</button>{canDelete && <button type="button" className="amigo-danger-button" onClick={() => onDelete(attachment)}>Remover</button>}</div>
    {error && <p role="alert" className="amigo-form-message amigo-form-message-error">{error}</p>}
  </li>
}
