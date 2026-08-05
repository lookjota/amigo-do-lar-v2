import { useEffect, useRef, useState } from 'react'
import { toUiError } from '../../../api/errors'
import { useAppointment } from '../api/useAppointment'
import { useUpdateAppointment } from '../api/useUpdateAppointment'
import { useUpdateAppointmentStatus } from '../api/useUpdateAppointmentStatus'
import { appointmentStatusLabels, appointmentTransitions, type AppointmentStatus } from '../types/contracts'
import { AppointmentForm } from './AppointmentForm'
import { AppointmentStatusBadge } from './AppointmentStatusBadge'
import { AppointmentCancelDialog } from './AppointmentCancelDialog'
import { canCancelAppointment, canEditAppointment } from '../utils/appointment-actions'

const dateTime = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' })
const format = (value: string | null) => value ? dateTime.format(new Date(value)) : 'Não informado'
export function AppointmentDetails({ id, initialEdit = false, onClose }: { id: string; initialEdit?: boolean; onClose: () => void }) {
  const query = useAppointment(id)
  const update = useUpdateAppointment(id)
  const updateStatus = useUpdateAppointmentStatus(id)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [nextStatus, setNextStatus] = useState<AppointmentStatus>()
  const [success, setSuccess] = useState('')
  const [editing, setEditing] = useState(initialEdit)
  const [cancelling, setCancelling] = useState(false)
  useEffect(() => { closeRef.current?.focus(); const escape = (event: KeyboardEvent) => { if (event.key === 'Escape' && !cancelling && !update.isPending && !updateStatus.isPending) onClose() }; document.addEventListener('keydown', escape); return () => document.removeEventListener('keydown', escape) }, [cancelling, onClose, update.isPending, updateStatus.isPending])
  const item = query.data
  const editable = item && canEditAppointment(item.status)
  async function changeStatus() { if (!nextStatus || updateStatus.isPending) return; if (!window.confirm(`Confirmar alteração para “${appointmentStatusLabels[nextStatus]}”?`)) return; setSuccess(''); try { await updateStatus.mutateAsync({ status: nextStatus }); setNextStatus(undefined); setSuccess('Status atualizado com sucesso.') } catch { /* erro seguro abaixo */ } }
  return <aside className="amigo-admin-drawer" role="dialog" aria-modal="true" aria-labelledby="appointment-title"><div className="amigo-admin-drawer-header"><h2 id="appointment-title">Detalhes do agendamento</h2><button ref={closeRef} type="button" onClick={onClose}>Fechar</button></div>
    {query.isPending && <p role="status">Carregando detalhes…</p>}{query.isError && <div role="alert" className="amigo-admin-state"><p>{toUiError(query.error).userMessage}</p><button onClick={() => void query.refetch()}>Tentar novamente</button></div>}
    {item && <><dl className="amigo-admin-details-list"><div><dt>Cliente</dt><dd>{item.serviceRequest.customer.name}</dd></div><div><dt>Serviço</dt><dd>{item.serviceRequest.service.name}</dd></div><div><dt>Endereço</dt><dd>{item.serviceRequest.address ?? 'Não informado'}</dd></div><div><dt>Cidade</dt><dd>{item.serviceRequest.city ?? 'Não informada'}</dd></div><div><dt>Data e horário</dt><dd>{format(item.scheduledAt)}</dd></div><div><dt>Duração</dt><dd>{item.durationMinutes} minutos</dd></div><div><dt>Status</dt><dd><AppointmentStatusBadge status={item.status} /></dd></div><div><dt>Observações</dt><dd>{item.notes ?? 'Sem observações'}</dd></div>{item.startedAt && <div><dt>Iniciado em</dt><dd>{format(item.startedAt)}</dd></div>}{item.completedAt && <div><dt>Concluído em</dt><dd>{format(item.completedAt)}</dd></div>}{item.cancelledAt && <div><dt>Cancelado em</dt><dd>{format(item.cancelledAt)}</dd></div>}</dl>
      <div className="amigo-admin-dialog-actions">{editable && <button type="button" onClick={() => setEditing((value) => !value)}>{editing ? 'Fechar edição' : 'Editar/Reagendar'}</button>}{canCancelAppointment(item.status) && <button type="button" onClick={() => setCancelling(true)}>Cancelar agendamento</button>}</div>
      {editable && editing ? <section><h3>Editar/Reagendar agendamento</h3><AppointmentForm appointment={item} isPending={update.isPending} error={update.error} onSubmit={async (input) => { setSuccess(''); try { await update.mutateAsync(input); setEditing(false); setSuccess('Agendamento atualizado com sucesso.') } catch { /* erro seguro no formulário */ } }} /></section> : !editable && <p>Agendamentos concluídos ou cancelados não podem ser reagendados.</p>}
      <section className="amigo-admin-status-update"><h3>Alterar status</h3>{appointmentTransitions[item.status].length ? <><label>Próximo status<select value={nextStatus ?? ''} disabled={updateStatus.isPending} onChange={(event) => setNextStatus(appointmentTransitions[item.status].find((status) => status === event.target.value))}><option value="">Selecione</option>{appointmentTransitions[item.status].map((status) => <option key={status} value={status}>{appointmentStatusLabels[status]}</option>)}</select></label><button type="button" disabled={!nextStatus || updateStatus.isPending} onClick={() => void changeStatus()}>{updateStatus.isPending ? 'Atualizando…' : 'Confirmar alteração'}</button></> : <p>Este agendamento está em um estado final.</p>}{updateStatus.isError && <p role="alert" className="amigo-form-message amigo-form-message-error">{toUiError(updateStatus.error).userMessage}</p>}</section>
      {success && <p role="status" className="amigo-form-message amigo-form-message-success">{success}</p>}</>}
    {cancelling && <AppointmentCancelDialog id={id} onClose={() => setCancelling(false)} onCancelled={() => { setCancelling(false); setSuccess('Agendamento cancelado. O registro foi mantido no histórico.') }} />}
  </aside>
}
