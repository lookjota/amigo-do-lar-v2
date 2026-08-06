import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createServiceRequestComment, listServiceRequestTimeline } from './service-request-timeline-api'
import { useCreateTimelineComment } from './useCreateTimelineComment'
import { useServiceRequestTimeline } from './useServiceRequestTimeline'

vi.mock('./service-request-timeline-api', () => ({ listServiceRequestTimeline: vi.fn(), createServiceRequestComment: vi.fn() }))
const id = '1ad575e6-0225-45ce-bb18-296407bc558b'
function setup() { const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } }); const Wrapper = ({ children }: PropsWithChildren) => <QueryClientProvider client={client}>{children}</QueryClientProvider>; return { client, Wrapper } }
afterEach(() => vi.clearAllMocks())
describe('hooks da timeline', () => {
  it('carrega, pagina e troca filtro', async () => { vi.mocked(listServiceRequestTimeline).mockResolvedValueOnce({ data: [], pagination: { page: 1, limit: 10, total: 11, totalPages: 2 } }).mockResolvedValueOnce({ data: [], pagination: { page: 2, limit: 10, total: 11, totalPages: 2 } }).mockResolvedValueOnce({ data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } }); const { Wrapper } = setup(); const { result, rerender } = renderHook(({ type }: { type?: 'COMMENT_ADDED' }) => useServiceRequestTimeline(id, type), { initialProps: { type: undefined } as { type?: 'COMMENT_ADDED' }, wrapper: Wrapper }); expect(result.current.isPending).toBe(true); await waitFor(() => expect(result.current.hasNextPage).toBe(true)); await act(async () => { await result.current.fetchNextPage() }); rerender({ type: 'COMMENT_ADDED' }); await waitFor(() => expect(listServiceRequestTimeline).toHaveBeenCalledTimes(3)); expect(vi.mocked(listServiceRequestTimeline).mock.calls[0][1]).toMatchObject({ page: 1, sortOrder: 'desc' }); expect(vi.mocked(listServiceRequestTimeline).mock.calls[0][2]).toBeInstanceOf(AbortSignal) })
  it('expõe erro, retry e cancelamento', async () => { vi.mocked(listServiceRequestTimeline).mockRejectedValueOnce(new Error('offline')).mockReturnValueOnce(new Promise(() => undefined)); const { Wrapper } = setup(); const { result, unmount } = renderHook(() => useServiceRequestTimeline(id), { wrapper: Wrapper }); await waitFor(() => expect(result.current.isError).toBe(true)); void result.current.refetch(); await waitFor(() => expect(listServiceRequestTimeline).toHaveBeenCalledTimes(2)); const signal = vi.mocked(listServiceRequestTimeline).mock.calls[1][2]; unmount(); expect(signal?.aborted).toBe(true) })
  it('cria comentário e invalida timeline e detalhe', async () => { vi.mocked(createServiceRequestComment).mockResolvedValue({} as never); const { client, Wrapper } = setup(); const invalidate = vi.spyOn(client, 'invalidateQueries'); const { result } = renderHook(() => useCreateTimelineComment(id), { wrapper: Wrapper }); await act(async () => { await result.current.mutateAsync({ content: 'Nota' }) }); expect(createServiceRequestComment).toHaveBeenCalledWith(id, { content: 'Nota' }); expect(invalidate).toHaveBeenCalledTimes(2) })
})
