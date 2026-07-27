import type { PageMetadata } from '../metadata/PageMetadata'
import type { PageSection } from './PageSection'

export interface Page {
  id: string
  slug: string
  metadata: PageMetadata
  sections: PageSection[]
}
