import type { AdminAppointment } from '../../appointments/types/contracts'
import { AppointmentStatusBadge } from '../../appointments/components/AppointmentStatusBadge'

const time = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' })

export function CalendarEventCard({ appointment, onOpen }: { appointment: AdminAppointment; onOpen: (id: string) => void }) {
  const request = appointment.serviceRequest
  return <button type="button" className={`amigo-calendar-event amigo-calendar-event-${appointment.status.toLowerCase()}`} onClick={() => onOpen(appointment.id)} aria-label={`${time.format(new Date(appointment.scheduledAt))}, ${request.customer.name}, ${request.service.name}, ver detalhes`}>
    <span className="amigo-calendar-event-time">{time.format(new Date(appointment.scheduledAt))} · {appointment.durationMinutes} min</span>
    <strong>{request.customer.name}</strong>
    <span>{request.service.name}</span>
    {request.city && <span>{request.city}</span>}
    <AppointmentStatusBadge status={appointment.status} />
  </button>
}
