import type { PageSectionRegistry } from '../../../engine/PageSectionRegistry'
import {
  CtaSection,
  DocumentsSection,
  FooterSection,
  HeroSection,
  NavigationSection,
  ProjectsSection,
  ResearchAreasSection,
  VisionSection,
} from '../components/sections'

export const pageSectionRegistry: PageSectionRegistry = {
  navigation: NavigationSection,
  hero: HeroSection,
  researchAreas: ResearchAreasSection,
  projects: ProjectsSection,
  documents: DocumentsSection,
  vision: VisionSection,
  cta: CtaSection,
  footer: FooterSection,
}
