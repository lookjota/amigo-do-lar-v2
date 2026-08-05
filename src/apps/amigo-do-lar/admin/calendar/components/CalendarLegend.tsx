import { appointmentStatuses, appointmentStatusLabels } from '../../appointments/types/contracts'

export function CalendarLegend() {
  return <ul className="amigo-calendar-legend" aria-label="Legenda de status">{appointmentStatuses.map((status) => <li key={status}><span className={`amigo-calendar-legend-mark amigo-calendar-event-${status.toLowerCase()}`} aria-hidden="true" />{appointmentStatusLabels[status]}</li>)}</ul>
}
