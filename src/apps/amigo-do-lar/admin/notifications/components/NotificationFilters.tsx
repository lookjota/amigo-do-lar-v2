import type { NotificationFilters as Filters, NotificationResourceType, NotificationType } from '../types/contracts'
import { notificationResourceTypes, notificationTypes } from '../types/contracts'
import { notificationResourceLabels, notificationTypeLabels } from '../utils/notification-labels'

export function NotificationFilters({ filters, onChange }: { filters: Filters; onChange: (updates: Partial<Filters>) => void }) {
  return <div className="amigo-notification-filters">
    <label>Leitura<select value={filters.unreadOnly ? 'unread' : 'all'} onChange={(event) => onChange({ unreadOnly: event.target.value === 'unread', page: 1 })}><option value="all">Todas</option><option value="unread">Somente não lidas</option></select></label>
    <label>Tipo<select value={filters.type ?? ''} onChange={(event) => onChange({ type: (event.target.value || undefined) as NotificationType | undefined, page: 1 })}><option value="">Todos os tipos</option>{notificationTypes.map((type) => <option key={type} value={type}>{notificationTypeLabels[type]}</option>)}</select></label>
    <label>Recurso<select value={filters.resourceType ?? ''} onChange={(event) => onChange({ resourceType: (event.target.value || undefined) as NotificationResourceType | undefined, page: 1 })}><option value="">Todos os recursos</option>{notificationResourceTypes.map((type) => <option key={type} value={type}>{notificationResourceLabels[type]}</option>)}</select></label>
    <label>Ordenação<select value={filters.sortOrder} onChange={(event) => onChange({ sortOrder: event.target.value === 'asc' ? 'asc' : 'desc', page: 1 })}><option value="desc">Mais recentes</option><option value="asc">Mais antigas</option></select></label>
  </div>
}

