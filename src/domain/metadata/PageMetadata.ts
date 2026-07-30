import type { RobotsMetadata } from './RobotsMetadata'

export type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdObject
  | JsonLdValue[]

export interface JsonLdObject {
  [property: string]: JsonLdValue
}

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
  siteName?: string
  structuredData?: JsonLdObject[]
}
