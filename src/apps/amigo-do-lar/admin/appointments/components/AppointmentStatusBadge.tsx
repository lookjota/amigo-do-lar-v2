import { appointmentStatusLabels, type AppointmentStatus } from '../types/contracts'
export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return <span className={`amigo-admin-status amigo-admin-status-${status.toLowerCase()}`}>{appointmentStatusLabels[status]}</span>
}
