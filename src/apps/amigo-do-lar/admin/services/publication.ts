import { services } from '../../data/services'

const editorialSlugs = new Set(services.map((service) => service.slug))

export function getPublishedServicePath(slug: string) {
  return editorialSlugs.has(slug) ? `/servicos/${slug}` : undefined
}
