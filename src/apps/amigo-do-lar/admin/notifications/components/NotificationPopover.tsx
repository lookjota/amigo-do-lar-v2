import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toUiError } from '../../../api/errors'
import { useMarkAllNotificationsAsRead, useMarkNotificationAsRead, useNotifications } from '../api/notification-hooks'
import type { Notification } from '../types/contracts'
import { getNotificationTarget } from '../utils/notification-navigation'
import { NotificationList } from './NotificationList'

export function NotificationPopover({ count, onClose }: { count: number; onClose: () => void }) {
  const navigate = useNavigate(); const panel = useRef<HTMLDivElement>(null)
  const query = useNotifications({ page: 1, limit: 5, sortOrder: 'desc' })
  const mark = useMarkNotificationAsRead(); const markAll = useMarkAllNotificationsAsRead()
  useEffect(() => { panel.current?.focus(); const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }; document.addEventListener('keydown', escape); return () => document.removeEventListener('keydown', escape) }, [onClose])
  async function open(item: Notification) { if (!item.readAt && !mark.isPending) { try { await mark.mutateAsync(item.id) } catch { /* Navigation remains available if marking fails. */ } } onClose(); navigate(getNotificationTarget(item)) }
  return <div id="notification-popover" className="amigo-notification-popover" role="dialog" aria-modal="false" aria-labelledby="notification-popover-title" tabIndex={-1} ref={panel}>
    <header><h2 id="notification-popover-title">Notificações</h2>{count > 0 && <button type="button" disabled={markAll.isPending} onClick={() => markAll.mutate()}>{markAll.isPending ? 'Marcando…' : 'Marcar todas como lidas'}</button>}</header>
    {query.isPending && <p role="status">Carregando notificações…</p>}
    {query.isError && <div role="alert"><p>{toUiError(query.error).userMessage}</p><button type="button" onClick={() => void query.refetch()}>Tentar novamente</button></div>}
    {mark.isError && <p role="alert">Não foi possível marcar a notificação como lida.</p>}
    {markAll.isError && <p role="alert">Não foi possível marcar todas como lidas.</p>}
    {query.data?.data.length === 0 && <p>Nenhuma notificação encontrada.</p>}
    {query.data && query.data.data.length > 0 && <NotificationList notifications={query.data.data} onOpen={(item) => void open(item)} onMarkRead={(id) => mark.mutate(id)} markingId={mark.isPending ? mark.variables : undefined} />}
    <Link className="amigo-notification-see-all" to="/admin/notificacoes" onClick={onClose}>Ver todas</Link>
  </div>
}

