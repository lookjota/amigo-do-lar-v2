import { useContext } from 'react'
import type {
  PageSectionRegistry,
  SectionByType,
  SectionComponent,
} from './PageSectionRegistry'
import { PageSectionRegistryContext } from './PageSectionRegistry'
import type {
  PageSection,
  PageSectionType,
} from '../domain/pages/PageSection'

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

function renderSection<Type extends PageSectionType>(
  section: SectionByType<Type>,
  registry: PageSectionRegistry,
) {
  const Component: SectionComponent<Type> | undefined =
    registry[section.type]

  if (!Component) {
    throw new Error(
      `No renderer registered for section type "${section.type}"`,
    )
  }

  return <Component section={section} />
}

export function SectionRenderer({ section }: SectionRendererProps) {
  const registry = usePageSectionRegistry()

  return renderSection(section, registry)
}
