import { publicConfig } from './environment'

export const siteConfig = {
  siteName: 'Amigo do Lar',
  siteUrl: publicConfig.publicSiteUrl,
  defaultTitle: 'Amigo do Lar — Serviços residenciais em Brasília',
  defaultDescription:
    'Serviços residenciais confiáveis, organizados e executados com cuidado em Brasília e regiões próximas.',
  locale: 'pt-BR',
  contact: {
    whatsappNumber: publicConfig.whatsappNumber,
    isProvisional: false,
  },
  social: {},
  business: {
    name: 'Amigo do Lar',
    description:
      'Serviços residenciais confiáveis, organizados e executados com cuidado.',
  },
  analytics: {
    ga4Id: publicConfig.ga4Id,
    clarityId: publicConfig.clarityId,
  },
} as const

export function absoluteUrl(path: string): string {
  return new URL(path, `${siteConfig.siteUrl}/`).toString()
}

export function createWhatsAppUrl(message: string): string {
  return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(message)}`
}
