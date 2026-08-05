import { useQuery } from '@tanstack/react-query'
import { getAdminUser } from './users-admin-api'
import { adminUsersKey } from './useUsers'
export function useUser(id: string) { return useQuery({ queryKey: [...adminUsersKey, 'detail', id], queryFn: ({ signal }) => getAdminUser(id, signal), enabled: typeof window !== 'undefined' && Boolean(id) }) }
