import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAdminAppointment } from './appointments-admin-api'
import { adminAppointmentsKey } from './useAppointments'
import { invalidateAppointmentQueries } from './invalidateAppointmentQueries'
import type { UpdateAppointmentInput } from '../types/contracts'

export function useUpdateAppointment(id: string) {
  const client = useQueryClient()
  return useMutation({ mutationFn: (input: UpdateAppointmentInput) => updateAdminAppointment(id, input), retry: false, onSuccess: async (updated) => { client.setQueryData([...adminAppointmentsKey, 'detail', id], updated); await invalidateAppointmentQueries(client, updated.serviceRequestId) } })
}
