import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAdminAppointmentStatus } from './appointments-admin-api'
import { adminAppointmentsKey } from './useAppointments'
import type { UpdateAppointmentStatusInput } from '../types/contracts'

export function useUpdateAppointmentStatus(id: string) {
  const client = useQueryClient()
  return useMutation({ mutationFn: (input: UpdateAppointmentStatusInput) => updateAdminAppointmentStatus(id, input), retry: false, onSuccess: async (updated) => { client.setQueryData([...adminAppointmentsKey, 'detail', id], updated); await client.invalidateQueries({ queryKey: adminAppointmentsKey }) } })
}
