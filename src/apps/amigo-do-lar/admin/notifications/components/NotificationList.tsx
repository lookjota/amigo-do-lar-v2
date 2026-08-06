import type { Notification } from '../types/contracts'
import { NotificationItem } from './NotificationItem'

interface Props { notifications: Notification[]; onOpen: (item: Notification) => void; onMarkRead: (id: string) => void; markingId?: string }
export function NotificationList({ notifications, onOpen, onMarkRead, markingId }: Props) {
  return <ul className="amigo-notification-list" aria-label="Lista de notificações">{notifications.map((item) => <NotificationItem key={item.id} notification={item} onOpen={onOpen} onMarkRead={onMarkRead} marking={markingId === item.id} />)}</ul>
}

