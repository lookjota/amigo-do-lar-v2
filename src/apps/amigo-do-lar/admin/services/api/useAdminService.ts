import { useQuery } from '@tanstack/react-query'
import { getAdminService } from './services-admin-api'
import { adminServicesKey } from './useAdminServices'
export function useAdminService(slug: string) { return useQuery({ queryKey: [...adminServicesKey, 'detail', slug], queryFn: ({ signal }) => getAdminService(slug, signal), enabled: typeof window !== 'undefined' && Boolean(slug) }) }
