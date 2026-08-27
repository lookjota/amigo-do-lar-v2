import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { toUiError } from '../../../api/errors'
import { useServiceRequest } from '../api/useServiceRequest'
import { useUpdateServiceRequestStatus } from '../api/useUpdateServiceRequestStatus'
import {
  serviceRequestStatusLabels,
  serviceRequestTransitions,
  type ServiceRequestStatus,
} from '../types/contracts'
import { ServiceRequestStatusBadge } from './ServiceRequestStatusBadge'
import { ServiceRequestTimeline } from '../timeline/components/ServiceRequestTimeline'
import { ServiceRequestAttachments } from '../attachments/components/ServiceRequestAttachments'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'long',
  timeStyle: 'short',
})

function formatDate(value: string | null) {
  return value ? dateFormatter.format(new Date(value)) : 'Não informada'
}

function validEmail(value: string | null): value is string {
  return Boolean(value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
}

function validPhone(value: string) {
  const digits = value.replace(/\D/g, '')
  return digits.length === 10 || digits.length === 11
}

interface Props {
  id: string
  onClose: () => void
}

export function ServiceRequestDetails({ id, onClose }: Props) {
  const query = useServiceRequest(id)
  const mutation = useUpdateServiceRequestStatus(id)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [nextStatus, setNextStatus] = useState<ServiceRequestStatus>()
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    closeButtonRef.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  async function updateStatus() {
    if (!nextStatus || mutation.isPending) return
    const label = serviceRequestStatusLabels[nextStatus]
    if (!window.confirm(`Confirmar alteração do status para “${label}”?`)) return
    setSuccessMessage('')
    try {
      await mutation.mutateAsync({ status: nextStatus })
      setNextStatus(undefined)
      setSuccessMessage('Status atualizado com sucesso.')
    } catch {
      // A mensagem segura é renderizada pelo estado da mutação.
    }
  }

  const request = query.data
  const transitions = request ? serviceRequestTransitions[request.status] : []

  return (
    <aside className="amigo-admin-drawer" role="dialog" aria-modal="true" aria-labelledby="request-details-title">
      <div className="amigo-admin-drawer-header">
        <h2 id="request-details-title">Detalhes da solicitação</h2>
        <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Fechar detalhes">Fechar</button>
      </div>
      {query.isPending && <p role="status">Carregando detalhes…</p>}
      {query.isError && (
        <div role="alert" className="amigo-admin-state">
          <p>{toUiError(query.error).userMessage}</p>
          <button type="button" onClick={() => void query.refetch()}>Tentar novamente</button>
        </div>
      )}
      {request && (
        <>
          <dl className="amigo-admin-details-list">
            <div><dt>Cliente</dt><dd>{request.customer.name}</dd></div>
            <div><dt>Telefone</dt><dd>{validPhone(request.customer.phone) ? <a href={`tel:${request.customer.phone.replace(/\D/g, '')}`}>{request.customer.phone}</a> : request.customer.phone}</dd></div>
            <div><dt>E-mail</dt><dd>{validEmail(request.customer.email) ? <a href={`mailto:${request.customer.email}`}>{request.customer.email}</a> : (request.customer.email ?? 'Não informado')}</dd></div>
            <div><dt>Serviço</dt><dd>{request.service.name}</dd></div>
            <div><dt>Status</dt><dd><ServiceRequestStatusBadge status={request.status} /></dd></div>
            <div><dt>Descrição</dt><dd>{request.description}</dd></div>
            <div><dt>Endereço</dt><dd>{request.address ?? 'Não informado'}</dd></div>
            <div><dt>Cidade</dt><dd>{request.city ?? 'Não informada'}</dd></div>
            <div><dt>Data preferencial</dt><dd>{formatDate(request.preferredDate)}</dd></div>
            <div><dt>Notas internas</dt><dd>{request.internalNotes ?? 'Sem notas'}</dd></div>
            <div><dt>Criada em</dt><dd>{formatDate(request.createdAt)}</dd></div>
            <div><dt>Atualizada em</dt><dd>{formatDate(request.updatedAt)}</dd></div>
            {request.completedAt && <div><dt>Concluída em</dt><dd>{formatDate(request.completedAt)}</dd></div>}
            {request.cancelledAt && <div><dt>Cancelada em</dt><dd>{formatDate(request.cancelledAt)}</dd></div>}
          </dl>
          <section className="amigo-admin-status-update" aria-labelledby="status-update-title">
            <h3 id="status-update-title">Alterar status</h3>
            {transitions.length > 0 ? (
              <>
                <label>Próximo status
                  <select value={nextStatus ?? ''} onChange={(event) => setNextStatus(event.target.value as ServiceRequestStatus || undefined)} disabled={mutation.isPending}>
                    <option value="">Selecione</option>
                    {transitions.map((status) => <option key={status} value={status}>{serviceRequestStatusLabels[status]}</option>)}
                  </select>
                </label>
                <button className="amigo-button" type="button" disabled={!nextStatus || mutation.isPending} onClick={() => void updateStatus()}>{mutation.isPending ? 'Atualizando…' : 'Confirmar alteração'}</button>
              </>
            ) : <p>Esta solicitação está em um estado final.</p>}
            {successMessage && <p role="status" className="amigo-form-message amigo-form-message-success">{successMessage}</p>}
            {mutation.isError && <p role="alert" className="amigo-form-message amigo-form-message-error">{toUiError(mutation.error).userMessage}</p>}
          </section>
          {request.status === 'APPROVED' && <Link className="amigo-button" to={`/admin/agenda?serviceRequestId=${encodeURIComponent(request.id)}&create=1`}>Criar agendamento</Link>}
          <ServiceRequestAttachments serviceRequestId={request.id} />
          <ServiceRequestTimeline serviceRequestId={request.id} />
        </>
      )}
    </aside>
  )
}
