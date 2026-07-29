import { Code2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { NavigationItem } from '../../../domain/navigation/NavigationItem'
import {
  getChildNavigationItems,
  getRootNavigationItems,
} from '../../../domain/navigation/navigationResolver'

interface AppNavigationProps {
  items: NavigationItem[]
}

export function AppNavigation({ items }: AppNavigationProps) {
  const rootItems = getRootNavigationItems(items)

  return (
    <header className="site-header">
      <div className="shell navigation">
        <Link className="brand" to="/" aria-label="Instituto Logos, início">
          <span className="brand-mark" aria-hidden="true">
            L
          </span>
          <span>Instituto Logos</span>
        </Link>

        <nav className="navigation-links" aria-label="Navegação principal">
          {rootItems.flatMap((rootItem) => [
            rootItem,
            ...getChildNavigationItems(items, rootItem.id),
          ]).map((item) => (
            <Link key={item.id} to={item.path}>
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          className="github-link"
          href="https://github.com/lookjota"
          target="_blank"
          rel="noreferrer"
        >
          <Code2 size={16} aria-hidden="true" />
          GitHub
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      </div>
    </header>
  )
}
