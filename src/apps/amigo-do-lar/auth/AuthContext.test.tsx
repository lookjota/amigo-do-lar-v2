import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '../api/apiClient'
import { AdminHomePage } from '../pages/AdminHomePage'
import { AdminLoginPage } from '../pages/AdminLoginPage'
import { AuthProvider } from './AuthContext'
import { ProtectedRoute } from './ProtectedRoute'
import { storeSession } from './sessionStorage'
import { useAuth } from './useAuth'

const user = {
  id: 'b32efc7d-bb72-4d0b-a64b-b34f4fc83bad',
  name: 'Admin',
  email: 'admin@example.com',
  role: 'ADMIN' as const,
}

function LocationStatus() {
  const location = useLocation()
  return <output aria-label="Rota atual">{location.pathname}</output>
}

function TestRoutes({ initialEntry = '/admin/login' }) {
  return (
    <MemoryRouter initialEntries={[initialEntry]}>
      <AuthProvider>
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminHomePage />} />
          </Route>
        </Routes>
        <LocationStatus />
      </AuthProvider>
    </MemoryRouter>
  )
}

afterEach(() => {
  window.sessionStorage.clear()
  vi.useRealTimers()
})

describe('autenticação administrativa', () => {
  it('faz login, persiste apenas a sessão e redireciona ao admin', async () => {
    const browser = userEvent.setup()
    const post = vi.spyOn(apiClient, 'post').mockResolvedValue({
      accessToken: 'jwt-value',
      tokenType: 'Bearer',
      expiresIn: 900,
      user,
    })
    render(<TestRoutes />)

    await browser.type(screen.getByLabelText('E-mail'), user.email)
    await browser.type(screen.getByLabelText('Senha'), 'secure-password')
    await browser.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(
      await screen.findByText('Dashboard administrativo'),
    ).toBeInTheDocument()
    expect(post).toHaveBeenCalledWith('/auth/login', {
      email: user.email,
      password: 'secure-password',
    })
    expect(window.sessionStorage.length).toBe(1)
    expect(
      window.sessionStorage.getItem(window.sessionStorage.key(0)!),
    ).not.toContain('secure-password')
  })

  it('valida o formulário antes de chamar a API', async () => {
    const browser = userEvent.setup()
    const post = vi.spyOn(apiClient, 'post')
    render(<TestRoutes />)

    await browser.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(
      await screen.findByText('Informe um e-mail válido.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Informe sua senha.')).toBeInTheDocument()
    expect(post).not.toHaveBeenCalled()
  })

  it('faz logout, apaga a sessão e retorna ao login', async () => {
    storeSession({
      accessToken: 'jwt-value',
      expiresAt: Date.now() + 60_000,
      user,
    })
    const browser = userEvent.setup()
    render(<TestRoutes initialEntry="/admin" />)

    await browser.click(await screen.findByRole('button', { name: 'Sair' }))

    expect(await screen.findByRole('heading', { name: 'Acesse sua conta' }))
      .toBeInTheDocument()
    expect(window.sessionStorage.length).toBe(0)
  })

  it('impede rota protegida e redireciona visitantes ao login', async () => {
    render(<TestRoutes initialEntry="/admin" />)

    expect(await screen.findByRole('heading', { name: 'Acesse sua conta' }))
      .toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Rota atual' }))
      .toHaveTextContent('/admin/login')
  })

  it('descarta uma sessão já expirada no bootstrap', async () => {
    window.sessionStorage.setItem(
      'amigo-do-lar.admin-session',
      JSON.stringify({ accessToken: 'expired', expiresAt: Date.now() - 1, user }),
    )
    render(<TestRoutes initialEntry="/admin" />)

    expect(await screen.findByRole('heading', { name: 'Acesse sua conta' }))
      .toBeInTheDocument()
    expect(window.sessionStorage.length).toBe(0)
  })

  it('expira uma sessão ativa no horário calculado', async () => {
    vi.useFakeTimers()
    storeSession({
      accessToken: 'jwt-value',
      expiresAt: Date.now() + 1_000,
      user,
    })
    render(<TestRoutes initialEntry="/admin" />)
    await act(async () => vi.advanceTimersByTime(0))
    expect(screen.getByText('Dashboard administrativo')).toBeInTheDocument()

    await act(async () => vi.advanceTimersByTime(1_000))

    expect(screen.getByRole('heading', { name: 'Acesse sua conta' }))
      .toBeInTheDocument()
    expect(window.sessionStorage.length).toBe(0)
  })
})

describe('AuthContext', () => {
  it('expõe o usuário restaurado pelo useAuth', async () => {
    storeSession({
      accessToken: 'jwt-value',
      expiresAt: Date.now() + 60_000,
      user,
    })

    function Consumer() {
      const auth = useAuth()
      return <output>{auth.status}:{auth.user?.email}</output>
    }

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    )
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        'authenticated:admin@example.com',
      ),
    )
  })

  it('exige o provider', () => {
    function Consumer() {
      useAuth()
      return null
    }

    expect(() => render(<Consumer />)).toThrow(
      'useAuth deve ser usado dentro de AuthProvider.',
    )
  })
})
