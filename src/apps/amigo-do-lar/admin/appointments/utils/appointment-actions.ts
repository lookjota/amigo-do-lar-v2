import { appointmentTransitions, type AppointmentStatus } from '../types/contracts'

export function canEditAppointment(status: AppointmentStatus) {
  return status !== 'COMPLETED' && status !== 'CANCELLED'
}

export function canCancelAppointment(status: AppointmentStatus) {
  return appointmentTransitions[status].includes('CANCELLED')
}
