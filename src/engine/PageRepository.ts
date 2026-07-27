import type { Page } from '../domain/pages/Page'

export interface PageRepository {
  getBySlug(slug: string): Page | undefined
  getHome(): Page
}
