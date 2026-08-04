import type { Page } from '../../../domain/pages/Page'
import { absoluteUrl, siteConfig } from '../config/site'

export const serviceRequestPage: Page = {
  id: 'amigo-do-lar-service-request', slug: '/solicitar-atendimento', sections: [],
  metadata: { title: 'Solicitar atendimento — Amigo do Lar', description: 'Solicite atendimento residencial em Brasília informando o serviço, a região e os detalhes da necessidade.', author: siteConfig.business.name, locale: siteConfig.locale, siteName: siteConfig.siteName, canonicalUrl: absoluteUrl('/solicitar-atendimento'), robots: { index: true, follow: true } },
}

export const serviceRequestSuccessPage: Page = {
  id: 'amigo-do-lar-service-request-success', slug: '/solicitacao-enviada', sections: [],
  metadata: { title: 'Solicitação enviada — Amigo do Lar', description: 'Confirmação de recebimento de uma solicitação de atendimento pelo Amigo do Lar.', author: siteConfig.business.name, locale: siteConfig.locale, siteName: siteConfig.siteName, canonicalUrl: absoluteUrl('/solicitacao-enviada'), robots: { index: false, follow: true } },
}
