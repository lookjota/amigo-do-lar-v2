import { MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

interface AreaCardProps {
  title: string
  description?: string
  href: string
}

export function AreaCard({ title, description, href }: AreaCardProps) {
  return (
    <article className="amigo-card amigo-area-card">
      <MapPin size={20} aria-hidden="true" />
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      <Link to={href}>Ver atendimento em {title}</Link>
    </article>
  )
}
