import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAdminCustomer } from './customers-admin-api'
import { adminCustomersKey } from './useCustomers'
import type { CreateCustomerInput } from '../types/contracts'

export function useCreateCustomer() {
  const client = useQueryClient()
  return useMutation({ mutationFn: (input: CreateCustomerInput) => createAdminCustomer(input), retry: false, onSuccess: async () => { await client.invalidateQueries({ queryKey: adminCustomersKey }) } })
}
