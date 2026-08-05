import { useQuery } from '@tanstack/react-query'
import { getAdminCustomers } from './customers-admin-api'
import type { AdminCustomerFilters } from '../types/contracts'

export const adminCustomersKey = ['admin', 'customers'] as const

export function useCustomers(filters: AdminCustomerFilters) {
  return useQuery({
    queryKey: [...adminCustomersKey, filters],
    queryFn: ({ signal }) => getAdminCustomers(filters, signal),
    enabled: typeof window !== 'undefined',
    placeholderData: (previous) => previous,
  })
}
