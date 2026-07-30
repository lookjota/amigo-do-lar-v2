import type { Page } from '../../../domain/pages/Page'
import { pages } from '../content/pageFactory'

export interface PublicPageRoute {
  pathname: string
  pageSlug: string
  page: Page
  includeInSitemap: boolean
  prerender: boolean
}

export const publicRoutes: PublicPageRoute[] = pages.map((page) => ({
  pathname: page.slug,
  pageSlug: page.slug,
  page,
  includeInSitemap: true,
  prerender: true,
}))
