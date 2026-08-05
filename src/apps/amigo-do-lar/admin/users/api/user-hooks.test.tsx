import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createAdminUser, getAdminUsers, updateAdminUser, updateAdminUserPassword, updateAdminUserStatus } from './users-admin-api'
import { useCreateUser } from './useCreateUser'
import { useUpdateUser } from './useUpdateUser'
import { useUpdateUserPassword } from './useUpdateUserPassword'
import { useUpdateUserStatus } from './useUpdateUserStatus'
import { useUsers } from './useUsers'
vi.mock('./users-admin-api', () => ({ getAdminUsers: vi.fn(), getAdminUser: vi.fn(), createAdminUser: vi.fn(), updateAdminUser: vi.fn(), updateAdminUserStatus: vi.fn(), updateAdminUserPassword: vi.fn() }))
const response = { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }
const user = { id: '1ad575e6-0225-45ce-bb18-296407bc558b', name: 'Admin', email: 'admin@example.com', role: 'ADMIN' as const, isActive: true, createdAt: '2026-08-05T10:00:00.000Z', updatedAt: '2026-08-05T10:00:00.000Z' }
function setup() { const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); function Wrapper({ children }: PropsWithChildren) { return <QueryClientProvider client={client}>{children}</QueryClientProvider> }; return { client, Wrapper } }
afterEach(() => vi.clearAllMocks())
describe('user admin hooks', () => {
  it('expõe loading, erro, retry, sucesso e cancelamento', async () => { vi.mocked(getAdminUsers).mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(response); const { Wrapper } = setup(); const { result, unmount } = renderHook(() => useUsers({ page: 1, limit: 20 }), { wrapper: Wrapper }); expect(result.current.isPending).toBe(true); await waitFor(() => expect(result.current.isError).toBe(true)); await act(async () => { await result.current.refetch() }); await waitFor(() => expect(result.current.data).toEqual(response)); const signal = vi.mocked(getAdminUsers).mock.calls[0][1]; unmount(); expect(signal).toBeInstanceOf(AbortSignal) })
  it('executa mutações sem retry e invalida lista/detalhe', async () => { vi.mocked(createAdminUser).mockResolvedValue(user); vi.mocked(updateAdminUser).mockResolvedValue(user); vi.mocked(updateAdminUserStatus).mockResolvedValue(user); vi.mocked(updateAdminUserPassword).mockResolvedValue(); const { client, Wrapper } = setup(); const invalidate = vi.spyOn(client, 'invalidateQueries'); const create = renderHook(() => useCreateUser(), { wrapper: Wrapper }); const update = renderHook(() => useUpdateUser(user.id), { wrapper: Wrapper }); const status = renderHook(() => useUpdateUserStatus(user.id), { wrapper: Wrapper }); const password = renderHook(() => useUpdateUserPassword(user.id), { wrapper: Wrapper }); await act(async () => { await create.result.current.mutateAsync({ name: user.name, email: user.email, password: 'abcdefgh', role: user.role }); await update.result.current.mutateAsync({ name: user.name }); await status.result.current.mutateAsync({ isActive: false }); await password.result.current.mutateAsync({ password: 'abcdefgh' }) }); expect(invalidate).toHaveBeenCalledTimes(3); expect(updateAdminUserPassword).toHaveBeenCalledOnce() })
})
