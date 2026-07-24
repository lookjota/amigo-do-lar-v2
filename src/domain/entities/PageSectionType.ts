/**
 * Todos os tipos
 * de blocos existentes.
 */
/**
 * Todos os tipos de seções disponíveis.
 *
 * "as const" torna os valores imutáveis
 * e preserva seus tipos literais.
 */
export const PageSectionType = {
  HERO: "hero",
  BENEFITS: "benefits",
  FAQ: "faq",
  CTA: "cta",
} as const;

export type PageSectionType =
  typeof PageSectionType[keyof typeof PageSectionType];