import { useCallback, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AdminPageMetadata } from '../../../components/AdminPageMetadata'
import { toUiError } from '../../../api/errors'
import { useServiceRequests } from '../api/useServiceRequests'
import { Pagination } from '../components/Pagination'
import { ServiceRequestDetails } from '../components/ServiceRequestDetails'
import {
  ServiceRequestFilters,
  type ServiceRequestFilterValues,
} from '../components/ServiceRequestFilters'
import { ServiceRequestsTable } from '../components/ServiceRequestsTable'
import {
  serviceRequestStatuses,
  type AdminServiceRequestFilters,
} from '../types/contracts'

const PAGE_SIZE = 20
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function dateStart(value: string | null) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T00:00:00.000Z`
    : undefined
}

function dateEnd(value: string | null) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T23:59:59.999Z`
    : undefined
}

export function AdminServiceRequestsPage() {
  const [params, setParams] = useSearchParams()
  const pageValue = Number(params.get('page'))
  const page = Number.isInteger(pageValue) && pageValue >= 1 ? pageValue : 1
  const rawStatus = params.get('status')
  const status = serviceRequestStatuses.find((item) => item === rawStatus)
  const search = params.get('search')?.trim() || undefined
  const createdFromInput = params.get('createdFrom') ?? undefined
  const createdToInput = params.get('createdTo') ?? undefined
  const selectedId = params.get('request') ?? undefined
  const customerId = uuid.test(params.get('customerId') ?? '') ? params.get('customerId') ?? undefined : undefined
  const createdFrom = dateStart(createdFromInput ?? null)
  const createdTo = dateEnd(createdToInput ?? null)
  const validPeriod = !createdFrom || !createdTo || createdFrom <= createdTo

  const filters = useMemo<AdminServiceRequestFilters>(() => ({
    page,
    limit: PAGE_SIZE,
    search,
    status,
    customerId,
    createdFrom: validPeriod ? createdFrom : undefined,
    createdTo: validPeriod ? createdTo : undefined,
  }), [createdFrom, createdTo, customerId, page, search, status, validPeriod])
  const query = useServiceRequests(filters)

  const updateParams = useCallback((updates: Record<string, string | undefined>) => {
    setParams((current) => {
      const next = new URLSearchParams(current)
      Object.entries(updates).forEach(([key, value]) => {
        if (value) next.set(key, value)
        else next.delete(key)
      })
      return next
    }, { replace: true, preventScrollReset: true })
  }, [setParams])

  function applyFilters(values: ServiceRequestFilterValues) {
    updateParams({
      page: undefined,
      search: values.search,
      status: values.status,
      createdFrom: values.createdFrom,
      createdTo: values.createdTo,
      request: undefined,
    })
  }

  const pagination = query.data?.pagination

  useEffect(() => {
    if (pagination && pagination.totalPages > 0 && page > pagination.totalPages) {
      updateParams({ page: String(pagination.totalPages) })
    }
  }, [page, pagination, updateParams])

  return (
    <main id="conteudo-principal" className="amigo-admin-page amigo-admin-requests-page">
      <AdminPageMetadata title="Solicitações — Amigo do Lar" />
      <header className="amigo-admin-header">
        <div><p className="amigo-eyebrow">Portal administrativo</p><h1>Solicitações de atendimento</h1></div>
        <Link className="amigo-button amigo-button-secondary" to="/admin">Dashboard</Link>
      </header>
      <section className="amigo-admin-card" aria-label="Filtros e resultados">
        <ServiceRequestFilters
          key={`${search ?? ''}-${status ?? ''}-${createdFromInput ?? ''}-${createdToInput ?? ''}`}
          values={{ search, status, createdFrom: createdFromInput, createdTo: createdToInput }}
          onApply={applyFilters}
          onClear={() => setParams({}, { replace: true })}
        />
        {!validPeriod && <p role="alert" className="amigo-form-message amigo-form-message-error">O início do período deve ser anterior ao fim.</p>}
        {query.isFetching && <p className="amigo-admin-refresh" role="status">Atualizando solicitações…</p>}
        {query.isError && (
          <div className="amigo-admin-state" role="alert"><p>{toUiError(query.error).userMessage}</p><button type="button" onClick={() => void query.refetch()}>Tentar novamente</button></div>
        )}
        {query.data && query.data.data.length === 0 && <div className="amigo-admin-state"><h2>Nenhuma solicitação encontrada</h2><p>Ajuste ou limpe os filtros para consultar novamente.</p></div>}
        {query.data && query.data.data.length > 0 && <ServiceRequestsTable requests={query.data.data} onDetails={(id) => updateParams({ request: id })} />}
        {pagination && <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={(nextPage) => updateParams({ page: nextPage === 1 ? undefined : String(nextPage), request: undefined })} />}
      </section>
      {selectedId && <ServiceRequestDetails id={selectedId} onClose={() => updateParams({ request: undefined })} />}
    </main>
  )
}
