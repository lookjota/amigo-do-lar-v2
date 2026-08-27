import { useState } from 'react'
import { useAuth } from '../../../../auth/useAuth'
import { toUiError } from '../../../../api/errors'
import { useServiceRequestAttachments } from '../api/useServiceRequestAttachments'
import { attachmentCategories, type AttachmentCategory, type ServiceRequestAttachment } from '../types/contracts'
import { attachmentCategoryLabels } from '../utils/attachment-labels'
import { AttachmentCard } from './AttachmentCard'
import { AttachmentDeleteDialog } from './AttachmentDeleteDialog'
import { AttachmentUploadDialog } from './AttachmentUploadDialog'

const LIMIT = 8
export function ServiceRequestAttachments({ serviceRequestId }: { serviceRequestId: string }) {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState<AttachmentCategory>()
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [deleting, setDeleting] = useState<ServiceRequestAttachment>()
  const [message, setMessage] = useState('')
  const query = useServiceRequestAttachments(serviceRequestId, { page, limit: LIMIT, category, sortOrder })
  const pagination = query.data?.pagination
  function updateCategory(next?: AttachmentCategory) { setCategory(next); setPage(1) }
  return <section id="service-request-attachments" className="amigo-admin-status-update amigo-attachments" aria-labelledby="attachments-title">
    <header className="amigo-attachments-header"><div><h3 id="attachments-title">Anexos</h3><p>{query.data ? `${query.data.pagination.total} anexo(s)` : 'Imagens da solicitação'}</p></div><button className="amigo-button" type="button" onClick={() => { setMessage(''); setUploadOpen(true) }}>Adicionar anexos</button></header>
    <div className="amigo-attachment-filters">
      <label>Categoria<select value={category ?? ''} onChange={(event) => updateCategory((event.target.value || undefined) as AttachmentCategory | undefined)}><option value="">Todas</option>{attachmentCategories.map((item) => <option key={item} value={item}>{attachmentCategoryLabels[item]}</option>)}</select></label>
      <label>Ordenação<select value={sortOrder} onChange={(event) => { setSortOrder(event.target.value as 'asc' | 'desc'); setPage(1) }}><option value="desc">Mais recentes</option><option value="asc">Mais antigos</option></select></label>
    </div>
    <div aria-live="polite">{message && <p className="amigo-form-message amigo-form-message-success" role="status">{message}</p>}{query.isPending && <div className="amigo-attachment-skeleton" role="status">Carregando anexos…</div>}{query.isFetching && !query.isPending && <p role="status">Atualizando anexos…</p>}</div>
    {query.isError && <div role="alert" className="amigo-admin-state"><p>{toUiError(query.error).userMessage}</p><button type="button" onClick={() => void query.refetch()}>Tentar novamente</button></div>}
    {query.data?.data.length === 0 && <div className="amigo-admin-state"><h4>Nenhum anexo encontrado</h4><p>Adicione imagens ou altere os filtros.</p></div>}
    {query.data && query.data.data.length > 0 && <ul className="amigo-attachment-grid" aria-label="Anexos da solicitação">{query.data.data.map((attachment) => <AttachmentCard key={attachment.id} serviceRequestId={serviceRequestId} attachment={attachment} canDelete={user?.role === 'ADMIN'} onDelete={setDeleting} />)}</ul>}
    {pagination && pagination.totalPages > 1 && <nav className="amigo-attachment-pagination" aria-label="Paginação dos anexos"><button type="button" disabled={page <= 1 || query.isFetching} onClick={() => setPage((value) => value - 1)}>Anterior</button><span>Página {pagination.page} de {pagination.totalPages}</span><button type="button" disabled={page >= pagination.totalPages || query.isFetching} onClick={() => setPage((value) => value + 1)}>Próxima</button></nav>}
    {uploadOpen && <AttachmentUploadDialog serviceRequestId={serviceRequestId} onClose={() => setUploadOpen(false)} onUploaded={() => { setUploadOpen(false); setPage(1); setMessage('Anexo enviado com sucesso.') }} />}
    {deleting && user?.role === 'ADMIN' && <AttachmentDeleteDialog serviceRequestId={serviceRequestId} attachment={deleting} onClose={() => setDeleting(undefined)} onDeleted={() => { setDeleting(undefined); setMessage('Anexo removido com sucesso.') }} />}
  </section>
}
