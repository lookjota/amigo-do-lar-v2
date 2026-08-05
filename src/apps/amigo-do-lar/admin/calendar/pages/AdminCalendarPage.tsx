import { useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { toUiError } from '../../../api/errors'
import { AdminPageMetadata } from '../../../components/AdminPageMetadata'
import { AppointmentDetails } from '../../appointments/components/AppointmentDetails'
import { useCalendarAppointments } from '../api/useCalendarAppointments'
import { CalendarEmptyState } from '../components/CalendarEmptyState'
import { CalendarLegend } from '../components/CalendarLegend'
import { CalendarToolbar } from '../components/CalendarToolbar'
import { CalendarView } from '../components/CalendarView'
import { formatLocalDate, getCalendarRange, navigateCalendar, parseLocalDate, type CalendarView as CalendarViewType } from '../utils/calendar-range'

const views: CalendarViewType[] = ['day', 'week', 'month']
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const periodTitle = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
const monthTitle = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })

export function AdminCalendarPage() {
  const [params, setParams] = useSearchParams()
  const view = views.find((item) => item === params.get('view')) ?? 'week'
  const date = parseLocalDate(params.get('date'))
  const selectedId = uuid.test(params.get('appointment') ?? '') ? params.get('appointment') ?? undefined : undefined
  const range = getCalendarRange(date, view)
  const query = useCalendarAppointments(range)
  const appointments = query.data?.pages.flatMap((page) => page.data) ?? []
  const total = query.data?.pages[0]?.pagination.total ?? 0
  const updateParams = useCallback((updates: Record<string, string | undefined>) => setParams((current) => {
    const next = new URLSearchParams(current)
    Object.entries(updates).forEach(([key, value]) => value ? next.set(key, value) : next.delete(key))
    return next
  }, { replace: true, preventScrollReset: true }), [setParams])
  const title = view === 'month' ? monthTitle.format(date) : view === 'day'
    ? periodTitle.format(date)
    : `${periodTitle.format(range.start)} – ${periodTitle.format(range.end)}`
  function setDate(next: Date) { updateParams({ date: formatLocalDate(next), appointment: undefined }) }
  return <main id="conteudo-principal" className="amigo-admin-page amigo-calendar-page">
    <AdminPageMetadata title="Calendário — Amigo do Lar" />
    <header className="amigo-admin-header"><div><p className="amigo-eyebrow">Portal administrativo</p><h1>Calendário operacional</h1></div><Link className="amigo-button amigo-button-secondary" to="/admin/agenda">Ver agenda em lista</Link></header>
    <section className="amigo-calendar-card" aria-label="Calendário de agendamentos">
      <CalendarToolbar view={view} title={title} onToday={() => setDate(new Date())} onNavigate={(direction) => setDate(navigateCalendar(date, view, direction))} onView={(nextView) => updateParams({ view: nextView === 'week' ? undefined : nextView, appointment: undefined })} />
      <CalendarLegend />
      {query.isPending && <div className="amigo-admin-state" role="status">Carregando calendário…</div>}
      {query.isError && <div className="amigo-admin-state" role="alert"><p>{toUiError(query.error).userMessage}</p><button type="button" onClick={() => void query.refetch()}>Tentar novamente</button></div>}
      {!query.isError && !query.isPending && total === 0 && <CalendarEmptyState />}
      {appointments.length > 0 && <CalendarView view={view} focusDate={date} start={range.start} end={range.end} appointments={appointments} onOpen={(id) => updateParams({ appointment: id })} />}
      {query.hasNextPage && <div className="amigo-calendar-pagination" role="status"><p>Exibindo {appointments.length} de {total} agendamentos deste período.</p><button type="button" disabled={query.isFetchingNextPage} onClick={() => void query.fetchNextPage()}>{query.isFetchingNextPage ? 'Carregando…' : 'Carregar mais agendamentos'}</button></div>}
      {!query.hasNextPage && total > 0 && <p className="amigo-calendar-total" role="status">Todos os {total} agendamentos do período estão exibidos.</p>}
    </section>
    {selectedId && <AppointmentDetails id={selectedId} onClose={() => updateParams({ appointment: undefined })} />}
  </main>
}
