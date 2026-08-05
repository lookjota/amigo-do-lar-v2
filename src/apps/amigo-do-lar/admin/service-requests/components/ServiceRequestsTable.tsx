import type { AdminServiceRequest } from '../types/contracts'
import { ServiceRequestStatusBadge } from './ServiceRequestStatusBadge'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

export function ServiceRequestsTable({
  requests,
  onDetails,
}: {
  requests: AdminServiceRequest[]
  onDetails: (id: string) => void
}) {
  return (
    <div className="amigo-admin-table-wrap">
      <table className="amigo-admin-table">
        <caption className="amigo-visually-hidden">Solicitações de atendimento</caption>
        <thead><tr><th scope="col">Cliente</th><th scope="col">Serviço</th><th scope="col">Cidade</th><th scope="col">Status</th><th scope="col">Criação</th><th scope="col"><span className="amigo-visually-hidden">Ações</span></th></tr></thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td data-label="Cliente">{request.customer.name}</td>
              <td data-label="Serviço">{request.service.name}</td>
              <td data-label="Cidade">{request.city ?? 'Não informada'}</td>
              <td data-label="Status"><ServiceRequestStatusBadge status={request.status} /></td>
              <td data-label="Criação"><time dateTime={request.createdAt}>{dateFormatter.format(new Date(request.createdAt))}</time></td>
              <td><button className="amigo-button amigo-button-secondary" type="button" onClick={() => onDetails(request.id)} aria-label={`Ver detalhes da solicitação de ${request.customer.name}`}>Detalhes</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
