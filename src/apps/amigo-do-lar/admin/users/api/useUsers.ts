import { useQuery } from '@tanstack/react-query'
import { getAdminUsers } from './users-admin-api'
import type { AdminUserFilters } from '../types/contracts'
export const adminUsersKey = ['admin', 'users'] as const
export function useUsers(filters: AdminUserFilters) { return useQuery({ queryKey: [...adminUsersKey, filters], queryFn: ({ signal }) => getAdminUsers(filters, signal), enabled: typeof window !== 'undefined', placeholderData: (previous) => previous }) }
