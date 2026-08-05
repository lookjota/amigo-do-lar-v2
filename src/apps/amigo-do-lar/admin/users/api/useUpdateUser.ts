import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAdminUser } from './users-admin-api'
import { adminUsersKey } from './useUsers'
import type { UpdateUserInput } from '../types/contracts'
export function useUpdateUser(id: string) { const client = useQueryClient(); return useMutation({ mutationFn: (input: UpdateUserInput) => updateAdminUser(id, input), retry: false, onSuccess: async (user) => { client.setQueryData([...adminUsersKey, 'detail', id], user); await client.invalidateQueries({ queryKey: adminUsersKey }) } }) }
