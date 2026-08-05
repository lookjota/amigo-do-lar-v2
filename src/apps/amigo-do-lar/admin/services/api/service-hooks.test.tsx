import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createAdminService, getAdminServices, updateAdminService, updateAdminServiceStatus } from './services-admin-api'
import { useAdminServices } from './useAdminServices'
import { useCreateService } from './useCreateService'
import { useUpdateService } from './useUpdateService'
import { useUpdateServiceStatus } from './useUpdateServiceStatus'
vi.mock('./services-admin-api', () => ({ getAdminServices: vi.fn(), getAdminService: vi.fn(), createAdminService: vi.fn(), updateAdminService: vi.fn(), updateAdminServiceStatus: vi.fn() }))
const response = { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }
const item = { id: '1ad575e6-0225-45ce-bb18-296407bc558b', name: 'Elétrica', slug: 'eletrica', description: 'Reparos.', category: 'ELECTRICAL', isActive: true, createdAt: '2026-08-05T10:00:00.000Z', updatedAt: '2026-08-05T10:00:00.000Z' }
function setup() { const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); function Wrapper({ children }: PropsWithChildren) { return <QueryClientProvider client={client}>{children}</QueryClientProvider> }; return { client, Wrapper } }
afterEach(() => vi.clearAllMocks())
describe('service admin hooks', () => {
  it('expõe loading, erro, retry, sucesso e cancelamento', async () => { vi.mocked(getAdminServices).mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(response); const { Wrapper } = setup(); const { result, unmount } = renderHook(() => useAdminServices({ page: 1, limit: 20 }), { wrapper: Wrapper }); expect(result.current.isPending).toBe(true); await waitFor(() => expect(result.current.isError).toBe(true)); await act(async () => { await result.current.refetch() }); await waitFor(() => expect(result.current.data).toEqual(response)); const signal = vi.mocked(getAdminServices).mock.calls[0][1]; unmount(); expect(signal).toBeInstanceOf(AbortSignal) })
  it('cria, atualiza e altera status sem retry, invalidando consultas', async () => { vi.mocked(createAdminService).mockResolvedValue(item); vi.mocked(updateAdminService).mockResolvedValue(item); vi.mocked(updateAdminServiceStatus).mockResolvedValue({ ...item, isActive: false }); const { client, Wrapper } = setup(); const invalidate = vi.spyOn(client, 'invalidateQueries'); const create = renderHook(() => useCreateService(), { wrapper: Wrapper }); const update = renderHook(() => useUpdateService(item.id, item.slug), { wrapper: Wrapper }); const status = renderHook(() => useUpdateServiceStatus(item.id, item.slug), { wrapper: Wrapper }); await act(async () => { await create.result.current.mutateAsync(item); await update.result.current.mutateAsync({ name: item.name }); await status.result.current.mutateAsync({ isActive: false }) }); expect(invalidate).toHaveBeenCalledTimes(3) })
})
