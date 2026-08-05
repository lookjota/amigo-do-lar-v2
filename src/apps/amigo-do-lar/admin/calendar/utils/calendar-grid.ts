import type { AdminAppointment } from '../../appointments/types/contracts'
import { addLocalDays, formatLocalDate } from './calendar-range'

export function getCalendarDays(start: Date, end: Date) {
  const days: Date[] = []
  for (let current = new Date(start); current.getTime() <= end.getTime(); current = addLocalDays(current, 1)) days.push(current)
  return days
}

export function groupAppointmentsByLocalDay(appointments: AdminAppointment[]) {
  return appointments.reduce<Map<string, AdminAppointment[]>>((groups, appointment) => {
    const key = formatLocalDate(new Date(appointment.scheduledAt))
    const items = groups.get(key) ?? []
    items.push(appointment)
    groups.set(key, items)
    return groups
  }, new Map())
}
