import type { Page } from '../../../domain/pages/Page'
import { pages } from '../content/pageFactory'
import { serviceRequestPage, serviceRequestSuccessPage } from '../content/serviceRequestPages'

export interface PublicPageRoute {
  pathname: string
  pageSlug: string
  page: Page
  includeInSitemap: boolean
  prerender: boolean
}

export const publicRoutes: PublicPageRoute[] = [...pages, serviceRequestPage, serviceRequestSuccessPage].map((page) => ({
  pathname: page.slug,
  pageSlug: page.slug,
  page,
  includeInSitemap: page.slug !== '/solicitacao-enviada',
  prerender: true,
}))
