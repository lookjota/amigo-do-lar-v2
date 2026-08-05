import { useQuery } from '@tanstack/react-query'
import { getAdminAppointments } from './appointments-admin-api'
import type { AdminAppointmentFilters } from '../types/contracts'

export const adminAppointmentsKey = ['admin', 'appointments'] as const
export function useAppointments(filters: AdminAppointmentFilters) {
  return useQuery({ queryKey: [...adminAppointmentsKey, filters], queryFn: ({ signal }) => getAdminAppointments(filters, signal), enabled: typeof window !== 'undefined', placeholderData: (previous) => previous })
}
