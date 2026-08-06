import { afterEach, describe, expect, it, vi } from 'vitest'
import { HttpError, NetworkError } from '../../../../../shared/http'
import { authenticatedApiClient } from '../../../api/apiClient'
import { buildNotificationsPath, getUnreadNotificationCount, listNotifications, markAllNotificationsAsRead, markNotificationAsRead } from './notifications-admin-api'

const id = '1ad575e6-0225-45ce-bb18-296407bc558b'
const item = { id, type: 'COMMENT_ADDED' as const, title: 'Comentário', message: 'Novo comentário.', resourceType: 'SERVICE_REQUEST' as const, resourceId: null, metadata: { unexpected: true }, readAt: null, createdAt: '2026-08-05T12:00:00.000Z', actor: null }
afterEach(() => vi.restoreAllMocks())
describe('notifications admin API', () => {
  it('monta somente filtros reais e não envia destinatário', () => { const path = buildNotificationsPath({ page: 2, limit: 5, unreadOnly: true, type: 'COMMENT_ADDED', resourceType: 'SERVICE_REQUEST', sortOrder: 'asc' }); expect(path).toBe('/notifications?page=2&limit=5&sortOrder=asc&unreadOnly=true&type=COMMENT_ADDED&resourceType=SERVICE_REQUEST'); expect(path).not.toContain('recipientUserId') })
  it('preserva AbortSignal e aceita metadata desconhecido', async () => { const signal = new AbortController().signal; const response = { data: [item], pagination: { page: 1, limit: 5, total: 1, totalPages: 1 } }; const get = vi.spyOn(authenticatedApiClient, 'get').mockResolvedValue(response); await expect(listNotifications({ page: 1, limit: 5, sortOrder: 'desc' }, signal)).resolves.toEqual(response); expect(get).toHaveBeenCalledWith('/notifications?page=1&limit=5&sortOrder=desc', { signal }) })
  it('consulta contador e usa PATCH sem dados do usuário', async () => { const get = vi.spyOn(authenticatedApiClient, 'get').mockResolvedValue({ count: 3 }); const patch = vi.spyOn(authenticatedApiClient, 'patch').mockResolvedValueOnce({ ...item, readAt: '2026-08-05T13:00:00.000Z' }).mockResolvedValueOnce({ updatedCount: 3 }); expect(await getUnreadNotificationCount()).toEqual({ count: 3 }); await markNotificationAsRead(id); await markAllNotificationsAsRead(); expect(get).toHaveBeenCalledWith('/notifications/unread-count', { signal: undefined }); expect(patch).toHaveBeenNthCalledWith(1, `/notifications/${id}/read`, {}); expect(patch).toHaveBeenNthCalledWith(2, '/notifications/read-all', {}) })
  it('rejeita respostas inválidas', async () => { vi.spyOn(authenticatedApiClient, 'get').mockResolvedValue({ count: -1 }); await expect(getUnreadNotificationCount()).rejects.toMatchObject({ name: 'ZodError' }) })
  it.each([401, 403, 404])('preserva erro HTTP %s', async (status) => { const error = new HttpError({ status, statusText: 'Error', responseBody: {}, url: '/notifications', method: 'GET' }); vi.spyOn(authenticatedApiClient, 'get').mockRejectedValue(error); await expect(getUnreadNotificationCount()).rejects.toBe(error) })
  it('preserva erro de rede e nunca usa DELETE', async () => { const error = new NetworkError(); const remove = vi.spyOn(authenticatedApiClient, 'delete'); vi.spyOn(authenticatedApiClient, 'get').mockRejectedValue(error); await expect(getUnreadNotificationCount()).rejects.toBe(error); expect(remove).not.toHaveBeenCalled() })
})

