import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAdminService } from './services-admin-api'
import { adminServicesKey } from './useAdminServices'
import type { CreateServiceInput } from '../types/contracts'
export function useCreateService() { const client = useQueryClient(); return useMutation({ mutationFn: (input: CreateServiceInput) => createAdminService(input), retry: false, onSuccess: async (created) => { client.setQueryData([...adminServicesKey, 'detail', created.slug], created); await client.invalidateQueries({ queryKey: adminServicesKey }) } }) }
