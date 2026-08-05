import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAdminAppointment } from './appointments-admin-api'
import { invalidateAppointmentQueries } from './invalidateAppointmentQueries'

export function useCreateAppointment() {
  const client = useQueryClient()
  return useMutation({ mutationFn: (input: Parameters<typeof createAdminAppointment>[0]) => createAdminAppointment(input), retry: false, onSuccess: async (created) => { await invalidateAppointmentQueries(client, created.serviceRequestId) } })
}
