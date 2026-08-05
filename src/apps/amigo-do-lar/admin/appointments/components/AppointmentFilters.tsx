import { useState, type FormEvent } from 'react'
import { appointmentStatuses, appointmentStatusLabels, type AppointmentStatus } from '../types/contracts'
export interface AppointmentFilterValues { status?: AppointmentStatus; scheduledFrom?: string; scheduledTo?: string }
export function AppointmentFilters({ values, onApply, onClear }: { values: AppointmentFilterValues; onApply: (values: AppointmentFilterValues) => void; onClear: () => void }) {
  const [status, setStatus] = useState(values.status ?? '')
  const [scheduledFrom, setFrom] = useState(values.scheduledFrom ?? '')
  const [scheduledTo, setTo] = useState(values.scheduledTo ?? '')
  function submit(event: FormEvent) { event.preventDefault(); onApply({ status: appointmentStatuses.find((item) => item === status), scheduledFrom: scheduledFrom || undefined, scheduledTo: scheduledTo || undefined }) }
  return <form className="amigo-admin-filters" onSubmit={submit}><label>Status<select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Todos</option>{appointmentStatuses.map((item) => <option key={item} value={item}>{appointmentStatusLabels[item]}</option>)}</select></label><label>De<input type="date" value={scheduledFrom} onChange={(e) => setFrom(e.target.value)} /></label><label>Até<input type="date" value={scheduledTo} onChange={(e) => setTo(e.target.value)} /></label><div className="amigo-admin-filter-actions"><button type="submit">Aplicar filtros</button><button type="button" onClick={onClear}>Limpar</button></div></form>
}
