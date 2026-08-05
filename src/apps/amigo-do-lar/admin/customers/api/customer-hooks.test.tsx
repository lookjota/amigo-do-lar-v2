import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createAdminCustomer, getAdminCustomers, updateAdminCustomer } from './customers-admin-api'
import { useCreateCustomer } from './useCreateCustomer'
import { useCustomers } from './useCustomers'
import { useUpdateCustomer } from './useUpdateCustomer'

vi.mock('./customers-admin-api', () => ({ getAdminCustomers: vi.fn(), getAdminCustomer: vi.fn(), createAdminCustomer: vi.fn(), updateAdminCustomer: vi.fn(), updateAdminCustomerStatus: vi.fn() }))
const response = { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }
function setup() { const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); function Wrapper({ children }: PropsWithChildren) { return <QueryClientProvider client={client}>{children}</QueryClientProvider> }; return { client, Wrapper } }
afterEach(() => vi.clearAllMocks())
describe('customer admin hooks', () => {
  it('expõe loading, sucesso, erro, retry e cancelamento', async () => { vi.mocked(getAdminCustomers).mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(response); const { Wrapper } = setup(); const { result, unmount } = renderHook(() => useCustomers({ page: 1, limit: 20 }), { wrapper: Wrapper }); expect(result.current.isPending).toBe(true); await waitFor(() => expect(result.current.isError).toBe(true)); await act(async () => { await result.current.refetch() }); await waitFor(() => expect(result.current.isSuccess).toBe(true)); expect(result.current.data).toEqual(response); const signal = vi.mocked(getAdminCustomers).mock.calls[0][1]; unmount(); expect(signal).toBeInstanceOf(AbortSignal) })
  it('cria e atualiza sem retry e invalida a lista', async () => { const item = { id: '1ad575e6-0225-45ce-bb18-296407bc558b', name: 'Cliente', phone: '61999999999', email: null, isActive: true, createdAt: '2026-08-05T10:00:00.000Z', updatedAt: '2026-08-05T10:00:00.000Z' }; vi.mocked(createAdminCustomer).mockResolvedValue(item); vi.mocked(updateAdminCustomer).mockResolvedValue(item); const { client, Wrapper } = setup(); const invalidate = vi.spyOn(client, 'invalidateQueries'); const created = renderHook(() => useCreateCustomer(), { wrapper: Wrapper }); const updated = renderHook(() => useUpdateCustomer(item.id), { wrapper: Wrapper }); await act(async () => { await created.result.current.mutateAsync({ name: 'Cliente', phone: item.phone }); await updated.result.current.mutateAsync({ name: 'Cliente' }) }); expect(createAdminCustomer).toHaveBeenCalledOnce(); expect(updateAdminCustomer).toHaveBeenCalledOnce(); expect(invalidate).toHaveBeenCalledTimes(2) })
})
