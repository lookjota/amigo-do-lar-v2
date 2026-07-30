import type { PageRepository } from '../../../engine/PageRepository'
import type { Page } from '../../../engine/page'
import { homePage } from '../content/pageFactory'
import { publicRoutes } from '../config/publicRoutes'

export class AmigoDoLarPageRepository implements PageRepository {
  getBySlug(slug: string): Page | undefined {
    return publicRoutes.find((route) => route.pageSlug === slug)?.page
  }

  getHome(): Page {
    return homePage
  }
}
