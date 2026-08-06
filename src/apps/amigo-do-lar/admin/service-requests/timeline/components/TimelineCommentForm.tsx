import { useRef, useState, type FormEvent } from 'react'
import { toUiError } from '../../../../api/errors'
import { useCreateTimelineComment } from '../api/useCreateTimelineComment'

export function TimelineCommentForm({ serviceRequestId }: { serviceRequestId: string }) {
  const mutation = useCreateTimelineComment(serviceRequestId)
  const [content, setContent] = useState('')
  const [success, setSuccess] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  async function submit(event: FormEvent) {
    event.preventDefault()
    const trimmed = content.trim()
    if (!trimmed || trimmed.length > 4000 || mutation.isPending) { textareaRef.current?.focus(); return }
    setSuccess('')
    try { await mutation.mutateAsync({ content: trimmed }); setContent(''); setSuccess('Comentário interno adicionado.'); textareaRef.current?.focus() } catch { textareaRef.current?.focus() }
  }
  return <form className="amigo-timeline-comment" onSubmit={(event) => void submit(event)}>
    <h4>Adicionar comentário interno</h4>
    <label htmlFor={`timeline-comment-${serviceRequestId}`}>Comentário</label>
    <textarea ref={textareaRef} id={`timeline-comment-${serviceRequestId}`} value={content} maxLength={4000} rows={4} disabled={mutation.isPending} onChange={(event) => { setContent(event.target.value); setSuccess(''); mutation.reset() }} />
    <span className="amigo-timeline-counter">{content.length}/4000 caracteres</span>
    <div className="amigo-timeline-comment-actions"><button type="button" disabled={!content || mutation.isPending} onClick={() => { setContent(''); setSuccess(''); mutation.reset(); textareaRef.current?.focus() }}>Limpar</button><button className="amigo-button" type="submit" disabled={!content.trim() || mutation.isPending}>{mutation.isPending ? 'Enviando…' : 'Adicionar comentário'}</button></div>
    <div aria-live="polite">{success && <p className="amigo-form-message amigo-form-message-success">{success}</p>}{mutation.isError && <p className="amigo-form-message amigo-form-message-error">{toUiError(mutation.error).userMessage}</p>}</div>
  </form>
}
