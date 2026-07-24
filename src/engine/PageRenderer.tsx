import { useEffect } from 'react'
import type { Page } from './page'
import { SectionRenderer } from './SectionRenderer'

interface PageRendererProps {
  page: Page
}

export function PageRenderer({ page }: PageRendererProps) {
  useEffect(() => {
    document.title = page.seo.title

    let description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    )

    if (!description) {
      description = document.createElement('meta')
      description.name = 'description'
      document.head.append(description)
    }

    description.content = page.seo.description
  }, [page.seo.description, page.seo.title])

  return (
    <>
      {page.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </>
  )
}
