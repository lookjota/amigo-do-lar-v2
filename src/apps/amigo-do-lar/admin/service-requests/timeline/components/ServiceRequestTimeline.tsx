import { useState } from 'react'
import { toUiError } from '../../../../api/errors'
import { useServiceRequestTimeline } from '../api/useServiceRequestTimeline'
import type { TimelineEventType, TimelineSortOrder } from '../types/contracts'
import { TimelineCommentForm } from './TimelineCommentForm'
import { TimelineEmptyState } from './TimelineEmptyState'
import { TimelineEvent } from './TimelineEvent'
import { TimelineFilters } from './TimelineFilters'
import { TimelineSkeleton } from './TimelineSkeleton'

export function ServiceRequestTimeline({ serviceRequestId }: { serviceRequestId: string }) {
  const [type, setType] = useState<TimelineEventType>()
  const [sortOrder, setSortOrder] = useState<TimelineSortOrder>('desc')
  const query = useServiceRequestTimeline(serviceRequestId, type, sortOrder)
  const events = query.data?.pages.flatMap((page) => page.data) ?? []
  const total = query.data?.pages[0]?.pagination.total ?? 0
  return <section className="amigo-timeline" aria-labelledby="service-request-timeline-title">
    <h3 id="service-request-timeline-title">Histórico da solicitação</h3>
    <TimelineCommentForm serviceRequestId={serviceRequestId} />
    <TimelineFilters type={type} sortOrder={sortOrder} disabled={query.isFetching} onType={setType} onSortOrder={setSortOrder} />
    {query.isPending && <TimelineSkeleton />}
    {query.isError && <div className="amigo-admin-state" role="alert"><p>{toUiError(query.error).userMessage}</p><button type="button" onClick={() => void query.refetch()}>Tentar novamente</button></div>}
    {query.isSuccess && events.length === 0 && <TimelineEmptyState />}
    {events.length > 0 && <><p className="amigo-timeline-count" role="status">{events.length} de {total} eventos carregados</p><ol className="amigo-timeline-list">{events.map((event) => <TimelineEvent key={event.id} event={event} />)}</ol></>}
    {query.hasNextPage ? <button className="amigo-timeline-load" type="button" disabled={query.isFetchingNextPage} onClick={() => void query.fetchNextPage()}>{query.isFetchingNextPage ? 'Carregando mais eventos…' : 'Carregar mais eventos'}</button> : query.isSuccess && events.length > 0 && <p className="amigo-timeline-end">Fim do histórico.</p>}
  </section>
}
