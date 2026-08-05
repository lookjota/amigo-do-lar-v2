import { useMutation } from '@tanstack/react-query'
import { updateAdminUserPassword } from './users-admin-api'
import type { UpdateUserPasswordInput } from '../types/contracts'
export function useUpdateUserPassword(id: string) { return useMutation({ mutationFn: (input: UpdateUserPasswordInput) => updateAdminUserPassword(id, input), retry: false }) }
