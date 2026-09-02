import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { trackEvent } from '../analytics/analytics'

const links = [
  { label: 'Início', href: '/' },
  { label: 'Serviços', href: '/servicos' },
  { label: 'Áreas atendidas', href: '/areas-atendidas' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Contato', href: '/contato' },
]

function NavigationLinks() {
  return (
    <>
      {links.map((link) => (
        <NavLink key={link.href} to={link.href}>
          {link.label}
        </NavLink>
      ))}
    </>
  )
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 12)
    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })
    return () => window.removeEventListener('scroll', updateHeader)
  }, [])

  return (
    <header className={`amigo-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="amigo-container amigo-header-layout">
        <Link className="amigo-brand" to="/" aria-label="Amigo do Lar, início">
          <span aria-hidden="true">A</span>
          Amigo do Lar
        </Link>
        <nav className="amigo-desktop-nav" aria-label="Navegação principal">
          <NavigationLinks />
        </nav>
        <Link
          className="amigo-button amigo-button-primary amigo-header-cta"
          to="/solicitar-atendimento"
          onClick={() => trackEvent('request_service_click')}
        >
          Solicitar atendimento
        </Link>
        <details className="amigo-mobile-menu">
          <summary aria-label="Abrir menu de navegação">
            <Menu aria-hidden="true" />
          </summary>
          <nav aria-label="Navegação móvel">
            <NavigationLinks />
            <Link
              to="/solicitar-atendimento"
              onClick={() => trackEvent('request_service_click')}
            >
              Solicitar atendimento
            </Link>
          </nav>
        </details>
      </div>
    </header>
  )
}
