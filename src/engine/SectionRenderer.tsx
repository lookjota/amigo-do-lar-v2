import { useContext } from 'react'
import type { PageSectionRegistry } from './PageSectionRegistry'
import { PageSectionRegistryContext } from './PageSectionRegistry'
import type { PageSection } from '../domain/pages/PageSection'

interface SectionRendererProps {
  section: PageSection
}

function usePageSectionRegistry(): PageSectionRegistry {
  const registry = useContext(PageSectionRegistryContext)

  if (!registry) {
    throw new Error('PageRenderer requires a PageSectionRegistryProvider')
  }

  return registry
}

export function SectionRenderer({ section }: SectionRendererProps) {
  const registry = usePageSectionRegistry()

  switch (section.type) {
    case 'navigation': {
      const Component = registry.navigation
      return <Component section={section} />
    }
    case 'hero': {
      const Component = registry.hero
      return <Component section={section} />
    }
    case 'researchAreas': {
      const Component = registry.researchAreas
      return <Component section={section} />
    }
    case 'projects': {
      const Component = registry.projects
      return <Component section={section} />
    }
    case 'documents': {
      const Component = registry.documents
      return <Component section={section} />
    }
    case 'vision': {
      const Component = registry.vision
      return <Component section={section} />
    }
    case 'cta': {
      const Component = registry.cta
      return <Component section={section} />
    }
    case 'footer': {
      const Component = registry.footer
      return <Component section={section} />
    }
  }
}
