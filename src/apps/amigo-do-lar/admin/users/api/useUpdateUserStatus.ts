import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAdminUserStatus } from './users-admin-api'
import { adminUsersKey } from './useUsers'
import type { UpdateUserStatusInput } from '../types/contracts'
export function useUpdateUserStatus(id: string) { const client = useQueryClient(); return useMutation({ mutationFn: (input: UpdateUserStatusInput) => updateAdminUserStatus(id, input), retry: false, onSuccess: async (user) => { client.setQueryData([...adminUsersKey, 'detail', id], user); await client.invalidateQueries({ queryKey: adminUsersKey }) } }) }
