import { useQuery } from '@tanstack/react-query'
import { getAdminServices } from './services-admin-api'
import type { AdminServiceFilters } from '../types/contracts'

export const adminServicesKey = ['admin', 'services'] as const
export function useAdminServices(filters: AdminServiceFilters) {
  return useQuery({ queryKey: [...adminServicesKey, filters], queryFn: ({ signal }) => getAdminServices(filters, signal), enabled: typeof window !== 'undefined', placeholderData: (previous) => previous })
}
