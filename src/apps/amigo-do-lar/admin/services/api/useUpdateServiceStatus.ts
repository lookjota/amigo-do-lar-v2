import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAdminServiceStatus } from './services-admin-api'
import { adminServicesKey } from './useAdminServices'
import type { UpdateServiceStatusInput } from '../types/contracts'
export function useUpdateServiceStatus(id: string, slug: string) { const client = useQueryClient(); return useMutation({ mutationFn: (input: UpdateServiceStatusInput) => updateAdminServiceStatus(id, input), retry: false, onSuccess: async (updated) => { client.setQueryData([...adminServicesKey, 'detail', slug], updated); await client.invalidateQueries({ queryKey: adminServicesKey }) } }) }
