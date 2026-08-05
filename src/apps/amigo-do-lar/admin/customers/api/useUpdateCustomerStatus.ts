import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAdminCustomerStatus } from './customers-admin-api'
import { adminCustomersKey } from './useCustomers'
import type { UpdateCustomerStatusInput } from '../types/contracts'

export function useUpdateCustomerStatus(id: string) {
  const client = useQueryClient()
  return useMutation({ mutationFn: (input: UpdateCustomerStatusInput) => updateAdminCustomerStatus(id, input), retry: false, onSuccess: async (updated) => { client.setQueryData([...adminCustomersKey, 'detail', id], updated); await client.invalidateQueries({ queryKey: adminCustomersKey }) } })
}
