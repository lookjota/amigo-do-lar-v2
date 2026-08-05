import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Footer } from './Footer'

describe('Footer público', () => {
  it('oferece um acesso discreto à área administrativa', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>)

    expect(screen.getByRole('link', { name: 'Área administrativa' }))
      .toHaveAttribute('href', '/admin/login')
  })
})
