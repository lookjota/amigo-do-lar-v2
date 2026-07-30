import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Link as LinkData } from '../../../domain/pages/PageSection'
import { trackEvent } from '../analytics/analytics'

interface ContentLinkProps extends LinkData {
  className?: string
  event?: 'whatsapp_click' | 'request_service_click'
}

export function ContentLink({
  label,
  href,
  external,
  className,
  event,
}: ContentLinkProps) {
  const content = (
    <>
      {label}
      <ArrowUpRight size={17} aria-hidden="true" />
      {external && <span className="sr-only"> (abre em nova aba)</span>}
    </>
  )
  const onClick = event ? () => trackEvent(event) : undefined

  if (external) {
    return (
      <a
        className={className}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {content}
      </a>
    )
  }

  return (
    <Link className={className} to={href} onClick={onClick}>
      {content}
    </Link>
  )
}
