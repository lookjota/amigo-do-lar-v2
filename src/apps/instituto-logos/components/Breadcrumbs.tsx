import { Link } from 'react-router-dom'
import type { NavigationItem } from '../../../domain/navigation/NavigationItem'

interface BreadcrumbsProps {
  items: NavigationItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length < 2) {
    return null
  }

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="shell">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1

          return (
            <li key={item.id}>
              {isCurrent ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link to={item.path}>{item.label}</Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
