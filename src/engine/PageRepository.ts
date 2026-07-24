import type { Page } from './page'

export interface PageRepository {
  getBySlug(slug: string): Page | undefined
  getHome(): Page
}
