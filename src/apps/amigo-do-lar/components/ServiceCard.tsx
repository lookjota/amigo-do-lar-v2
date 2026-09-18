import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { MediaAsset } from '../../../domain/pages/PageSection'

interface ServiceCardProps {
  title: string
  description?: string
  href: string
  media?: MediaAsset
}

export function ServiceCard({
  title,
  description,
  href,
  media,
}: ServiceCardProps) {
  return (
    <article className="amigo-card amigo-service-card">
      {media && (
        <div className="amigo-service-card-media">
          {media.kind === 'image' ? (
            <img src={media.src} alt={media.alt} width={media.width} height={media.height} loading="lazy" />
          ) : (
            <div role="img" aria-label={media.label}>{media.label}</div>
          )}
        </div>
      )}
      <div className="amigo-service-card-content">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
        <Link to={href} aria-label={`Conhecer o serviço de ${title.toLowerCase()}`}>
          <span>Conhecer serviço</span>
          <ArrowRight size={20} aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
