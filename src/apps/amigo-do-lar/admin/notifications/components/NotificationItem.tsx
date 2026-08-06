import { ExternalLink } from 'lucide-react'
import type { Notification } from '../types/contracts'
import { notificationResourceLabels, notificationTypeLabels } from '../utils/notification-labels'
import { getNotificationMetadataDetails } from '../utils/notification-metadata'

interface Props { notification: Notification; onOpen: (notification: Notification) => void; onMarkRead: (id: string) => void; marking?: boolean }
export function NotificationItem({ notification, onOpen, onMarkRead, marking }: Props) {
  const unread = notification.readAt === null
  const details = getNotificationMetadataDetails(notification.metadata)
  return <li className="amigo-notification-item" data-unread={unread || undefined}>
    <div className="amigo-notification-heading"><span className="amigo-notification-dot" aria-hidden="true" /><strong>{notification.title}</strong><span className="amigo-notification-state">{unread ? 'Não lida' : 'Lida'}</span></div>
    <p>{notification.message}</p>
    {details.map((detail) => <small key={detail}>{detail}</small>)}
    <div className="amigo-notification-meta"><span>{notificationTypeLabels[notification.type]}</span><span>{notificationResourceLabels[notification.resourceType]}</span>{notification.actor && <span>{notification.actor.name} · {notification.actor.role === 'ADMIN' ? 'Administrador' : 'Operador'}</span>}<time dateTime={notification.createdAt}>{new Date(notification.createdAt).toLocaleString('pt-BR')}</time></div>
    <div className="amigo-notification-actions"><button type="button" onClick={() => onOpen(notification)}><ExternalLink size={16} aria-hidden="true" /> Abrir</button>{unread && <button type="button" disabled={marking} onClick={() => onMarkRead(notification.id)}>{marking ? 'Marcando…' : 'Marcar como lida'}</button>}</div>
  </li>
}

