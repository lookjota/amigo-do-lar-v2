import type { RobotsMetadata } from './RobotsMetadata'

export interface PageMetadata {
  title: string
  description?: string
  keywords?: string[]
  author?: string
  locale?: string
  canonicalUrl?: string
  image?: string
  robots?: RobotsMetadata
  publishedAt?: string
  updatedAt?: string
}