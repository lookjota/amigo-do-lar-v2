import { useEffect, useRef } from 'react'
import { toUiError } from '../../../api/errors'
import { useUpdateAppointmentStatus } from '../api/useUpdateAppointmentStatus'

export function AppointmentCancelDialog({ id, onClose, onCancelled }: { id: string; onClose: () => void; onCancelled: () => void }) {
  const cancel = useUpdateAppointmentStatus(id)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)
  useEffect(() => { const origin = document.activeElement as HTMLElement | null; cancelButtonRef.current?.focus(); const escape = (event: KeyboardEvent) => { if (event.key === 'Escape' && !cancel.isPending) onClose() }; document.addEventListener('keydown', escape); return () => { document.removeEventListener('keydown', escape); origin?.focus() } }, [cancel.isPending, onClose])
  return <aside className="amigo-admin-drawer amigo-admin-confirm" role="alertdialog" aria-modal="true" aria-labelledby="cancel-appointment-title" aria-describedby="cancel-appointment-description"><h2 id="cancel-appointment-title">Cancelar agendamento</h2><p id="cancel-appointment-description">Deseja cancelar este agendamento? O registro permanecerá no histórico.</p><div className="amigo-admin-dialog-actions"><button type="button" disabled={cancel.isPending} onClick={onClose}>Voltar</button><button ref={cancelButtonRef} className="amigo-button amigo-button-danger" type="button" disabled={cancel.isPending} onClick={() => void cancel.mutateAsync({ status: 'CANCELLED' }).then(onCancelled).catch(() => undefined)}>{cancel.isPending ? 'Cancelando…' : 'Cancelar agendamento'}</button></div>{cancel.isError && <p role="alert" className="amigo-form-message amigo-form-message-error">{toUiError(cancel.error).userMessage}</p>}</aside>
}
