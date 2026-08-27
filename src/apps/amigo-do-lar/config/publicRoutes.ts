import type { Page } from '../../../domain/pages/Page'
import { pages } from '../content/pageFactory'
import { serviceRequestPage, serviceRequestSuccessPage } from '../content/serviceRequestPages'
import { absoluteUrl, siteConfig } from './site'

const contentIndexPage: Page = {
  id: 'amigo-do-lar-content-index',
  slug: '/conteudos',
  sections: [],
  metadata: { title: 'Conteúdos — Amigo do Lar', description: 'Guias, artigos, casos e dicas para cuidar da sua casa.', author: siteConfig.business.name, locale: siteConfig.locale, siteName: siteConfig.siteName, canonicalUrl: absoluteUrl('/conteudos'), robots: { index: true, follow: true } },
}

export interface PublicPageRoute {
  pathname: string
  pageSlug: string
  page: Page
  includeInSitemap: boolean
  prerender: boolean
}

export const publicRoutes: PublicPageRoute[] = [...pages, serviceRequestPage, serviceRequestSuccessPage, contentIndexPage].map((page) => ({
  pathname: page.slug,
  pageSlug: page.slug,
  page,
  includeInSitemap: page.slug !== '/solicitacao-enviada',
  prerender: true,
}))
