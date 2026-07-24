import { PageRenderer } from '../../../engine/PageRenderer'
import { PageSectionRegistryProvider } from '../../../engine/PageSectionRegistry'
import { pageSectionRegistry } from '../registry/pageSectionRegistry'
import { InstitutoLogosPageRepository } from '../repositories/InstitutoLogosPageRepository'

const pageRepository = new InstitutoLogosPageRepository()

export function HomePage() {
  const page = pageRepository.getHome()

  return (
    <PageSectionRegistryProvider value={pageSectionRegistry}>
      <PageRenderer page={page} />
    </PageSectionRegistryProvider>
  )
}
