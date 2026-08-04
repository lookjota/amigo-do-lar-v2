import type { ContentLink } from '../../../domain/pages/PageSection'
import type { PublicService } from '../api/services-api'

function serviceSlug(href: string): string | undefined {
  const match = /^\/servicos\/([^/]+)$/.exec(href)
  return match?.[1]
}

export function mergeServicesCatalog(
  staticItems: ContentLink[],
  apiServices: PublicService[],
): ContentLink[] {
  const servicesBySlug = new Map(
    apiServices.map((service) => [service.slug, service]),
  )
  const seenHrefs = new Set<string>()

  return staticItems.flatMap((item) => {
    if (seenHrefs.has(item.href)) {
      return []
    }

    seenHrefs.add(item.href)
    const slug = serviceSlug(item.href)
    const service = slug ? servicesBySlug.get(slug) : undefined

    return [{
      ...item,
      label: service?.name ?? item.label,
      description: service?.description ?? item.description,
    }]
  })
}
