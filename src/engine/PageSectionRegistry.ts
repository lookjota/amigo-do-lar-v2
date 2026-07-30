import { createContext } from 'react'
import type { ComponentType } from 'react'
import type {
  PageSection,
  PageSectionType,
} from '../domain/pages/PageSection'

export type SectionByType<Type extends PageSectionType> = Extract<
  PageSection,
  { type: Type }
>

export type SectionComponent<Type extends PageSectionType> = ComponentType<{
  section: SectionByType<Type>
}>

export type PageSectionRegistry = {
  [Type in PageSectionType]?: SectionComponent<Type>
}

export const PageSectionRegistryContext =
  createContext<PageSectionRegistry | null>(null)

export const PageSectionRegistryProvider = PageSectionRegistryContext.Provider
