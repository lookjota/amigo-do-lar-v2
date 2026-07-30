import { Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'

interface ServiceCardProps {
  title: string
  description?: string
  href: string
}

export function ServiceCard({
  title,
  description,
  href,
}: ServiceCardProps) {
  return (
    <article className="amigo-card amigo-service-card">
      <Wrench size={22} aria-hidden="true" />
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      <Link to={href}>Conhecer o serviço de {title.toLowerCase()}</Link>
    </article>
  )
}
