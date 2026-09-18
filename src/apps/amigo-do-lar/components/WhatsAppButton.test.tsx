import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { WhatsAppButton } from './WhatsAppButton'

const { getAnalyticsContext, trackEvent } = vi.hoisted(() => ({
  trackEvent: vi.fn(),
  getAnalyticsContext: vi.fn((pathname: string, origin?: string) => ({
    source_path: pathname,
    region_slug: pathname.split('/')[2],
    offer_context: 'standard',
    ...(origin ? { origin } : {}),
  })),
}))
vi.mock('../analytics/analytics', () => ({ getAnalyticsContext, trackEvent }))

describe('CTA móvel sticky', () => {
  beforeEach(() => {
    trackEvent.mockClear()
    Object.defineProperty(window, 'scrollY', { configurable: true, writable: true, value: 0 })
  })

  function renderSticky(menuOpen = false) {
    render(<div className="amigo-hero">Hero</div>)
    const hero = document.querySelector<HTMLElement>('.amigo-hero')!
    Object.defineProperty(hero, 'offsetTop', { configurable: true, value: 100 })
    Object.defineProperty(hero, 'offsetHeight', { configurable: true, value: 500 })

    return render(
      <MemoryRouter initialEntries={['/areas-atendidas/asa-sul']}>
        <WhatsAppButton menuOpen={menuOpen} />
      </MemoryRouter>,
    )
  }

  it('aparece após 80% do Hero e usa a origem contextual', () => {
    renderSticky()
    expect(screen.queryByRole('link', { name: /Pedir orçamento/ })).not.toBeInTheDocument()

    window.scrollY = 501
    fireEvent.scroll(window)
    const cta = screen.getByRole('link', { name: /Pedir orçamento/ })
    expect(cta).toHaveAttribute('href', expect.stringContaining('Asa%20Sul'))
    expect(cta.closest('.amigo-mobile-sticky-cta')).toBeInTheDocument()
  })

  it('não renderiza enquanto o menu está aberto', () => {
    renderSticky(true)
    window.scrollY = 600
    fireEvent.scroll(window)
    expect(screen.queryByRole('link', { name: /Pedir orçamento/ })).not.toBeInTheDocument()
  })

  it('registra whatsapp_click uma vez', async () => {
    const user = userEvent.setup()
    renderSticky()
    window.scrollY = 600
    fireEvent.scroll(window)
    await user.click(screen.getByRole('link', { name: /Pedir orçamento/ }))
    expect(trackEvent).toHaveBeenCalledTimes(1)
    expect(trackEvent).toHaveBeenCalledWith('whatsapp_click', {
      origin: 'sticky_mobile',
      source_path: '/areas-atendidas/asa-sul',
      region_slug: 'asa-sul',
      offer_context: 'standard',
    })
  })
})
