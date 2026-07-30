const configuredSiteUrl = import.meta.env.VITE_PUBLIC_SITE_URL as
  | string
  | undefined

export const siteConfig = {
  siteName: 'Amigo do Lar',
  siteUrl: (configuredSiteUrl ?? 'https://amigodolar.example').replace(
    /\/$/,
    '',
  ),
  defaultTitle: 'Amigo do Lar — Serviços residenciais em Brasília',
  defaultDescription:
    'Serviços residenciais confiáveis, organizados e executados com cuidado em Brasília e regiões próximas.',
  locale: 'pt-BR',
  contact: {
    // Provisório: substituir por VITE_WHATSAPP_NUMBER antes da publicação.
    whatsappNumber:
      (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ??
      '5561995646646',
    isProvisional: !import.meta.env.VITE_WHATSAPP_NUMBER,
  },
  social: {},
  business: {
    name: 'Amigo do Lar',
    description:
      'Serviços residenciais confiáveis, organizados e executados com cuidado.',
  },
  analytics: {
    ga4Id: import.meta.env.VITE_GA4_ID as string | undefined,
    clarityId: import.meta.env.VITE_CLARITY_ID as string | undefined,
  },
} as const

export function absoluteUrl(path: string): string {
  return new URL(path, `${siteConfig.siteUrl}/`).toString()
}

export function createWhatsAppUrl(message: string): string {
  return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(message)}`
}
