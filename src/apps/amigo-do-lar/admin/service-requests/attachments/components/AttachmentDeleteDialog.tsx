import { useEffect, useId, useRef } from 'react'
import { toUiError } from '../../../../api/errors'
import { useDeleteServiceRequestAttachment } from '../api/useDeleteServiceRequestAttachment'
import type { ServiceRequestAttachment } from '../types/contracts'
import { attachmentCategoryLabels } from '../utils/attachment-labels'

interface Props { serviceRequestId: string; attachment: ServiceRequestAttachment; onClose: () => void; onDeleted: () => void }
export function AttachmentDeleteDialog({ serviceRequestId, attachment, onClose, onDeleted }: Props) {
  const mutation = useDeleteServiceRequestAttachment(serviceRequestId)
  const cancelRef = useRef<HTMLButtonElement>(null); const titleId = useId()
  const requestRef = useRef<AbortController>(undefined)
  useEffect(() => () => requestRef.current?.abort(), [])
  useEffect(() => { cancelRef.current?.focus(); const escape = (event: KeyboardEvent) => { if (event.key === 'Escape' && !mutation.isPending) onClose() }; document.addEventListener('keydown', escape); return () => document.removeEventListener('keydown', escape) }, [mutation.isPending, onClose])
  async function remove() { if (mutation.isPending) return; requestRef.current = new AbortController(); try { await mutation.mutateAsync({ attachmentId: attachment.id, signal: requestRef.current.signal }); onDeleted() } catch { /* exibido abaixo */ } }
  return <div className="amigo-admin-modal-backdrop"><section className="amigo-admin-modal" role="alertdialog" aria-modal="true" aria-labelledby={titleId}>
    <h3 id={titleId}>Remover anexo</h3><p>Remover logicamente <strong>{attachment.originalName}</strong> ({attachmentCategoryLabels[attachment.category]})? O histórico será preservado e não há restauração nesta interface.</p>
    {mutation.isError && <p role="alert" className="amigo-form-message amigo-form-message-error">{toUiError(mutation.error).userMessage}</p>}
    <div className="amigo-admin-modal-actions"><button ref={cancelRef} type="button" onClick={onClose} disabled={mutation.isPending}>Cancelar</button><button type="button" className="amigo-danger-button" onClick={() => void remove()} disabled={mutation.isPending}>{mutation.isPending ? 'Removendo…' : 'Confirmar remoção'}</button></div>
  </section></div>
}
