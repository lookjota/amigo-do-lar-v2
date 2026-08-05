import type { QueryClient } from '@tanstack/react-query'
import { dashboardQueryKey } from '../../dashboard/api/useDashboardSummary'
import { adminServiceRequestsKey } from '../../service-requests/api/useServiceRequests'
import { adminAppointmentsKey } from './useAppointments'

export async function invalidateAppointmentQueries(client: QueryClient, serviceRequestId?: string) {
  const invalidations = [
    client.invalidateQueries({ queryKey: adminAppointmentsKey }),
    client.invalidateQueries({ queryKey: dashboardQueryKey }),
    client.invalidateQueries({ queryKey: adminServiceRequestsKey }),
  ]
  if (serviceRequestId) {
    invalidations.push(client.invalidateQueries({ queryKey: [...adminServiceRequestsKey, 'detail', serviceRequestId] }))
  }
  await Promise.all(invalidations)
}
