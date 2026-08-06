import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toUiError } from '../../../api/errors'
import { AdminPageMetadata } from '../../../components/AdminPageMetadata'
import { Pagination } from '../../appointments/components/Pagination'
import { useMarkAllNotificationsAsRead, useMarkNotificationAsRead, useNotifications, useUnreadNotificationCount } from '../api/notification-hooks'
import { NotificationFilters } from '../components/NotificationFilters'
import { NotificationList } from '../components/NotificationList'
import { notificationResourceTypes, notificationTypes, type Notification, type NotificationFilters as Filters } from '../types/contracts'
import { getNotificationTarget } from '../utils/notification-navigation'

const PAGE_SIZE = 20
export function AdminNotificationsPage() {
  const [params, setParams] = useSearchParams(); const navigate = useNavigate(); const [feedback, setFeedback] = useState('')
  const pageValue = Number(params.get('page')); const page = Number.isInteger(pageValue) && pageValue >= 1 ? pageValue : 1
  const type = notificationTypes.find((value) => value === params.get('type')); const resourceType = notificationResourceTypes.find((value) => value === params.get('resourceType'))
  const filters = useMemo<Filters>(() => ({ page, limit: PAGE_SIZE, unreadOnly: params.get('unreadOnly') === 'true' || undefined, type, resourceType, sortOrder: params.get('sortOrder') === 'asc' ? 'asc' : 'desc' }), [page, params, resourceType, type])
  const query = useNotifications(filters); const count = useUnreadNotificationCount(); const mark = useMarkNotificationAsRead(); const markAll = useMarkAllNotificationsAsRead()
  const update = useCallback((changes: Partial<Filters>) => setParams((current) => { const next = new URLSearchParams(current); Object.entries(changes).forEach(([key, value]) => { if (value === undefined || value === false || (typeof value === 'string' && value.length === 0) || (key === 'page' && value === 1) || (key === 'sortOrder' && value === 'desc')) next.delete(key); else next.set(key, String(value)) }); return next }, { replace: true, preventScrollReset: true }), [setParams])
  const pagination = query.data?.pagination
  useEffect(() => { if (pagination && pagination.totalPages > 0 && page > pagination.totalPages) update({ page: pagination.totalPages }) }, [page, pagination, update])
  async function open(item: Notification) { if (!item.readAt && !mark.isPending) { try { await mark.mutateAsync(item.id) } catch { setFeedback('Não foi possível marcar como lida. Você ainda pode acessar o recurso.') } } navigate(getNotificationTarget(item)) }
  async function readAll() { try { const result = await markAll.mutateAsync(); setFeedback(result.updatedCount > 0 ? `${result.updatedCount} notificações marcadas como lidas.` : 'Não havia notificações pendentes.') } catch { setFeedback('Não foi possível marcar todas as notificações como lidas.') } }
  return <main id="conteudo-principal" className="amigo-admin-page amigo-notifications-page"><AdminPageMetadata title="Notificações — Amigo do Lar" />
    <header className="amigo-admin-header"><div><p className="amigo-eyebrow">Portal administrativo</p><h1>Centro de notificações</h1><p>Acompanhe atualizações operacionais destinadas à sua conta.</p></div><div><strong aria-live="polite">{count.data?.count ?? 0} não lidas</strong>{(count.data?.count ?? 0) > 0 && <button className="amigo-button" type="button" disabled={markAll.isPending} onClick={() => void readAll()}>{markAll.isPending ? 'Marcando…' : 'Marcar todas como lidas'}</button>}</div></header>
    {feedback && <p className="amigo-form-message" role="status" aria-live="polite">{feedback}</p>}
    <section className="amigo-admin-card" aria-label="Filtros e notificações"><NotificationFilters filters={filters} onChange={update} />
      {query.isFetching && <p role="status" className="amigo-admin-refresh">Atualizando notificações…</p>}
      {query.isError && <div className="amigo-admin-state" role="alert"><p>{toUiError(query.error).userMessage}</p><button type="button" onClick={() => void query.refetch()}>Tentar novamente</button></div>}
      {query.data?.data.length === 0 && <div className="amigo-admin-state"><h2>Nenhuma notificação encontrada</h2><p>Ajuste os filtros ou aguarde novas atualizações.</p></div>}
      {query.data && query.data.data.length > 0 && <NotificationList notifications={query.data.data} onOpen={(item) => void open(item)} onMarkRead={(id) => mark.mutate(id, { onError: () => setFeedback('Não foi possível marcar a notificação como lida.') })} markingId={mark.isPending ? mark.variables : undefined} />}
      {pagination && <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={(next) => update({ page: next })} />}
    </section>
  </main>
}
