import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../../test/render'
import { Breadcrumbs } from './Breadcrumbs'

describe('Breadcrumbs', () => {
  it('não renderiza trilha para uma página sem ancestral', () => {
    renderWithProviders(
      <Breadcrumbs items={[{ id: 'home', label: 'Início', path: '/' }]} />,
    )

    expect(
      screen.queryByRole('navigation', { name: 'Trilha de navegação' }),
    ).not.toBeInTheDocument()
  })

  it('expõe ancestrais como links e a página atual semanticamente', () => {
    renderWithProviders(
      <Breadcrumbs
        items={[
          { id: 'home', label: 'Início', path: '/' },
          { id: 'services', label: 'Serviços', path: '/servicos' },
          {
            id: 'electrical',
            label: 'Elétrica',
            path: '/servicos/eletrica',
          },
        ]}
      />,
    )

    expect(
      screen.getByRole('navigation', { name: 'Trilha de navegação' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Início' })).toHaveAttribute(
      'href',
      '/',
    )
    expect(screen.getByRole('link', { name: 'Serviços' })).toHaveAttribute(
      'href',
      '/servicos',
    )
    expect(screen.getByText('Elétrica')).toHaveAttribute(
      'aria-current',
      'page',
    )
  })
})
