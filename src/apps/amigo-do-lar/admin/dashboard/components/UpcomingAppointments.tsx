import { Link } from 'react-router-dom'
import { AppointmentStatusBadge } from '../../appointments/components/AppointmentStatusBadge'
import type { AdminAppointment } from '../../appointments/types/contracts'

const dateTime = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

export function UpcomingAppointments({ appointments }: { appointments: AdminAppointment[] }) {
  if (appointments.length === 0) return <p className="amigo-dashboard-empty">Nenhum próximo agendamento encontrado.</p>
  return <ul className="amigo-dashboard-list">{appointments.map((appointment) => <li key={appointment.id}><div><strong>{appointment.serviceRequest.customer.name}</strong><span>{appointment.serviceRequest.service.name}</span></div><div><AppointmentStatusBadge status={appointment.status} /><time dateTime={appointment.scheduledAt}>{dateTime.format(new Date(appointment.scheduledAt))}</time></div><Link to={`/admin/agenda?appointment=${encodeURIComponent(appointment.id)}`} aria-label={`Abrir agendamento de ${appointment.serviceRequest.customer.name}`}>Abrir</Link></li>)}</ul>
}
