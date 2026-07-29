import type { PageRepository } from '../../../engine/PageRepository'
import type { Page } from '../../../domain/pages/Page'
import { architecturePage } from '../content/architecturePage'
import { homePage } from '../content/homePage'

const pages = [homePage, architecturePage]

export class InstitutoLogosPageRepository implements PageRepository {
  getBySlug(slug: string): Page | undefined {
    return pages.find((page) => page.slug === slug)
  }

  getHome(): Page {
    return homePage
  }
}
