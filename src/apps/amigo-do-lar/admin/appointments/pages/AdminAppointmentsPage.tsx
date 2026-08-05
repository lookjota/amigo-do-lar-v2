import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AdminPageMetadata } from '../../../components/AdminPageMetadata'
import { toUiError } from '../../../api/errors'
import { useAppointments } from '../api/useAppointments'
import { AppointmentCreateDialog } from '../components/AppointmentCreateDialog'
import { AppointmentCancelDialog } from '../components/AppointmentCancelDialog'
import { AppointmentDetails } from '../components/AppointmentDetails'
import { AppointmentFilters, type AppointmentFilterValues } from '../components/AppointmentFilters'
import { AppointmentsTable } from '../components/AppointmentsTable'
import { Pagination } from '../components/Pagination'
import { appointmentStatuses, type AdminAppointmentFilters } from '../types/contracts'
import { localDateTimeToIso } from '../validation/appointment-schema'

const PAGE_SIZE = 20
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
function boundary(value: string | null, end = false) { return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? localDateTimeToIso(value, end ? '23:59' : '00:00') : undefined }
export function AdminAppointmentsPage() {
  const [params, setParams] = useSearchParams()
  const pageValue = Number(params.get('page'))
  const page = Number.isInteger(pageValue) && pageValue >= 1 ? pageValue : 1
  const status = appointmentStatuses.find((item) => item === params.get('status'))
  const fromInput = params.get('scheduledFrom') ?? undefined
  const toInput = params.get('scheduledTo') ?? undefined
  const scheduledFrom = boundary(fromInput ?? null)
  const scheduledTo = boundary(toInput ?? null, true)
  const validPeriod = !scheduledFrom || !scheduledTo || scheduledFrom <= scheduledTo
  const selectedId = uuid.test(params.get('appointment') ?? '') ? params.get('appointment') ?? undefined : undefined
  const serviceRequestId = uuid.test(params.get('serviceRequestId') ?? '') ? params.get('serviceRequestId') ?? undefined : undefined
  const customerId = uuid.test(params.get('customerId') ?? '') ? params.get('customerId') ?? undefined : undefined
  const showCreate = params.get('create') === '1'
  const editSelected = params.get('edit') === '1'
  const cancelId = uuid.test(params.get('cancel') ?? '') ? params.get('cancel') ?? undefined : undefined
  const filters = useMemo<AdminAppointmentFilters>(() => ({ page, limit: PAGE_SIZE, status, customerId, scheduledFrom: validPeriod ? scheduledFrom : undefined, scheduledTo: validPeriod ? scheduledTo : undefined, sortBy: 'scheduledAt', sortOrder: 'asc' }), [customerId, page, scheduledFrom, scheduledTo, status, validPeriod])
  const query = useAppointments(filters)
  const [success, setSuccess] = useState('')
  const updateParams = useCallback((updates: Record<string, string | undefined>) => setParams((current) => { const next = new URLSearchParams(current); Object.entries(updates).forEach(([key, value]) => { if (value) next.set(key, value); else next.delete(key) }); return next }, { replace: true, preventScrollReset: true }), [setParams])
  function applyFilters(values: AppointmentFilterValues) { updateParams({ page: undefined, status: values.status, scheduledFrom: values.scheduledFrom, scheduledTo: values.scheduledTo, appointment: undefined }) }
  const pagination = query.data?.pagination
  useEffect(() => { if (pagination && pagination.totalPages > 0 && page > pagination.totalPages) updateParams({ page: String(pagination.totalPages) }) }, [page, pagination, updateParams])
  return <main id="conteudo-principal" className="amigo-admin-page amigo-admin-requests-page"><AdminPageMetadata title="Agenda — Amigo do Lar" /><header className="amigo-admin-header"><div><p className="amigo-eyebrow">Portal administrativo</p><h1>Agenda de atendimentos</h1></div><div className="amigo-admin-header-actions"><button className="amigo-button" type="button" onClick={() => updateParams({ create: '1', appointment: undefined })}>Novo agendamento</button><Link className="amigo-button amigo-button-secondary" to="/admin">Dashboard</Link></div></header>
    <section className="amigo-admin-card" aria-label="Filtros e agendamentos"><AppointmentFilters key={`${status ?? ''}-${fromInput ?? ''}-${toInput ?? ''}`} values={{ status, scheduledFrom: fromInput, scheduledTo: toInput }} onApply={applyFilters} onClear={() => setParams({}, { replace: true })} />{!validPeriod && <p role="alert" className="amigo-form-message amigo-form-message-error">O início do período deve ser anterior ao fim.</p>}{query.isFetching && <p role="status" className="amigo-admin-refresh">Atualizando agenda…</p>}{query.isError && <div role="alert" className="amigo-admin-state"><p>{toUiError(query.error).userMessage}</p><button onClick={() => void query.refetch()}>Tentar novamente</button></div>}{query.data?.data.length === 0 && <div className="amigo-admin-state"><h2>Nenhum agendamento encontrado</h2><p>Ajuste ou limpe os filtros.</p><button type="button" onClick={() => updateParams({ create: '1' })}>Criar primeiro agendamento</button></div>}{query.data && query.data.data.length > 0 && <AppointmentsTable appointments={query.data.data} onDetails={(id) => updateParams({ appointment: id, edit: undefined })} onEdit={(id) => updateParams({ appointment: id, edit: '1' })} onCancel={(id) => updateParams({ cancel: id })} />}{pagination && <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={(next) => updateParams({ page: next === 1 ? undefined : String(next), appointment: undefined })} />}</section>
    {showCreate && <AppointmentCreateDialog initialServiceRequestId={serviceRequestId} onClose={() => updateParams({ create: undefined, serviceRequestId: undefined })} onCreated={(id) => { updateParams({ create: undefined, serviceRequestId: undefined, appointment: id }); setSuccess('Agendamento criado com sucesso.') }} />}
    {selectedId && <AppointmentDetails key={`${selectedId}-${editSelected}`} id={selectedId} initialEdit={editSelected} onClose={() => updateParams({ appointment: undefined, edit: undefined })} />}{cancelId && <AppointmentCancelDialog id={cancelId} onClose={() => updateParams({ cancel: undefined })} onCancelled={() => { updateParams({ cancel: undefined }); setSuccess('Agendamento cancelado. O registro foi mantido no histórico.') }} />}{success && <p role="status" className="amigo-form-message amigo-form-message-success">{success}</p>}</main>
}
