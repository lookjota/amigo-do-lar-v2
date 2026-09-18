import { render, screen, within } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { homePage } from '../content/homePage'
import { TrustFeaturesSection } from './sections'

const section = homePage.sections.find((item) => item.type === 'trust-features')!
const labels = [
  'Orçamento claro',
  'Pix, dinheiro ou cartão',
  'Mesmo dia conforme disponibilidade',
  'Garantia conforme o serviço',
]

describe('Trust Strip da Home', () => {
  it('fica imediatamente após o Hero e apresenta somente as quatro condições aprovadas', () => {
    expect(homePage.sections[0].type).toBe('hero')
    expect(homePage.sections[1]).toBe(section)
    render(<TrustFeaturesSection section={section} />)
    const strip = screen.getByRole('region', { name: 'Condições do atendimento' })
    expect(within(strip).getAllByRole('listitem').map((item) => item.textContent)).toEqual(labels)
    expect(within(strip).queryByRole('heading')).not.toBeInTheDocument()
    expect(strip.querySelector('img, article')).toBeNull()
  })

  it('entrega o conteúdo visível no SSR sem depender de JavaScript ou motion', () => {
    const html = renderToString(<TrustFeaturesSection section={section} />)
    for (const label of labels) expect(html).toContain(label)
    expect(html).not.toMatch(/opacity|transform|amigo-reveal-ready|★|AggregateRating/)
    expect(JSON.stringify(homePage.metadata.structuredData)).not.toMatch(/AggregateRating|"Review"/)
    expect(homePage.sections.some((item) => item.type === 'proof-gallery' || item.type === 'reviews')).toBe(false)
  })
})
