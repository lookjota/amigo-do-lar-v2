export const pageSectionTypes = [
  'navigation',
  'hero',
  'researchAreas',
  'projects',
  'documents',
  'vision',
  'cta',
  'footer',
] as const

export type PageSectionType = (typeof pageSectionTypes)[number]

export interface Link {
  label: string
  href: string
  external?: boolean
}

export interface NavigationPayload {
  brand: string
  links: Link[]
  additionalLink: Link
}

export interface HeroPayload {
  eyebrow: string
  title: string
  description: string
  motto: string
  actions: Link[]
}

export interface ResearchArea {
  name: string
  description: string
}

export interface ResearchAreasPayload {
  title: string
  items: ResearchArea[]
}

export interface Project {
  name: string
  status: 'Experimental' | 'Research' | 'Planned'
  description: string
}

export interface ProjectsPayload {
  title: string
  items: Project[]
}

export interface DocumentItem {
  title: string
  code: string
  version: string
}

export interface DocumentsPayload {
  title: string
  items: DocumentItem[]
}

export interface VisionPayload {
  title: string
  text: string
  principles: string[]
}

export interface CtaPayload {
  title: string
  description: string
  action: Link
}

export interface FooterPayload {
  brand: string
  motto: string
  text: string
}

export interface PageSectionPayloadMap {
  navigation: NavigationPayload
  hero: HeroPayload
  researchAreas: ResearchAreasPayload
  projects: ProjectsPayload
  documents: DocumentsPayload
  vision: VisionPayload
  cta: CtaPayload
  footer: FooterPayload
}

export type PageSection = {
  [Type in PageSectionType]: {
    id: string
    type: Type
    data: PageSectionPayloadMap[Type]
  }
}[PageSectionType]
