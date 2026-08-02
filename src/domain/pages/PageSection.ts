export const pageSectionTypes = [
  'navigation',
  'hero',
  'researchAreas',
  'projects',
  'documents',
  'vision',
  'cta',
  'footer',
  'trust-features',
  'services-grid',
  'service-details',
  'process-steps',
  'areas-grid',
  'local-area-introduction',
  'benefits',
  'about',
  'faq',
  'contact',
  'quote-request',
  'call-to-action',
  'related-links',
  'legal-content',
  'not-found',
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

export interface ContentLink extends Link {
  description?: string
}

export interface FeatureItem {
  title: string
  description: string
}

export interface TrustFeaturesPayload {
  eyebrow: string
  title: string
  items: FeatureItem[]
}

export interface ServicesGridPayload {
  eyebrow: string
  title: string
  description?: string
  items: ContentLink[]
}

export interface ServiceDetailsPayload {
  eyebrow: string
  title: string
  introduction?: string
  groups: {
    title: string
    items: string[]
  }[]
  notice?: string
}

export interface ProcessStepsPayload {
  eyebrow: string
  title: string
  items: FeatureItem[]
}

export interface AreasGridPayload {
  eyebrow: string
  title: string
  description?: string
  items: ContentLink[]
}

export interface LocalAreaIntroductionPayload {
  eyebrow: string
  title: string
  paragraphs: string[]
}

export interface BenefitsPayload {
  eyebrow: string
  title: string
  items: FeatureItem[]
}

export interface AboutPayload {
  eyebrow: string
  title: string
  paragraphs: string[]
}

export interface FaqItem {
  question: string
  answer: string
}

export interface FaqPayload {
  eyebrow: string
  title: string
  items: FaqItem[]
}

export interface ContactPayload {
  eyebrow: string
  title: string
  description: string
  action: Link
}

export interface QuoteRequestPayload {
  eyebrow: string
  title: string
  description: string
}

export interface CallToActionPayload {
  eyebrow: string
  title: string
  description: string
  primaryAction: Link
  secondaryAction?: Link
}

export interface RelatedLinksPayload {
  eyebrow: string
  title: string
  items: ContentLink[]
}

export interface LegalContentPayload {
  eyebrow: string
  title: string
  updatedAt: string
  sections: {
    title: string
    paragraphs: string[]
  }[]
}

export interface NotFoundPayload {
  code: string
  title: string
  description: string
  action: Link
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
  'trust-features': TrustFeaturesPayload
  'services-grid': ServicesGridPayload
  'service-details': ServiceDetailsPayload
  'process-steps': ProcessStepsPayload
  'areas-grid': AreasGridPayload
  'local-area-introduction': LocalAreaIntroductionPayload
  benefits: BenefitsPayload
  about: AboutPayload
  faq: FaqPayload
  contact: ContactPayload
  'quote-request': QuoteRequestPayload
  'call-to-action': CallToActionPayload
  'related-links': RelatedLinksPayload
  'legal-content': LegalContentPayload
  'not-found': NotFoundPayload
}

export type PageSection = {
  [Type in PageSectionType]: {
    id: string
    type: Type
    data: PageSectionPayloadMap[Type]
  }
}[PageSectionType]
