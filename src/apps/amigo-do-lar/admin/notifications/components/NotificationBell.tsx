import { Bell } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useUnreadNotificationCount } from '../api/notification-hooks'
import { NotificationPopover } from './NotificationPopover'

export function NotificationBell() {
  const location = useLocation()
  return <NotificationBellContent key={`${location.pathname}${location.search}`} />
}

function NotificationBellContent() {
  const [open, setOpen] = useState(false); const root = useRef<HTMLDivElement>(null)
  const query = useUnreadNotificationCount(); const count = query.data?.count ?? 0
  const close = useCallback(() => setOpen(false), [])
  useEffect(() => { if (!open) return; const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) close() }; document.addEventListener('pointerdown', outside); return () => document.removeEventListener('pointerdown', outside) }, [close, open])
  const label = count > 0 ? `${count} ${count === 1 ? 'notificação não lida' : 'notificações não lidas'}` : 'Notificações'
  return <div className="amigo-notification-bell" ref={root}><button type="button" aria-label={label} aria-expanded={open} aria-controls="notification-popover" onClick={() => setOpen((value) => !value)}><Bell aria-hidden="true" />{count > 0 && <span className="amigo-notification-count" aria-live="polite">{count > 99 ? '99+' : count}</span>}</button>{open && <NotificationPopover count={count} onClose={close} />}</div>
}
