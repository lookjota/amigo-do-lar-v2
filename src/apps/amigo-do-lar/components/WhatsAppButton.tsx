import { MessageCircle } from 'lucide-react'
import { createWhatsAppUrl } from '../config/site'
import { trackEvent } from '../analytics/analytics'

export function WhatsAppButton() {
  return (
    <a
      className="amigo-whatsapp-float"
      href={createWhatsAppUrl(
        'Olá! Gostaria de conversar sobre um serviço residencial.',
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com o Amigo do Lar pelo WhatsApp"
      onClick={() => trackEvent('whatsapp_click')}
    >
      <MessageCircle aria-hidden="true" />
    </a>
  )
}
