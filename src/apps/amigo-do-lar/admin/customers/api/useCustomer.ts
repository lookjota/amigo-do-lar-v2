import { useQuery } from '@tanstack/react-query'
import { getAdminCustomer } from './customers-admin-api'
import { adminCustomersKey } from './useCustomers'

export function useCustomer(id: string) {
  return useQuery({ queryKey: [...adminCustomersKey, 'detail', id], queryFn: ({ signal }) => getAdminCustomer(id, signal), enabled: typeof window !== 'undefined' && Boolean(id) })
}
