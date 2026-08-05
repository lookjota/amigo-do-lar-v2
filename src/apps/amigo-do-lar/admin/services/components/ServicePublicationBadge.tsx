import { getPublishedServicePath } from '../publication'
export function ServicePublicationBadge({ slug }: { slug: string }) { const published = Boolean(getPublishedServicePath(slug)); return <span className={`amigo-admin-status amigo-admin-status-${published ? 'completed' : 'cancelled'}`}>{published ? 'Página publicada' : 'Sem página pública'}</span> }
