import type { PageRepository } from '../../../engine/PageRepository'
import type { Page } from '../../../engine/page'
import { homePage } from '../content/homePage'

export class InstitutoLogosPageRepository implements PageRepository {
  getBySlug(slug: string): Page | undefined {
    return slug === homePage.slug ? homePage : undefined
  }

  getHome(): Page {
    return homePage
  }
}
