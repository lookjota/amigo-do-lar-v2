import { Link } from 'react-router-dom'
import { ServiceRequestStatusBadge } from '../../service-requests/components/ServiceRequestStatusBadge'
import type { AdminServiceRequest } from '../../service-requests/types/contracts'

const dateTime = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

export function RecentServiceRequests({ requests }: { requests: AdminServiceRequest[] }) {
  if (requests.length === 0) return <p className="amigo-dashboard-empty">Nenhuma solicitação encontrada.</p>
  return <ul className="amigo-dashboard-list">{requests.map((request) => <li key={request.id}><div><strong>{request.customer.name}</strong><span>{request.service.name}</span></div><div><ServiceRequestStatusBadge status={request.status} /><time dateTime={request.createdAt}>{dateTime.format(new Date(request.createdAt))}</time></div><Link to={`/admin/solicitacoes?request=${encodeURIComponent(request.id)}`} aria-label={`Abrir solicitação de ${request.customer.name}`}>Abrir</Link></li>)}</ul>
}
