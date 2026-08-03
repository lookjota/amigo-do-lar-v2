import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../../test/render'
import { ServiceCard } from './ServiceCard'

function CurrentPath() {
  return <output aria-label="Rota atual">{useLocation().pathname}</output>
}

describe('ServiceCard', () => {
  it('apresenta o serviço e navega pelo link acessível', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <>
        <ServiceCard
          title="Elétrica"
          description="Reparos e instalações residenciais."
          href="/servicos/eletrica"
        />
        <CurrentPath />
      </>,
    )

    expect(
      screen.getByRole('heading', { name: 'Elétrica', level: 3 }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Reparos e instalações residenciais.'),
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('link', {
        name: 'Conhecer o serviço de elétrica',
      }),
    )
    expect(screen.getByRole('status', { name: 'Rota atual' })).toHaveTextContent(
      '/servicos/eletrica',
    )
  })
})
