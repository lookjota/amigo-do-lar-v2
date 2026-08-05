import { useQuery } from '@tanstack/react-query'
import { getAdminAppointment } from './appointments-admin-api'
import { adminAppointmentsKey } from './useAppointments'

export function useAppointment(id?: string) {
  return useQuery({ queryKey: [...adminAppointmentsKey, 'detail', id], queryFn: ({ signal }) => getAdminAppointment(id ?? '', signal), enabled: typeof window !== 'undefined' && Boolean(id) })
}
