import { useState, type FormEvent } from 'react'
import { toUiError } from '../../../api/errors'
import type { AdminAppointment } from '../types/contracts'
import { appointmentFormSchema, isoToLocalFormParts, localDateTimeToIso } from '../validation/appointment-schema'

interface Props {
  appointment?: AdminAppointment
  serviceRequestId?: string
  initialDate?: string
  isPending: boolean
  error?: unknown
  onSubmit: (input: { scheduledAt: string; durationMinutes: number; notes: string | null }) => Promise<void>
}
export function AppointmentForm({ appointment, serviceRequestId, initialDate, isPending, error, onSubmit }: Props) {
  const initial = appointment ? isoToLocalFormParts(appointment.scheduledAt) : { date: initialDate ?? '', time: '' }
  const [message, setMessage] = useState('')
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isPending) return
    const form = new FormData(event.currentTarget)
    const parsed = appointmentFormSchema.safeParse({ date: form.get('date'), time: form.get('time'), durationMinutes: form.get('durationMinutes'), notes: form.get('notes') })
    if (!parsed.success) { setMessage(parsed.error.issues[0]?.message ?? 'Revise os dados.'); return }
    const scheduledAt = localDateTimeToIso(parsed.data.date, parsed.data.time)
    if (!scheduledAt || new Date(scheduledAt).getTime() <= Date.now()) { setMessage('Escolha uma data e horário futuros.'); return }
    setMessage('')
    await onSubmit({ scheduledAt, durationMinutes: parsed.data.durationMinutes, notes: parsed.data.notes.trim() || null })
  }
  return <form onSubmit={(event) => void submit(event)} aria-label={appointment ? 'Editar agendamento' : 'Criar agendamento'}>
    {serviceRequestId && !appointment && <p>Solicitação selecionada para agendamento.</p>}
    <label>Data<input name="date" type="date" defaultValue={initial.date} required disabled={isPending} /></label>
    <label>Horário<input name="time" type="time" defaultValue={initial.time} required disabled={isPending} /></label>
    <label>Duração (minutos)<input name="durationMinutes" type="number" min="15" max="480" step="15" defaultValue={appointment?.durationMinutes ?? 60} required disabled={isPending} /></label>
    <label>Observações<textarea name="notes" maxLength={4000} defaultValue={appointment?.notes ?? ''} disabled={isPending} /></label>
    <button className="amigo-button" type="submit" disabled={isPending}>{isPending ? 'Salvando…' : appointment ? 'Salvar alterações' : 'Criar agendamento'}</button>
    {message && <p role="alert" className="amigo-form-message amigo-form-message-error">{message}</p>}
    {error !== undefined && <p role="alert" className="amigo-form-message amigo-form-message-error">{toUiError(error).userMessage}</p>}
  </form>
}
