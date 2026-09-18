import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { getAnalyticsContext, trackEvent } from '../analytics/analytics'
import { getContextualWhatsAppUrl } from '../config/whatsapp'

export function WhatsAppButton({ menuOpen }: { menuOpen: boolean }) {
  const [visible, setVisible] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('.amigo-hero')
    if (!hero) return

    const updateVisibility = () => {
      const threshold = hero.offsetTop + hero.offsetHeight * 0.8
      setVisible(window.scrollY >= threshold)
    }
    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    window.addEventListener('resize', updateVisibility)
    return () => {
      window.removeEventListener('scroll', updateVisibility)
      window.removeEventListener('resize', updateVisibility)
    }
  }, [location.pathname])

  if (!visible || menuOpen) return null

  return (
    <aside className="amigo-mobile-sticky-cta" aria-label="Orçamento pelo WhatsApp">
      <a
        href={getContextualWhatsAppUrl(location.pathname)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('whatsapp_click', getAnalyticsContext(location.pathname, 'sticky_mobile'))}
      >
        <MessageCircle size={20} aria-hidden="true" />
        Pedir orçamento no WhatsApp
      </a>
    </aside>
  )
}
