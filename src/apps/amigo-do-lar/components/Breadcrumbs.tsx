import { Link } from 'react-router-dom'
import type { NavigationItem } from '../../../domain/navigation/NavigationItem'

export function Breadcrumbs({ items }: { items: NavigationItem[] }) {
  if (items.length < 2) return null

  return (
    <nav className="amigo-breadcrumbs" aria-label="Trilha de navegação">
      <ol className="amigo-container">
        {items.map((item, index) => (
          <li key={item.id}>
            {index === items.length - 1 ? (
              <span aria-current="page">{item.label}</span>
            ) : (
              <Link to={item.path}>{item.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
