import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { Header } from './Header'

const { getAnalyticsContext, trackEvent } = vi.hoisted(() => ({
  trackEvent: vi.fn(),
  getAnalyticsContext: vi.fn((pathname: string, origin?: string) => ({
    source_path: pathname,
    service_slug: pathname.split('/')[2],
    offer_context: 'standard',
    ...(origin ? { origin } : {}),
  })),
}))
vi.mock('../analytics/analytics', () => ({ getAnalyticsContext, trackEvent }))

function ControlledHeader() {
  const [open, setOpen] = useState(false)
  return <Header menuOpen={open} onMenuOpenChange={setOpen} />
}

describe('Header público', () => {
  it('abre, identifica e fecha o menu móvel por Escape', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><ControlledHeader /></MemoryRouter>)

    const toggle = screen.getByRole('button', { name: 'Abrir menu de navegação' })
    await user.click(toggle)
    expect(screen.getByRole('dialog', { name: 'Menu de navegação' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Navegação móvel' })).toBeInTheDocument()
    expect(document.body).toHaveStyle({ overflow: 'hidden' })

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog', { name: 'Menu de navegação' })).not.toBeInTheDocument()
    expect(document.body.style.overflow).toBe('')
  })

  it('usa WhatsApp contextual e registra um único evento por clique', async () => {
    trackEvent.mockClear()
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/servicos/eletrica']}><ControlledHeader /></MemoryRouter>)

    const cta = screen.getByRole('link', { name: 'Pedir orçamento' })
    expect(cta).toHaveAttribute('href', expect.stringContaining('El%C3%A9trica'))
    await user.click(cta)
    expect(trackEvent).toHaveBeenCalledTimes(1)
    expect(trackEvent).toHaveBeenCalledWith('whatsapp_click', {
      origin: 'header',
      source_path: '/servicos/eletrica',
      service_slug: 'eletrica',
      offer_context: 'standard',
    })
  })
})
