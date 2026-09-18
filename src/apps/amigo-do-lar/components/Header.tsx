import { useEffect, useRef, useState } from 'react'
import { Menu, MessageCircle, X } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { getAnalyticsContext, trackEvent } from '../analytics/analytics'
import { getContextualWhatsAppUrl } from '../config/whatsapp'

const links = [
  { label: 'Serviços', href: '/servicos' },
  { label: 'Como funciona', href: '/#como-funciona' },
  { label: 'Áreas atendidas', href: '/areas-atendidas' },
  { label: 'Sobre', href: '/sobre' },
]

interface HeaderProps {
  menuOpen: boolean
  onMenuOpenChange: (open: boolean) => void
}

function NavigationLinks({ onNavigate }: { onNavigate?: () => void }) {
  return links.map((link) => (
    <NavLink key={link.href} to={link.href} onClick={onNavigate}>
      {link.label}
    </NavLink>
  ))
}

export function Header({ menuOpen, onMenuOpenChange }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const firstMenuLink = useRef<HTMLAnchorElement>(null)
  const whatsappUrl = getContextualWhatsAppUrl(location.pathname)

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 24)
    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })
    return () => window.removeEventListener('scroll', updateHeader)
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    firstMenuLink.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onMenuOpenChange(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen, onMenuOpenChange])

  const trackWhatsApp = () => trackEvent('whatsapp_click', getAnalyticsContext(location.pathname, 'header'))

  return (
    <header className={`amigo-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="amigo-container amigo-header-layout">
        <Link className="amigo-brand" to="/" aria-label="Amigo do Lar, início">
          <span aria-hidden="true">A</span>
          <span>Amigo do Lar</span>
        </Link>
        <nav className="amigo-desktop-nav" aria-label="Navegação principal">
          <NavigationLinks />
        </nav>
        <a className="amigo-button amigo-button-primary amigo-header-cta" href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={trackWhatsApp}>
          Pedir orçamento
        </a>
        <a className="amigo-mobile-budget" href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={trackWhatsApp}>
          <MessageCircle size={18} aria-hidden="true" />
          Orçamento
        </a>
        <button
          className="amigo-mobile-menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
          aria-expanded={menuOpen}
          aria-controls="amigo-mobile-navigation"
          onClick={() => onMenuOpenChange(!menuOpen)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {menuOpen && (
        <>
          <button className="amigo-mobile-menu-backdrop" type="button" aria-label="Fechar menu de navegação" onClick={() => onMenuOpenChange(false)} />
          <div id="amigo-mobile-navigation" className="amigo-mobile-menu" role="dialog" aria-modal="true" aria-label="Menu de navegação">
            <nav aria-label="Navegação móvel">
              <NavLink ref={firstMenuLink} to="/" onClick={() => onMenuOpenChange(false)}>Início</NavLink>
              <NavigationLinks onNavigate={() => onMenuOpenChange(false)} />
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={trackWhatsApp}>
                Pedir orçamento pelo WhatsApp
              </a>
            </nav>
          </div>
        </>
      )}
    </header>
  )
}
