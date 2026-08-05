import { useQuery } from '@tanstack/react-query'
import { getAdminServiceRequests } from './service-requests-admin-api'
import type { AdminServiceRequestFilters } from '../types/contracts'

export const adminServiceRequestsKey = ['admin', 'service-requests'] as const

export function useServiceRequests(filters: AdminServiceRequestFilters) {
  return useQuery({
    queryKey: [...adminServiceRequestsKey, filters],
    queryFn: ({ signal }) => getAdminServiceRequests(filters, signal),
    enabled: typeof window !== 'undefined',
    placeholderData: (previous) => previous,
  })
}
