import { render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter, StaticRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { PageSection } from '../../../domain/pages/PageSection'
import { HeroSection } from './sections'

type HeroSectionData = Extract<PageSection, { type: 'hero' }>

function hero(variant: NonNullable<HeroSectionData['data']['variant']>): HeroSectionData {
  return {
    id: 'inicio',
    type: 'hero',
    data: {
      variant,
      eyebrow: 'Serviços residenciais em Brasília',
      title: 'Sua casa cuidada com padrão profissional.',
      description: 'Reparos e instalações com cuidado.',
      motto: 'Envie fotos e uma breve descrição.',
      actions: [{ label: 'Ver serviços', href: '/servicos' }],
      media: {
        kind: 'image',
        src: '/joao.png',
        alt: 'Asset atual em avaliação',
        width: 1448,
        height: 1086,
        productionStatus: 'temporary-fallback',
      },
    },
  }
}

describe('variantes do Hero', () => {
  it.each(['home', 'internal', 'service', 'location'] as const)('renderiza a variante %s', (variant) => {
    const { container } = render(<MemoryRouter><HeroSection section={hero(variant)} /></MemoryRouter>)
    expect(container.querySelector('.amigo-hero')).toHaveAttribute('data-hero-variant', variant)
    expect(screen.getByRole('heading', { level: 1 })).toHaveClass('amigo-display-heading')
    expect(container.querySelector('.amigo-hero-eyebrow')).toBeInTheDocument()
    expect(container.querySelector('.amigo-hero-actions')).toBeInTheDocument()
    expect(container.querySelector('.amigo-hero-media')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Asset atual em avaliação' })).toBeInTheDocument()
  })

  it('mantém markup determinístico no SSR e identifica o fallback temporário', () => {
    const html = renderToString(<StaticRouter location="/"><HeroSection section={hero('home')} /></StaticRouter>)
    expect(html).toContain('data-hero-variant="home"')
    expect(html).toContain('data-media-status="temporary-fallback"')
    expect(html).toContain('Sua casa cuidada com padrão profissional.')
    expect(html).not.toContain('opacity:0')
  })
})
