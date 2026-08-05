import { useRef, useState, type FormEvent } from 'react'
import { toUiError } from '../../../api/errors'
import type { Quote } from '../types/contracts'
import { centsToCurrency, centsToInputValue, currencyInputToCents } from '../utils/money'

export interface QuoteFormInput { serviceRequestId?: string; subtotalCents: number; discountCents: number; description: string | null; notes: string | null; validUntil: string | null }
export function QuoteForm({ quote, serviceRequestId, isPending, error, onSubmit }: { quote?: Quote; serviceRequestId?: string; isPending: boolean; error?: unknown; onSubmit: (input: QuoteFormInput) => Promise<void> }) {
  const [message, setMessage] = useState('')
  const submitting = useRef(false)
  const [preview, setPreview] = useState({ subtotal: quote?.subtotalCents ?? 0, discount: quote?.discountCents ?? 0 })
  function updatePreview(form: HTMLFormElement) { try { setPreview({ subtotal: currencyInputToCents(String(new FormData(form).get('subtotal'))), discount: currencyInputToCents(String(new FormData(form).get('discount') || '0')) }) } catch { /* validação acontece no envio */ } }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (isPending || submitting.current) return
    const form = new FormData(event.currentTarget)
    try {
      const subtotalCents = currencyInputToCents(String(form.get('subtotal')))
      const discountCents = currencyInputToCents(String(form.get('discount') || '0'))
      if (subtotalCents <= 0) throw new RangeError('O subtotal deve ser maior que zero.')
      if (discountCents > subtotalCents) throw new RangeError('O desconto não pode superar o subtotal.')
      const validUntilValue = String(form.get('validUntil') || '')
      const description = String(form.get('description') || '').trim()
      const notes = String(form.get('notes') || '').trim()
      setMessage('')
      submitting.current = true
      await onSubmit({ ...(serviceRequestId ? { serviceRequestId } : {}), subtotalCents, discountCents, description: description || null, notes: notes || null, validUntil: validUntilValue ? new Date(`${validUntilValue}T23:59:59`).toISOString() : null })
    } catch (caught) { if (caught instanceof RangeError) setMessage(caught.message); else throw caught } finally { submitting.current = false }
  }
  return <form onSubmit={(event) => void submit(event)} onInput={(event) => updatePreview(event.currentTarget)} aria-label={quote ? 'Editar orçamento' : 'Criar orçamento'}>
    <label>Subtotal (R$)<input name="subtotal" inputMode="decimal" defaultValue={quote ? centsToInputValue(quote.subtotalCents) : ''} placeholder="100,00" required disabled={isPending} /></label>
    <label>Desconto (R$)<input name="discount" inputMode="decimal" defaultValue={quote ? centsToInputValue(quote.discountCents) : '0,00'} disabled={isPending} /></label>
    <label>Descrição<textarea name="description" maxLength={2000} defaultValue={quote?.description ?? ''} disabled={isPending} /></label>
    <label>Observações internas<textarea name="notes" maxLength={4000} defaultValue={quote?.notes ?? ''} disabled={isPending} /></label>
    <label>Validade<input name="validUntil" type="date" defaultValue={quote?.validUntil?.slice(0, 10) ?? ''} disabled={isPending} /></label>
    <div className="amigo-finance-preview" aria-live="polite"><strong>Total estimado: {centsToCurrency(Math.max(0, preview.subtotal - preview.discount))}</strong><small>O total definitivo será calculado pela API.</small></div>
    <button className="amigo-button" type="submit" disabled={isPending}>{isPending ? 'Salvando…' : quote ? 'Salvar alterações' : 'Criar orçamento'}</button>
    {message && <p role="alert" className="amigo-form-message amigo-form-message-error">{message}</p>}
    {error !== undefined && <p role="alert" className="amigo-form-message amigo-form-message-error">{toUiError(error).userMessage}</p>}
  </form>
}
