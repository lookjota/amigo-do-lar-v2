import { Link } from 'react-router-dom'
import type { TimelineEvent as TimelineEventContract } from '../types/contracts'
import { timelineTypeLabels } from '../utils/timeline-labels'
import { timelineMetadataDescription, timelineRelatedLink } from '../utils/timeline-metadata'

const dateTime = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' })
const roleLabels = { ADMIN: 'Administrador', OPERATOR: 'Operador' } as const

export function TimelineEvent({ event }: { event: TimelineEventContract }) {
  const metadata = timelineMetadataDescription(event)
  const link = timelineRelatedLink(event)
  const label = timelineTypeLabels[event.type]
  return <li className="amigo-timeline-event" aria-label={`${label}, ${dateTime.format(new Date(event.createdAt))}`}>
    <span className="amigo-timeline-marker" aria-hidden="true">●</span>
    <article>
      <header><strong>{label}</strong><time dateTime={event.createdAt}>{dateTime.format(new Date(event.createdAt))}</time></header>
      {event.title !== label && <p className="amigo-timeline-title">{event.title}</p>}
      {event.description && <p>{event.description}</p>}
      {metadata && <p className="amigo-timeline-metadata">{metadata}</p>}
      {!event.metadataValid && <p className="amigo-timeline-metadata-unavailable">Detalhes adicionais indisponíveis.</p>}
      <footer>{event.actor ? <span>Por {event.actor.name} · {roleLabels[event.actor.role]}</span> : <span>Autor não identificado</span>}{link && <Link to={link.to}>{link.label}</Link>}</footer>
    </article>
  </li>
}
