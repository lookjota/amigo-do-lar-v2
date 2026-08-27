import { afterEach, describe, expect, it, vi } from 'vitest'
import { authenticatedApiClient } from '../../../../api/apiClient'
import { buildAttachmentListPath, deleteServiceRequestAttachment, listServiceRequestAttachments, uploadServiceRequestAttachment } from './service-request-attachments-api'

vi.mock('../../../../api/apiClient', () => ({ authenticatedApiClient: { get: vi.fn(), post: vi.fn(), delete: vi.fn(), raw: vi.fn() } }))
const requestId = '1ad575e6-0225-45ce-bb18-296407bc558b'
const attachment = { id: '2ad575e6-0225-45ce-bb18-296407bc558b', serviceRequestId: requestId, category: 'DOCUMENT', originalName: 'foto.webp', mimeType: 'image/webp', sizeBytes: 10, checksum: null, caption: null, createdAt: '2026-08-06T12:00:00.000Z', uploadedBy: { id: '3ad575e6-0225-45ce-bb18-296407bc558b', name: 'Ana', email: 'ana@example.com', role: 'ADMIN' } }

afterEach(() => vi.clearAllMocks())
describe('service request attachments API', () => {
  it('monta filtros e encaminha AbortSignal', async () => {
    vi.mocked(authenticatedApiClient.get).mockResolvedValue({ data: [attachment], pagination: { page: 2, limit: 8, total: 9, totalPages: 2 } })
    const signal = new AbortController().signal
    await listServiceRequestAttachments(requestId, { page: 2, limit: 8, category: 'DOCUMENT', sortOrder: 'asc' }, signal)
    expect(buildAttachmentListPath(requestId, { page: 2, limit: 8, category: 'DOCUMENT', sortOrder: 'asc' })).toContain('category=DOCUMENT')
    expect(authenticatedApiClient.get).toHaveBeenCalledWith(expect.stringContaining('sortOrder=asc'), { signal })
  })
  it('envia DOCUMENT sem adaptação e sem Content-Type manual', async () => {
    vi.mocked(authenticatedApiClient.post).mockResolvedValue(attachment)
    const signal = new AbortController().signal
    await uploadServiceRequestAttachment(requestId, { file: new File(['img'], 'foto.webp', { type: 'image/webp' }), category: 'DOCUMENT', caption: ' Foto ', signal })
    const form = vi.mocked(authenticatedApiClient.post).mock.calls[0][1]
    expect(form).toBeInstanceOf(FormData)
    expect(Array.from((form as FormData).keys())).toEqual(['file', 'category', 'caption'])
    expect((form as FormData).get('caption')).toBe('Foto')
    expect((form as FormData).get('category')).toBe('DOCUMENT')
    expect(authenticatedApiClient.post).toHaveBeenCalledWith(expect.any(String), form, { signal })
  })
  it('remove pelo endpoint da solicitação sem payload', async () => {
    vi.mocked(authenticatedApiClient.delete).mockResolvedValue(undefined)
    const signal = new AbortController().signal
    await deleteServiceRequestAttachment(requestId, attachment.id, signal)
    expect(authenticatedApiClient.delete).toHaveBeenCalledWith(`/service-requests/${requestId}/attachments/${attachment.id}`, { signal })
  })
  it('rejeita resposta com campos públicos extras', async () => {
    vi.mocked(authenticatedApiClient.get).mockResolvedValue({ data: [{ ...attachment, storageKey: 'secret' }], pagination: { page: 1, limit: 8, total: 1, totalPages: 1 } })
    await expect(listServiceRequestAttachments(requestId, { page: 1, limit: 8, sortOrder: 'desc' }, new AbortController().signal)).rejects.toThrow()
  })
})
