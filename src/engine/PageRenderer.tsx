import type { Page } from '../domain/pages/Page'
import { BrowserMetadataRenderer } from './BrowserMetadataRenderer'
import { SectionRenderer } from './SectionRenderer'

interface PageRendererProps {
  page: Page
}

export function PageRenderer({ page }: PageRendererProps) {
  return (
    <>
      <BrowserMetadataRenderer metadata={page.metadata} />
      {page.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </>
  )
}
