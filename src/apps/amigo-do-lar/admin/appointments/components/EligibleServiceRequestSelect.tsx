import { useState } from 'react'
import { toUiError } from '../../../api/errors'
import { useServiceRequests } from '../../service-requests/api/useServiceRequests'

const PAGE_SIZE = 10
const preferredDate = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' })

export function EligibleServiceRequestSelect({ value, disabled, onChange }: { value: string; disabled: boolean; onChange: (id: string) => void }) {
  const [page, setPage] = useState(1)
  const query = useServiceRequests({ page, limit: PAGE_SIZE, status: 'APPROVED', sortBy: 'preferredDate', sortOrder: 'asc' })
  const pagination = query.data?.pagination
  return <fieldset className="amigo-eligible-requests" disabled={disabled}>
    <legend>Solicitação elegível</legend>
    {query.isPending && <p role="status">Carregando solicitações aprovadas…</p>}
    {query.isError && <div role="alert"><p>{toUiError(query.error).userMessage}</p><button type="button" onClick={() => void query.refetch()}>Tentar novamente</button></div>}
    {query.data?.data.length === 0 && <p>Nenhuma solicitação aprovada disponível nesta página.</p>}
    {query.data?.data.map((request) => <label className="amigo-eligible-request" key={request.id}>
      <input type="radio" name="serviceRequestId" value={request.id} checked={value === request.id} onChange={() => onChange(request.id)} />
      <span><strong>{request.customer.name} — {request.service.name}</strong><small>{request.city ?? 'Cidade não informada'} · {request.description}</small>{request.preferredDate && <small>Preferência: {preferredDate.format(new Date(request.preferredDate))}</small>}</span>
    </label>)}
    {pagination && pagination.totalPages > 1 && <div className="amigo-admin-pagination" aria-label="Paginação de solicitações elegíveis"><button type="button" disabled={page <= 1 || query.isFetching} onClick={() => setPage((current) => current - 1)}>Anteriores</button><span>Página {page} de {pagination.totalPages}</span><button type="button" disabled={page >= pagination.totalPages || query.isFetching} onClick={() => setPage((current) => current + 1)}>Carregar mais solicitações</button></div>}
  </fieldset>
}
