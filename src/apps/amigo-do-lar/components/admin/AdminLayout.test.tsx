import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AuthContext, type AuthContextValue } from '../../auth/auth-context'
import type { AuthUser } from '../../auth/contracts'
import { AdminLayout } from './AdminLayout'

const admin: AuthUser = { id: '1', name: 'Ada Admin', email: 'ada@example.com', role: 'ADMIN' }
const operator: AuthUser = { ...admin, id: '2', name: 'Olívia Operadora', role: 'OPERATOR' }

function renderLayout(user: AuthUser, logout = vi.fn()) {
  const value: AuthContextValue = {
    status: 'authenticated',
    user,
    login: vi.fn(),
    logout,
  }

  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <AuthContext.Provider value={value}>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<main id="conteudo-principal"><h1>Dashboard administrativo</h1></main>} />
          </Route>
          <Route path="/admin/login" element={<h1>Acesse sua conta</h1>} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>,
  )
}

describe('layout administrativo', () => {
  it('identifica o ADMIN e exibe toda a navegação permitida', () => {
    renderLayout(admin)

    expect(screen.getByText('Ada Admin')).toBeInTheDocument()
    expect(screen.getByText('ada@example.com')).toBeInTheDocument()
    expect(screen.getByText('ADMIN')).toBeInTheDocument()
    for (const label of ['Dashboard', 'Solicitações', 'Agenda', 'Clientes', 'Serviços', 'Usuários']) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    }
  })

  it('não oferece Usuários ao OPERATOR', () => {
    renderLayout(operator)

    expect(screen.getByText('OPERATOR')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Usuários' })).not.toBeInTheDocument()
  })

  it('abre e fecha a navegação móvel com estado acessível', async () => {
    const browser = userEvent.setup()
    renderLayout(admin)
    const toggle = screen.getByRole('button', { name: 'Abrir menu administrativo' })

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await browser.click(toggle)
    expect(screen.getByRole('button', { name: 'Fechar menu administrativo' })).toHaveAttribute('aria-expanded', 'true')
    expect(document.querySelector('#admin-navigation')).toHaveAttribute('data-open', 'true')
  })

  it('encerra a sessão e retorna ao login', async () => {
    const logout = vi.fn()
    const browser = userEvent.setup()
    renderLayout(admin, logout)

    await browser.click(screen.getByRole('button', { name: 'Sair' }))
    expect(logout).toHaveBeenCalledOnce()
    expect(screen.getByRole('heading', { name: 'Acesse sua conta' })).toBeInTheDocument()
  })
})
