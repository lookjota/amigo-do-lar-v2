import { useQuery } from '@tanstack/react-query'
import { getAdminServiceRequest } from './service-requests-admin-api'
import { adminServiceRequestsKey } from './useServiceRequests'

export function useServiceRequest(id?: string) {
  return useQuery({
    queryKey: [...adminServiceRequestsKey, 'detail', id],
    queryFn: ({ signal }) => getAdminServiceRequest(id ?? '', signal),
    enabled: typeof window !== 'undefined' && Boolean(id),
  })
}
