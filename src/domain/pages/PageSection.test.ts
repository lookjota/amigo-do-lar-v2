import { describe, expect, expectTypeOf, it } from 'vitest'
import type {
  HeroPayload,
  PageSection,
  PageSectionPayloadMap,
} from './PageSection'

describe('contratos aditivos de PageSection', () => {
  it('mantém payloads legados de Hero compatíveis', () => {
    const legacyHero = {
      eyebrow: 'Pesquisa',
      title: 'Título legado',
      description: 'Descrição',
      motto: 'Mote',
      actions: [],
    } satisfies HeroPayload

    expect(legacyHero.title).toBe('Título legado')
  })

  it('tipa variantes, mídia e os novos módulos na união compartilhada', () => {
    const section = {
      id: 'hero-servico',
      type: 'hero',
      data: {
        eyebrow: 'Serviço',
        title: 'Elétrica',
        description: 'Descrição',
        motto: 'Avaliação necessária',
        actions: [],
        variant: 'service',
        media: {
          kind: 'placeholder',
          label: '[ASSET REAL — ELÉTRICA]',
          aspectRatio: '8:7',
        },
      },
    } satisfies PageSection

    expect(section.data.media.label).toBe('[ASSET REAL — ELÉTRICA]')
    expectTypeOf<PageSectionPayloadMap['reviews']>().toHaveProperty('items')
    expectTypeOf<PageSectionPayloadMap['proof-gallery']>().toHaveProperty('items')
  })
})
