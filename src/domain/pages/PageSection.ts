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
  'problem',
  'solution',
  'house-list',
  'service-standard',
  'founders',
  'proof-gallery',
  'reviews',
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
  variant?: HeroVariant
  media?: MediaAsset
}

export type HeroVariant = 'home' | 'internal' | 'service' | 'location'

export interface ImageMediaAsset {
  kind: 'image'
  src: string
  alt: string
  width: number
  height: number
  aspectRatio?: '8:7' | '4:5' | '4:3' | '16:10' | '5:4' | '1:1'
  productionStatus?: 'approved' | 'temporary-fallback'
}

export interface PlaceholderMediaAsset {
  kind: 'placeholder'
  label: `[ASSET ${string}]`
  aspectRatio?: '8:7' | '4:5' | '4:3' | '16:10' | '5:4' | '1:1'
}

export type MediaAsset = ImageMediaAsset | PlaceholderMediaAsset

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
  media?: MediaAsset
}

export interface FeatureItem {
  title: string
  description: string
}

export interface TrustFeaturesPayload {
  eyebrow: string
  title: string
  items: FeatureItem[]
  variant?: 'cards' | 'strip'
}

export interface ServicesGridPayload {
  eyebrow: string
  title: string
  description?: string
  items: ContentLink[]
  action?: Link
  variant?: 'cards' | 'editorial'
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
  action?: Link
  variant?: 'cards' | 'editorial'
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
  variant?: 'default' | 'home'
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

export interface EditorialSectionPayload {
  eyebrow: string
  title: string
  paragraphs: string[]
  media?: MediaAsset
}

export type ProblemPayload = EditorialSectionPayload

export interface SolutionPayload extends EditorialSectionPayload {
  action?: Link
}

export interface HouseListPayload {
  eyebrow: string
  title: string
  description: string
  items: string[]
  exampleLabel: string
  action?: Link
}

export interface ServiceStandardStage {
  title: string
  steps: string[]
  description?: string
  media?: MediaAsset
}

export interface ServiceStandardPayload {
  eyebrow: string
  title: string
  description?: string
  stages: ServiceStandardStage[]
}

export type FoundersPayload = EditorialSectionPayload

export interface ProofGalleryItem {
  media: ImageMediaAsset
  service: string
  region?: string
  description?: string
}

export interface ProofGalleryPayload {
  eyebrow: string
  title: string
  items?: ProofGalleryItem[]
}

export interface ReviewItem {
  quote: string
  attribution: string
  service?: string
  region?: string
  rating?: number
}

export interface ReviewsPayload {
  eyebrow: string
  title: string
  items?: ReviewItem[]
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
  problem: ProblemPayload
  solution: SolutionPayload
  'house-list': HouseListPayload
  'service-standard': ServiceStandardPayload
  founders: FoundersPayload
  'proof-gallery': ProofGalleryPayload
  reviews: ReviewsPayload
}

export type PageSection = {
  [Type in PageSectionType]: {
    id: string
    type: Type
    data: PageSectionPayloadMap[Type]
  }
}[PageSectionType]
