import { Menu, MessageCircle } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { createWhatsAppUrl } from '../config/site'
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
  const whatsappUrl = createWhatsAppUrl(
    'Olá! Gostaria de solicitar atendimento residencial.',
  )

  return (
    <header className="amigo-header">
      <div className="amigo-container amigo-header-layout">
        <Link className="amigo-brand" to="/" aria-label="Amigo do Lar, início">
          <span aria-hidden="true">A</span>
          Amigo do Lar
        </Link>
        <nav className="amigo-desktop-nav" aria-label="Navegação principal">
          <NavigationLinks />
        </nav>
        <a
          className="amigo-button amigo-button-primary amigo-header-cta"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('request_service_click')}
        >
          <MessageCircle size={17} aria-hidden="true" />
          Solicitar atendimento
        </a>
        <details className="amigo-mobile-menu">
          <summary aria-label="Abrir menu de navegação">
            <Menu aria-hidden="true" />
          </summary>
          <nav aria-label="Navegação móvel">
            <NavigationLinks />
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('request_service_click')}
            >
              Solicitar atendimento
            </a>
          </nav>
        </details>
      </div>
    </header>
  )
}
