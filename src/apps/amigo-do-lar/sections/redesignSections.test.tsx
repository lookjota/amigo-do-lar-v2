import { render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { PageSection } from '../../../domain/pages/PageSection'
import {
  ProofGallerySection,
  ReviewsSection,
} from './redesignSections'

type ProofSection = Extract<PageSection, { type: 'proof-gallery' }>
type ReviewsSectionData = Extract<PageSection, { type: 'reviews' }>

const emptyProof: ProofSection = {
  id: 'provas',
  type: 'proof-gallery',
  data: {
    eyebrow: 'Atendimentos',
    title: 'Serviços realizados',
  },
}

const emptyReviews: ReviewsSectionData = {
  id: 'avaliacoes',
  type: 'reviews',
  data: {
    eyebrow: 'Avaliações',
    title: 'O que dizem os clientes',
    items: [],
  },
}

describe('seções condicionais do redesign', () => {
  it('não renderiza Proof Gallery sem dados reais', () => {
    const { container } = render(<ProofGallerySection section={emptyProof} />)

    expect(container).toBeEmptyDOMElement()
    expect(renderToString(<ProofGallerySection section={emptyProof} />)).toBe('')
  })

  it('não renderiza Reviews, estrelas ou ratings sem avaliações', () => {
    const { container } = render(<ReviewsSection section={emptyReviews} />)

    expect(container).toBeEmptyDOMElement()
    expect(container).not.toHaveTextContent('★')
    expect(container.innerHTML).not.toMatch(/rating|aggregate/i)
    expect(renderToString(<ReviewsSection section={emptyReviews} />)).toBe('')
  })

  it('renderiza somente provas com mídia real no cliente e no SSR', () => {
    const proof: ProofSection = {
      ...emptyProof,
      data: {
        ...emptyProof.data,
        items: [{
          service: 'Instalação de suporte',
          region: 'Asa Sul',
          media: {
            kind: 'image',
            src: '/proof/suporte.webp',
            alt: 'Suporte de televisão instalado na parede',
            width: 1200,
            height: 900,
          },
        }],
      },
    }

    render(<ProofGallerySection section={proof} />)
    expect(screen.getByRole('img')).toHaveAttribute('src', '/proof/suporte.webp')
    expect(screen.getByText(/Instalação de suporte/)).toBeInTheDocument()

    const html = renderToString(<ProofGallerySection section={proof} />)
    expect(html).toContain('/proof/suporte.webp')
    expect(html).not.toMatch(/Review|AggregateRating/)
  })

  it('só exibe rating quando ele existe no dado real da avaliação', () => {
    const reviews: ReviewsSectionData = {
      ...emptyReviews,
      data: {
        ...emptyReviews.data,
        items: [{
          quote: 'Atendimento organizado.',
          attribution: 'Cliente identificado',
        }],
      },
    }

    const { container } = render(<ReviewsSection section={reviews} />)
    expect(screen.getByText('Atendimento organizado.')).toBeInTheDocument()
    expect(container).not.toHaveTextContent('★')
    expect(container.innerHTML).not.toMatch(/rating|aggregate/i)
  })
})
