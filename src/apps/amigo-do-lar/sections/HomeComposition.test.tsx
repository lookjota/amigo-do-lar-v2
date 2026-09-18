import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToString } from 'react-dom/server'
import { MemoryRouter, StaticRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PageSectionRegistryProvider } from '../../../engine/PageSectionRegistry'
import { PageRenderer } from '../../../engine/PageRenderer'
import { homePage, pages } from '../content/pageFactory'
import { services } from '../data/services'
import { publishedServiceAreas } from '../data/serviceAreas'
import { pageSectionRegistry } from '../registry/pageSectionRegistry'
import { useServices } from '../api/useServices'

vi.mock('../api/useServices', () => ({ useServices: vi.fn() }))

function Home() {
  return <PageSectionRegistryProvider value={pageSectionRegistry}><PageRenderer page={homePage} /></PageSectionRegistryProvider>
}

const order = ['conteudo-principal', 'confianca', 'problema', 'solucao', 'servicos', 'lista-da-casa', 'como-funciona', 'sobre', 'areas-atendidas', 'perguntas-frequentes', 'solicitar-atendimento']

beforeEach(() => {
  vi.mocked(useServices).mockReturnValue({ status: 'error', retry: vi.fn() })
})

describe('composição da Home — Etapa 4', () => {
  it('renderiza a narrativa completa em ordem, sem slots vazios de prova ou avaliações', () => {
    const { container } = render(<MemoryRouter><Home /></MemoryRouter>)
    expect(Array.from(container.querySelectorAll('main, section')).map((node) => node.id)).toEqual(order)
    expect(screen.getByRole('heading', { name: 'Manutenção da casa não deveria virar outra tarefa para administrar.' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Um contato para cuidar das pequenas demandas da sua casa.' })).toBeInTheDocument()
    expect(screen.getByText('QUEM ESTÁ ENTRANDO NA SUA CASA')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Uma operação familiar. Um padrão profissional.' })).toBeInTheDocument()
    expect(container.innerHTML).not.toMatch(/AggregateRating|★★★★★|Clientes satisfeitos|Anos de experiência|Melhor de Brasília|PROOF SLOT|REVIEWS SLOT/)
    expect(screen.getAllByRole('img').filter((node) => node.tagName === 'IMG')).toHaveLength(1)
  })

  it.each(['error', 'success'] as const)('preserva catálogo publicado e URLs com API em %s', (status) => {
    vi.mocked(useServices).mockReturnValue({ status, retry: vi.fn(), data: status === 'success' ? [
      { id: '1', slug: services[0].slug, name: services[0].name, description: 'Descrição da API', category: 'Casa', isActive: true, createdAt: '', updatedAt: '' },
      { id: '2', slug: 'servico-nao-publicado', name: 'Não publicado', description: '', category: 'Casa', isActive: true, createdAt: '', updatedAt: '' },
    ] : undefined })
    const { container } = render(<MemoryRouter><Home /></MemoryRouter>)
    const section = container.querySelector('#servicos')!
    expect(Array.from(section.querySelectorAll('.amigo-service-card a')).map((link) => link.getAttribute('href'))).toEqual(services.map((service) => `/servicos/${service.slug}`))
    for (const service of services) expect(pages.find((page) => page.slug === `/servicos/${service.slug}`)?.metadata.robots?.index).toBe(true)
    expect(section).not.toHaveTextContent('Não publicado')
    if (status === 'success') expect(section).toHaveTextContent('Descrição da API')
    expect(section.querySelectorAll('img')).toHaveLength(0)
  })

  it('identifica a checklist como exemplo, usa WhatsApp contextual e preserva a rota Lista da Casa', () => {
    const { container } = render(<MemoryRouter><Home /></MemoryRouter>)
    const house = container.querySelector('#lista-da-casa') as HTMLElement
    expect(within(house).getByText('Exemplo de uma Lista da Casa')).toBeInTheDocument()
    expect(within(house).getAllByRole('listitem')).toHaveLength(5)
    const url = new URL(within(house).getByRole('link').getAttribute('href')!)
    expect(url.searchParams.get('text')).toBe('Quero enviar minha Lista da Casa.')
    expect(pages.some((page) => page.slug === '/lista-da-casa')).toBe(true)
  })

  it('apresenta os três estágios e todos os verbos, com stagger de até 160ms', () => {
    const { container } = render(<MemoryRouter><Home /></MemoryRouter>)
    const stages = container.querySelectorAll('#como-funciona article')
    expect(Array.from(stages).map((stage) => stage.querySelector('h3')?.textContent)).toEqual(['ANTES', 'DURANTE', 'DEPOIS'])
    expect(Array.from(stages).map((stage) => Array.from(stage.querySelectorAll('li')).map((li) => li.textContent))).toEqual([
      ['Entender', 'Avaliar', 'Orçar', 'Agendar'], ['Confirmar', 'Proteger', 'Executar', 'Comunicar'], ['Testar', 'Conferir', 'Organizar', 'Limpar'],
    ])
    expect(Array.from(container.querySelectorAll<HTMLElement>('.amigo-standard-grid > div')).map((node) => node.style.getPropertyValue('--amigo-reveal-delay'))).toEqual(['0ms', '80ms', '160ms'])
  })

  it('preserva links regionais e FAQ semântico, expansível', async () => {
    const user = userEvent.setup()
    const { container } = render(<MemoryRouter><Home /></MemoryRouter>)
    expect(Array.from(container.querySelectorAll('.amigo-area-links a')).map((link) => link.getAttribute('href'))).toEqual(publishedServiceAreas.map((area) => `/areas-atendidas/${area.slug}`))
    const summary = container.querySelector('summary')!
    await user.click(summary)
    expect(summary.parentElement).toHaveAttribute('open')
    await user.click(summary)
    expect(summary.parentElement).not.toHaveAttribute('open')
    const faq = homePage.sections.find((section) => section.type === 'faq')!
    for (const item of faq.data.items) expect(screen.getByText(item.answer)).toBeInTheDocument()
    expect(JSON.stringify(homePage.metadata.structuredData)).toContain('FAQPage')
  })

  it('fecha com WhatsApp primário e formulário secundário', () => {
    const { container } = render(<MemoryRouter><Home /></MemoryRouter>)
    const final = container.querySelector('#solicitar-atendimento') as HTMLElement
    expect(within(final).getByRole('heading', { name: 'O que está esperando para ser resolvido na sua casa?' })).toBeInTheDocument()
    const links = within(final).getAllByRole('link')
    expect(links[0].getAttribute('href')).toContain('wa.me')
    expect(links[1]).toHaveAttribute('href', '/solicitar-atendimento')
  })

  it('SSR entrega todas as seções visíveis e não inclui avaliações em JSON-LD', () => {
    const html = renderToString(<StaticRouter location="/"><Home /></StaticRouter>)
    for (const id of order) expect(html).toContain(`id="${id}"`)
    expect(html).not.toMatch(/amigo-reveal-ready|opacity:0|AggregateRating|"@type":"Review"/)
    expect(html).toContain('[ASSET REAL — JOÃO + PAI UNIFORMIZADOS]')
  })

  it('mantém os reveals visíveis quando reduced motion está ativo', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })))
    try {
      const { container } = render(<MemoryRouter><Home /></MemoryRouter>)
      expect(container.querySelectorAll('.amigo-reveal-ready')).toHaveLength(0)
      expect(container.querySelectorAll('.amigo-reveal.is-visible').length).toBeGreaterThan(10)
    } finally {
      vi.unstubAllGlobals()
    }
  })
})
