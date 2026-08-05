import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAdminUser } from './users-admin-api'
import { adminUsersKey } from './useUsers'
import type { CreateUserInput } from '../types/contracts'
export function useCreateUser() { const client = useQueryClient(); return useMutation({ mutationFn: (input: CreateUserInput) => createAdminUser(input), retry: false, onSuccess: async () => { await client.invalidateQueries({ queryKey: adminUsersKey }) } }) }
