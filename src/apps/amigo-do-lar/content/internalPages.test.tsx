import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render as renderPage } from '../../../entry-server'
import { publicRoutes } from '../config/publicRoutes'
import { routes } from '../config/routes'
import { getContextualWhatsAppUrl, getWhatsAppMessage } from '../config/whatsapp'
import { publishedServiceAreas, serviceAreas } from '../data/serviceAreas'
import { services } from '../data/services'
import { HeroSection, ServicesGridSection } from '../sections/sections'
import { useServices } from '../api/useServices'
import { aboutPage, areaPages, areasPage, homePage, houseListPage, servicePages, servicesPage } from './pageFactory'

vi.mock('../api/useServices', () => ({ useServices: vi.fn(() => ({ status: 'idle', data: undefined })) }))
afterEach(() => { vi.clearAllMocks(); delete window.gtag })

const originalPaths = [
  '/', '/servicos', '/servicos/eletrica', '/servicos/hidraulica',
  '/servicos/montagem-de-moveis', '/servicos/fechaduras-e-portas', '/servicos/pintura', '/servicos/pequenos-reparos',
  '/areas-atendidas', '/areas-atendidas/taguatinga', '/areas-atendidas/aguas-claras', '/areas-atendidas/guara',
  '/areas-atendidas/asa-sul', '/areas-atendidas/asa-norte', '/areas-atendidas/sudoeste', '/areas-atendidas/noroeste',
  '/areas-atendidas/lago-sul', '/areas-atendidas/lago-norte', '/sobre', '/contato', '/perguntas-frequentes',
  '/politica-de-privacidade', '/termos-de-uso', '/solicitar-atendimento', '/solicitacao-enviada',
]

 describe('Etapa 5: páginas internas públicas', () => {
  it('preserva as 25 rotas originais e adiciona somente Lista da Casa', () => {
    expect(publicRoutes.map(route => route.pathname).sort()).toEqual([...originalPaths, '/lista-da-casa'].sort())
    expect(publicRoutes.filter(route => route.prerender)).toHaveLength(26)
    expect(publicRoutes.filter(route => route.includeInSitemap && route.page.metadata.robots?.index)).toHaveLength(25)
    expect(routes.some(route => route.path === '/lista-da-casa')).toBe(true)
  })

  it.each(publicRoutes)('renderiza $pathname no SSR com um H1 e sem provas ou ratings', ({ pathname }) => {
    const html = renderPage(pathname)
    expect(html.match(/<h1(?:\s|>)/g)).toHaveLength(1)
    expect(html).not.toMatch(/AggregateRating|"@type":"Review"|★|amigo-reveal-ready|opacity:0/)
  })

  it('preserva o Hero da Home e usa placeholders explícitos nas internas', () => {
    expect(homePage.sections[0]).toMatchObject({ type: 'hero', data: { variant: 'home', media: { kind: 'image', src: '/joao.png' } } })
    for (const page of [servicesPage, ...servicePages, areasPage, ...areaPages, aboutPage, houseListPage]) {
      expect(page.sections[0]).toMatchObject({ type: 'hero', data: { media: { kind: 'placeholder', label: expect.stringMatching(/^\[ASSET REAL — /) } } })
      expect(JSON.stringify(page)).not.toMatch(/proof-gallery|"reviews"|AggregateRating|aggregateRating|ratingValue/)
    }
  })

  it('preserva conteúdo factual e links de todos os serviços', () => {
    for (const [index, service] of services.entries()) {
      const page = servicePages[index]
      expect(page.slug).toBe(`/servicos/${service.slug}`)
      const html = renderPage(page.slug)
      for (const text of [service.introduction, ...service.problems, ...service.examples, service.limitations]) {
        const document = new DOMParser().parseFromString(html, 'text/html')
        expect(document.body.textContent).toContain(text)
      }
      expect(page.sections[0]).toMatchObject({ data: { variant: 'service', actions: [{ href: getContextualWhatsAppUrl(page.slug) }, { href: `/solicitar-atendimento?servico=${service.slug}` }] } })
      expect(page.sections.at(-1)).toMatchObject({ data: { primaryAction: { href: getContextualWhatsAppUrl(page.slug) } } })
    }
  })

  it('preserva somente as regiões publicadas e seus fatos locais', () => {
    expect(areaPages.map(page => page.slug)).toEqual(publishedServiceAreas.map(area => `/areas-atendidas/${area.slug}`))
    for (const area of publishedServiceAreas) {
      const html = renderPage(`/areas-atendidas/${area.slug}`)
      expect(html).toContain(area.profile)
      expect(html).toContain(area.commonNeeds)
      expect(html).toContain('data-hero-variant="location"')
    }
    for (const area of serviceAreas.filter(area => !area.published)) {
      expect(publicRoutes.some(route => route.pathname === `/areas-atendidas/${area.slug}`)).toBe(false)
    }
  })

  it('apresenta a operação familiar sem substituir a fotografia pendente', () => {
    const html = renderPage('/sobre')
    expect(html).toContain('Uma operação familiar. Um padrão profissional.')
    expect(html).toContain('[ASSET REAL — FUNDADORES / JOÃO + PAI / UNIFORME / AMBIENTE RESIDENCIAL]')
    expect(html).toContain('Padrão Amigo do Lar')
  })

  it('registra metadata indexável e explica as condições da Lista da Casa no SSR', () => {
    expect(houseListPage.metadata).toMatchObject({
      title: expect.stringContaining('Lista da Casa'), description: expect.stringContaining('avaliação'),
      canonicalUrl: expect.stringMatching(/\/lista-da-casa$/), robots: { index: true, follow: true },
    })
    const html = renderPage('/lista-da-casa')
    for (const text of ['Para quem serve', 'fotos', 'orçamento', 'aprovação', 'materiais', 'Padrão Amigo do Lar', 'conforme o serviço']) expect(html).toContain(text)
    expect(html).not.toMatch(/assinatura|preço fixo|desconto|ilimitado|mesmo dia|promoção/)
    expect(getWhatsAppMessage('/lista-da-casa')).toContain('pendências para avaliação')
  })

  it('usa o label da Lista da Casa somente nos três CTAs primários da experiência', () => {
    const expectedLabel = 'Enviar minha Lista da Casa'
    const listPageHtml = renderPage('/lista-da-casa')
    expect(listPageHtml.match(new RegExp(expectedLabel, 'g'))).toHaveLength(3)
    expect(listPageHtml).not.toContain('Pedir orçamento pelo WhatsApp')

    const contextualUrl = getContextualWhatsAppUrl('/lista-da-casa')
    const listPrimaryActions = houseListPage.sections.flatMap((section) => {
      if (section.type === 'hero') return section.data.actions.slice(0, 1)
      if (section.type === 'house-list') return section.data.action ? [section.data.action] : []
      if (section.type === 'call-to-action') return [section.data.primaryAction]
      return []
    })
    expect(listPrimaryActions).toHaveLength(3)
    expect(listPrimaryActions).toEqual(
      listPrimaryActions.map((action) => ({ ...action, label: expectedLabel, href: contextualUrl })),
    )

    for (const route of publicRoutes.filter((route) => !['/', '/lista-da-casa'].includes(route.pathname))) {
      expect(renderPage(route.pathname)).not.toContain(expectedLabel)
    }
  })

  it('um clique contextual dispara whatsapp_click uma única vez', () => {
    window.gtag = vi.fn()
    const hero = servicePages[0].sections[0]
    if (hero.type !== 'hero') throw new Error('Hero ausente')
    render(<MemoryRouter><HeroSection section={hero} /></MemoryRouter>)
    const link = screen.getByRole('link', { name: /Pedir orçamento pelo WhatsApp/ })
    expect(link).toHaveAttribute('href', getContextualWhatsAppUrl('/servicos/eletrica'))
    fireEvent.click(link)
    expect(window.gtag).toHaveBeenCalledExactlyOnceWith('event', 'whatsapp_click', {})
  })

  it.each(['idle', 'loading', 'error', 'success'] as const)('mantém URLs e catálogo com API em %s', (status) => {
    vi.mocked(useServices).mockReturnValue({
  status,
  data: status === 'success' ? [{
    id: 'api-eletrica',
    slug: 'eletrica',
    name: 'Elétrica API',
    description: 'Descrição API',
    category: 'ELECTRICAL',
    isActive: true,
    createdAt: '',
    updatedAt: '',
  }] : undefined,
  retry: vi.fn(),
  })
    const section = servicesPage.sections.find(section => section.type === 'services-grid')!
    render(<MemoryRouter><ServicesGridSection section={section} /></MemoryRouter>)
    expect(screen.getAllByRole('link').map(link => link.getAttribute('href'))).toEqual(services.map(service => `/servicos/${service.slug}`))
    expect(screen.getByText(status === 'success' ? 'Elétrica API' : 'Elétrica')).toBeInTheDocument()
  })
})
