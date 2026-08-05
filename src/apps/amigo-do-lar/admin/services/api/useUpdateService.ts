import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAdminService } from './services-admin-api'
import { adminServicesKey } from './useAdminServices'
import type { UpdateServiceInput } from '../types/contracts'
export function useUpdateService(id: string, currentSlug: string) { const client = useQueryClient(); return useMutation({ mutationFn: (input: UpdateServiceInput) => updateAdminService(id, input), retry: false, onSuccess: async (updated) => { client.removeQueries({ queryKey: [...adminServicesKey, 'detail', currentSlug] }); client.setQueryData([...adminServicesKey, 'detail', updated.slug], updated); await client.invalidateQueries({ queryKey: adminServicesKey }) } }) }
