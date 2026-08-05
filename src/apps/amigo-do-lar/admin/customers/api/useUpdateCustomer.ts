import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAdminCustomer } from './customers-admin-api'
import { adminCustomersKey } from './useCustomers'
import type { UpdateCustomerInput } from '../types/contracts'

export function useUpdateCustomer(id: string) {
  const client = useQueryClient()
  return useMutation({ mutationFn: (input: UpdateCustomerInput) => updateAdminCustomer(id, input), retry: false, onSuccess: async (updated) => { client.setQueryData([...adminCustomersKey, 'detail', id], updated); await client.invalidateQueries({ queryKey: adminCustomersKey }) } })
}
