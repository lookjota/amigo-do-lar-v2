import { useEffect, useRef, useState } from 'react'
import { useCreateAppointment } from '../api/useCreateAppointment'
import { AppointmentForm } from './AppointmentForm'
import { EligibleServiceRequestSelect } from './EligibleServiceRequestSelect'

export function AppointmentCreateDialog({ initialDate, initialServiceRequestId = '', onClose, onCreated }: { initialDate?: string; initialServiceRequestId?: string; onClose: () => void; onCreated: (id: string) => void }) {
  const [serviceRequestId, setServiceRequestId] = useState(initialServiceRequestId)
  const [selectionError, setSelectionError] = useState('')
  const closeRef = useRef<HTMLButtonElement>(null)
  const create = useCreateAppointment()
  useEffect(() => { const origin = document.activeElement as HTMLElement | null; closeRef.current?.focus(); const escape = (event: KeyboardEvent) => { if (event.key === 'Escape' && !create.isPending) onClose() }; document.addEventListener('keydown', escape); return () => { document.removeEventListener('keydown', escape); origin?.focus() } }, [create.isPending, onClose])
  return <aside className="amigo-admin-drawer" role="dialog" aria-modal="true" aria-labelledby="create-appointment-title"><div className="amigo-admin-drawer-header"><h2 id="create-appointment-title">Novo agendamento</h2><button ref={closeRef} type="button" disabled={create.isPending} onClick={onClose}>Fechar</button></div>
    <EligibleServiceRequestSelect value={serviceRequestId} disabled={create.isPending} onChange={(id) => { setServiceRequestId(id); setSelectionError('') }} />
    <AppointmentForm initialDate={initialDate} serviceRequestId={serviceRequestId || undefined} isPending={create.isPending} error={create.error} onSubmit={async (input) => { if (!serviceRequestId) { setSelectionError('Selecione uma solicitação aprovada.'); return } setSelectionError(''); try { const created = await create.mutateAsync({ serviceRequestId, ...input }); onCreated(created.id) } catch { /* erro seguro no formulário */ } }} />
    {selectionError && <p role="alert" className="amigo-form-message amigo-form-message-error">{selectionError}</p>}
  </aside>
}
