import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AttachmentCard } from './AttachmentCard'
import { AttachmentPreview } from './AttachmentPreview'
import { AttachmentUploadDialog } from './AttachmentUploadDialog'
import { ServiceRequestAttachments } from './ServiceRequestAttachments'

const mocks = vi.hoisted(() => ({
  upload: vi.fn(),
  list: vi.fn(),
  download: vi.fn(),
  blobQuery: vi.fn(),
}))

vi.mock('../api/useUploadServiceRequestAttachment', () => ({ useUploadServiceRequestAttachment: () => ({ mutateAsync: mocks.upload }) }))
vi.mock('../api/useServiceRequestAttachments', () => ({ useServiceRequestAttachments: (...args: unknown[]) => mocks.list(...args) }))
vi.mock('../api/useServiceRequestAttachmentBlob', () => ({ useServiceRequestAttachmentBlob: (...args: unknown[]) => mocks.blobQuery(...args) }))
vi.mock('../api/service-request-attachments-api', () => ({ downloadServiceRequestAttachment: (...args: unknown[]) => mocks.download(...args) }))
vi.mock('../../../../auth/useAuth', () => ({ useAuth: () => ({ user: { role: 'ADMIN' } }) }))
vi.mock('../api/useDeleteServiceRequestAttachment', () => ({ useDeleteServiceRequestAttachment: () => ({ mutateAsync: vi.fn(), isPending: false, isError: false }) }))

const attachment = {
  id: '2ad575e6-0225-45ce-bb18-296407bc558b',
  serviceRequestId: '1ad575e6-0225-45ce-bb18-296407bc558b',
  category: 'DOCUMENT' as const,
  originalName: 'cozinha.webp',
  mimeType: 'image/webp',
  sizeBytes: 2048,
  checksum: null,
  caption: 'Durante a instalação',
  createdAt: '2026-08-06T12:00:00.000Z',
  uploadedBy: { id: '3ad575e6-0225-45ce-bb18-296407bc558b', name: 'Ana', email: 'ana@example.com', role: 'ADMIN' as const },
}

beforeEach(() => {
  mocks.upload.mockReset()
  mocks.list.mockReset()
  mocks.download.mockReset()
  mocks.blobQuery.mockReturnValue({ data: new Blob(['img'], { type: 'image/webp' }), isPending: false, isError: false })
  vi.stubGlobal('crypto', { randomUUID: vi.fn(() => String(Math.random())) })
  Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: vi.fn(() => 'blob:preview') })
  Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: vi.fn() })
})

