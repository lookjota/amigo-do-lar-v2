import { describe, expect, it } from 'vitest'
import type { ContentLink } from '../../../domain/pages/PageSection'
import type { PublicService } from '../api/services-api'
import { mergeServicesCatalog } from './servicesCatalog'

const staticItems: ContentLink[] = [
  {
    label: 'Elétrica editorial',
    href: '/servicos/eletrica',
    description: 'Descrição editorial',
  },
  {
    label: 'Hidráulica editorial',
    href: '/servicos/hidraulica',
    description: 'Descrição hidráulica editorial',
  },
]

function apiService(
  slug: string,
  name = slug,
  description = `Descrição ${slug}`,
): PublicService {
  return {
    id: slug,
    name,
    slug,
    description,
    category: 'GENERAL',
    isActive: true,
    createdAt: '2026-07-30T12:00:00.000Z',
    updatedAt: '2026-07-30T12:00:00.000Z',
  }
}

describe('mergeServicesCatalog', () => {
  it('ignora slugs sem página local e preserva o fallback estático', () => {
    expect(mergeServicesCatalog(staticItems, [apiService('desconhecido')]))
      .toEqual(staticItems)
    expect(mergeServicesCatalog(staticItems, [])).toEqual(staticItems)
  })

  it('enriquece somente serviços publicados mantendo a ordem editorial', () => {
    const result = mergeServicesCatalog(staticItems, [
      apiService('hidraulica', 'Hidráulica API'),
      apiService('eletrica', 'Elétrica API'),
    ])

    expect(result.map((item) => item.href)).toEqual([
      '/servicos/eletrica',
      '/servicos/hidraulica',
    ])
    expect(result.map((item) => item.label)).toEqual([
      'Elétrica API',
      'Hidráulica API',
    ])
  })

  it('não duplica cards mesmo se o conteúdo estático vier duplicado', () => {
    expect(mergeServicesCatalog([...staticItems, staticItems[0]], []))
      .toHaveLength(2)
  })
})
