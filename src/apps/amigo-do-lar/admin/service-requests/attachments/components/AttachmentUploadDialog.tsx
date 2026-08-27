import { useEffect, useId, useRef, useState, type DragEvent, type FormEvent } from 'react'
import { toUiError } from '../../../../api/errors'
import { attachmentCategories, type AttachmentCategory } from '../types/contracts'
import { attachmentCategoryLabels, formatAttachmentSize } from '../utils/attachment-labels'
import { attachmentFileSchema } from '../validation/attachment-schema'
import { useUploadServiceRequestAttachment } from '../api/useUploadServiceRequestAttachment'
import { AttachmentPreview } from './AttachmentPreview'

type UploadStatus = 'ready' | 'uploading' | 'failed' | 'done' | 'cancelled'
interface UploadItem {
  id: string
  file: File
  status: UploadStatus
  progress: number
  error?: string
  controller?: AbortController
}

interface Props { serviceRequestId: string; onClose: () => void; onUploaded: () => void }

export function AttachmentUploadDialog({ serviceRequestId, onClose, onUploaded }: Props) {
  const mutation = useUploadServiceRequestAttachment(serviceRequestId)
  const [items, setItems] = useState<UploadItem[]>([])
  const [category, setCategory] = useState<AttachmentCategory>('BEFORE_SERVICE')
  const [caption, setCaption] = useState('')
  const [validationError, setValidationError] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const itemsRef = useRef(items)
  const titleId = useId()
  const uploading = items.some((item) => item.status === 'uploading')

  useEffect(() => { itemsRef.current = items }, [items])

  useEffect(() => {
    inputRef.current?.focus()
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape' && !uploading) onClose() }
    document.addEventListener('keydown', escape)
    return () => document.removeEventListener('keydown', escape)
  }, [onClose, uploading])

  useEffect(() => () => itemsRef.current.forEach((item) => item.controller?.abort()), [])

  function addFiles(files: FileList | File[]) {
    const valid: UploadItem[] = []
    const errors: string[] = []
    Array.from(files).forEach((file) => {
      const parsed = attachmentFileSchema.safeParse(file)
      if (!parsed.success) errors.push(`${file.name}: ${parsed.error.issues[0]?.message ?? 'Arquivo inválido.'}`)
      else valid.push({ id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`, file: parsed.data, status: 'ready', progress: 0 })
    })
    setValidationError(errors.join(' '))
    setItems((current) => [...current, ...valid])
    if (inputRef.current) inputRef.current.value = ''
  }

  function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragging(false)
    if (!uploading) addFiles(event.dataTransfer.files)
  }

  function patchItem(id: string, patch: Partial<UploadItem>) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item))
  }

  async function upload(item: UploadItem) {
    const controller = new AbortController()
    patchItem(item.id, { status: 'uploading', progress: 0, error: undefined, controller })
    try {
      await mutation.mutateAsync({
        file: item.file,
        category,
        caption: caption.trim() || undefined,
        signal: controller.signal,
        onProgress: (progress) => patchItem(item.id, { progress }),
      })
      patchItem(item.id, { status: 'done', progress: 100, controller: undefined })
      return true
    } catch (error) {
      if (controller.signal.aborted) patchItem(item.id, { status: 'cancelled', error: 'Upload cancelado.', controller: undefined })
      else patchItem(item.id, { status: 'failed', error: toUiError(error).userMessage, controller: undefined })
      return false
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (uploading) return
    if (caption.trim().length > 500) { setValidationError('A legenda deve ter no máximo 500 caracteres.'); return }
    const pending = items.filter((item) => item.status === 'ready' || item.status === 'failed' || item.status === 'cancelled')
    if (pending.length === 0) return
    setValidationError('')
    const results = await Promise.all(pending.map(upload))
    if (results.every(Boolean)) onUploaded()
  }

  function cancel(item: UploadItem) {
    item.controller?.abort()
  }

  async function retry(item: UploadItem) {
    const succeeded = await upload(item)
    if (succeeded && itemsRef.current.every((candidate) => candidate.id === item.id || candidate.status === 'done')) onUploaded()
  }

  return <div className="amigo-admin-modal-backdrop"><section className="amigo-admin-modal amigo-attachment-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
    <h3 id={titleId}>Adicionar anexos</h3>
    <form onSubmit={(event) => void submit(event)}>
      <div className={`amigo-attachment-dropzone${dragging ? ' is-dragging' : ''}`} onDragEnter={(event) => { event.preventDefault(); setDragging(true) }} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setDragging(false)} onDrop={drop}>
        <p><strong>Arraste arquivos para cá</strong> ou selecione pelo botão.</p>
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}>Selecionar arquivos</button>
        <input ref={inputRef} id={`${titleId}-file`} aria-label="Arquivos" className="amigo-visually-hidden" type="file" multiple accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(event) => event.target.files && addFiles(event.target.files)} disabled={uploading} />
        <p className="amigo-form-help">Imagens JPEG, PNG ou WebP e documentos PDF, com no máximo 10 MB cada.</p>
      </div>
      {items.length > 0 && <ul className="amigo-upload-list" aria-label="Arquivos selecionados">{items.map((item) => <li key={item.id}>
        <AttachmentPreview file={item.file} />
        <div className="amigo-upload-file-info"><strong>{item.file.name}</strong><span>{formatAttachmentSize(item.file.size)}</span>
          <progress value={item.progress} max="100" aria-label={`Progresso de ${item.file.name}`}>{item.progress}%</progress>
          <span>{item.status === 'done' ? 'Enviado' : item.status === 'uploading' ? `${item.progress}%` : item.status === 'failed' ? 'Falha no envio' : item.status === 'cancelled' ? 'Cancelado' : 'Pronto para enviar'}</span>
          {item.error && <p role="alert" className="amigo-form-message amigo-form-message-error">{item.error}</p>}
        </div>
        <div className="amigo-upload-item-actions">{item.status === 'uploading' && <button type="button" onClick={() => cancel(item)}>Cancelar upload</button>}{(item.status === 'failed' || item.status === 'cancelled') && <button type="button" onClick={() => void retry(item)}>Tentar novamente</button>}{item.status === 'ready' && <button type="button" onClick={() => setItems((current) => current.filter(({ id }) => id !== item.id))}>Remover</button>}</div>
      </li>)}</ul>}
      <label>Categoria<select value={category} onChange={(event) => setCategory(event.target.value as AttachmentCategory)} disabled={uploading}>{attachmentCategories.map((item) => <option value={item} key={item}>{attachmentCategoryLabels[item]}</option>)}</select></label>
      <label>Legenda (opcional)<textarea value={caption} maxLength={500} onChange={(event) => setCaption(event.target.value)} disabled={uploading} /></label>
      <p className="amigo-form-help">{caption.length}/500 caracteres</p>
      <div aria-live="polite">{uploading && <p role="status">Enviando anexos…</p>}{validationError && <p role="alert" className="amigo-form-message amigo-form-message-error">{validationError}</p>}</div>
      <div className="amigo-admin-modal-actions"><button type="button" onClick={onClose} disabled={uploading}>Fechar</button><button className="amigo-button" type="submit" disabled={items.length === 0 || uploading || items.every((item) => item.status === 'done')}>{uploading ? 'Enviando…' : 'Enviar anexos'}</button></div>
    </form>
  </section></div>
}
