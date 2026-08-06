import { timelineEventTypes, type TimelineEventType, type TimelineSortOrder } from '../types/contracts'
import { timelineTypeLabels } from '../utils/timeline-labels'

interface Props { type?: TimelineEventType; sortOrder: TimelineSortOrder; disabled?: boolean; onType: (value?: TimelineEventType) => void; onSortOrder: (value: TimelineSortOrder) => void }
export function TimelineFilters({ type, sortOrder, disabled, onType, onSortOrder }: Props) {
  return <div className="amigo-timeline-filters">
    <label>Tipo de evento<select value={type ?? ''} disabled={disabled} onChange={(event) => onType(timelineEventTypes.find((value) => value === event.target.value))}><option value="">Todos</option>{timelineEventTypes.map((value) => <option key={value} value={value}>{timelineTypeLabels[value]}</option>)}</select></label>
    <label>Ordem<select value={sortOrder} disabled={disabled} onChange={(event) => onSortOrder(event.target.value === 'asc' ? 'asc' : 'desc')}><option value="desc">Mais recentes</option><option value="asc">Mais antigos</option></select></label>
  </div>
}