describe('AttachmentUploadDialog', () => {
  it('aceita PDF no input e mostra somente o cartão informativo', async () => {
    render(<AttachmentUploadDialog serviceRequestId={attachment.serviceRequestId} onClose={vi.fn()} onUploaded={vi.fn()} />)
    const input = screen.getByLabelText('Arquivos')
    expect(input).toHaveAttribute('accept', 'image/jpeg,image/png,image/webp,application/pdf')
    await userEvent.upload(input, new File(['pdf'], 'ordem.pdf', { type: 'application/pdf' }))
    expect(screen.getByLabelText('Arquivo PDF: ordem.pdf')).toHaveTextContent('PDF')
    expect(screen.getByText('application/pdf · 3 B')).toBeInTheDocument()
    expect(URL.createObjectURL).not.toHaveBeenCalled()
  })

  it('cria e revoga object URL para preview de imagem', () => {
    const { unmount } = render(<AttachmentPreview file={new File(['img'], 'foto.png', { type: 'image/png' })} />)
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1)
    unmount()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:preview')
  })

  it('seleciona múltiplas imagens, mostra progresso e faz upload com categoria', async () => {
    mocks.upload.mockImplementation(async ({ onProgress }: { onProgress: (value: number) => void }) => { onProgress(65); return attachment })
    const uploaded = vi.fn()
    render(<AttachmentUploadDialog serviceRequestId={attachment.serviceRequestId} onClose={vi.fn()} onUploaded={uploaded} />)
    const files = [new File(['a'], 'antes.png', { type: 'image/png' }), new File(['b'], 'durante.webp', { type: 'image/webp' })]
    await userEvent.upload(screen.getByLabelText('Arquivos'), files)
    await userEvent.selectOptions(screen.getByLabelText('Categoria'), 'DOCUMENT')
    await userEvent.click(screen.getByRole('button', { name: 'Enviar anexos' }))
    await waitFor(() => expect(mocks.upload).toHaveBeenCalledTimes(2))
    expect(mocks.upload.mock.calls[0][0]).toEqual(expect.objectContaining({ category: 'DOCUMENT', signal: expect.any(AbortSignal) }))
    expect(uploaded).toHaveBeenCalled()
  }, 10_000)

  it('aceita drag and drop, exibe validação e permite retry após falha', async () => {
    mocks.upload.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(attachment)
    const uploaded = vi.fn()
    render(<AttachmentUploadDialog serviceRequestId={attachment.serviceRequestId} onClose={vi.fn()} onUploaded={uploaded} />)
    const dropzone = screen.getByText('Arraste arquivos para cá').closest('div')!
    fireEvent.drop(dropzone, { dataTransfer: { files: [new File(['x'], 'foto.png', { type: 'image/png' })] } })
    await userEvent.click(screen.getByRole('button', { name: 'Enviar anexos' }))
    expect(await screen.findByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    await waitFor(() => expect(uploaded).toHaveBeenCalled())
    fireEvent.drop(dropzone, { dataTransfer: { files: [new File(['x'], 'script.svg', { type: 'image/svg+xml' })] } })
    expect(await screen.findByRole('alert')).toHaveTextContent('script.svg')
  })

  it('cancela o AbortSignal de um upload em andamento', async () => {
    mocks.upload.mockImplementation(({ signal }: { signal: AbortSignal }) => new Promise((_, reject) => signal.addEventListener('abort', () => reject(new DOMException('cancelled', 'AbortError')))))
    render(<AttachmentUploadDialog serviceRequestId={attachment.serviceRequestId} onClose={vi.fn()} onUploaded={vi.fn()} />)
    await userEvent.upload(screen.getByLabelText('Arquivos'), new File(['x'], 'foto.png', { type: 'image/png' }))
    await userEvent.click(screen.getByRole('button', { name: 'Enviar anexos' }))
    await userEvent.click(await screen.findByRole('button', { name: 'Cancelar upload' }))
    expect(await screen.findByText('Cancelado')).toBeInTheDocument()
  })
})

describe('AttachmentCard', () => {
  it('exibe miniatura, metadados, preview, download e exclusão', async () => {
    const remove = vi.fn()
    render(<AttachmentCard serviceRequestId={attachment.serviceRequestId} attachment={attachment} canDelete onDelete={remove} />)
    await waitFor(() => expect(screen.getByRole('button', { name: `Visualizar ${attachment.originalName}` })).toBeEnabled())
    expect(screen.getByText('Documento')).toBeInTheDocument()
    expect(screen.getByText('Durante a instalação')).toBeInTheDocument()
    expect(screen.getByText(/Ana/)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: `Visualizar ${attachment.originalName}` }))
    expect(screen.getByRole('dialog', { name: `Visualização de ${attachment.originalName}` })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Fechar visualização' }))
    await userEvent.click(screen.getByRole('button', { name: 'Baixar' }))
    await waitFor(() => expect(mocks.download).toHaveBeenCalledWith(attachment.serviceRequestId, attachment, expect.any(AbortSignal)))
    await userEvent.click(screen.getByRole('button', { name: 'Remover' }))
    expect(remove).toHaveBeenCalledWith(attachment)
  })
})

describe('ServiceRequestAttachments states', () => {
  it('renderiza loading', () => {
    mocks.list.mockReturnValue({ isPending: true, isFetching: true, isError: false })
    render(<ServiceRequestAttachments serviceRequestId={attachment.serviceRequestId} />)
    expect(screen.getByRole('status')).toHaveTextContent('Carregando anexos')
  })

  it('renderiza erro com retry', async () => {
    const refetch = vi.fn()
    mocks.list.mockReturnValue({ isPending: false, isFetching: false, isError: true, error: new Error('offline'), refetch })
    render(<ServiceRequestAttachments serviceRequestId={attachment.serviceRequestId} />)
    await userEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(refetch).toHaveBeenCalled()
  })

  it('renderiza empty state e todas as categorias', () => {
    mocks.list.mockReturnValue({ isPending: false, isFetching: false, isError: false, data: { data: [], pagination: { page: 1, limit: 8, total: 0, totalPages: 0 } } })
    render(<ServiceRequestAttachments serviceRequestId={attachment.serviceRequestId} />)
    expect(screen.getByText('Nenhum anexo encontrado')).toBeInTheDocument()
    expect(screen.getAllByLabelText('Categoria')[0]).toHaveTextContent('Antes do serviçoDepois do serviçoComprovanteDocumentoOutro')
  })
})
