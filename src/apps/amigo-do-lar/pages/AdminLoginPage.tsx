import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { HttpError } from '../../../shared/http'
import { useAuth } from '../auth/useAuth'
import { AdminPageMetadata } from '../components/AdminPageMetadata'

const loginSchema = z.object({
  email: z.email('Informe um e-mail válido.'),
  password: z.string().min(1, 'Informe sua senha.'),
})

interface LoginFormErrors {
  email?: string
  password?: string
  form?: string
}

interface LoginLocationState {
  from?: { pathname?: string; search?: string; hash?: string }
  reason?: 'expired'
}

function safeDestination(state: LoginLocationState | null): string {
  const pathname = state?.from?.pathname
  const destination = pathname
    ? `${pathname}${state?.from?.search ?? ''}${state?.from?.hash ?? ''}`
    : undefined
  return destination && /^\/admin(?:\/|$)/.test(destination) && pathname !== '/admin/login'
    ? destination
    : '/admin'
}

export function AdminLoginPage() {
  const auth = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LoginLocationState | null
  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  if (auth.status === 'authenticated') {
    return <Navigate to={safeDestination(state)} replace />
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrors({})

    const formData = new FormData(event.currentTarget)
    const result = loginSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    if (!result.success) {
      const fields = result.error.flatten().fieldErrors
      setErrors({ email: fields.email?.[0], password: fields.password?.[0] })
      return
    }

    setSubmitting(true)
    try {
      await auth.login(result.data)
      navigate(safeDestination(state), { replace: true })
    } catch (error) {
      setErrors({
        form:
          error instanceof HttpError && error.status === 401
            ? 'E-mail ou senha inválidos.'
            : 'Não foi possível entrar agora. Tente novamente.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main id="conteudo-principal" className="amigo-admin-auth">
      <AdminPageMetadata title="Acesso administrativo — Amigo do Lar" />
      <section className="amigo-admin-card" aria-labelledby="admin-login-title">
        <Link className="amigo-admin-login-brand" to="/" aria-label="Amigo do Lar, voltar ao site">
          <span aria-hidden="true">A</span><strong>Amigo do Lar</strong>
        </Link>
        <p className="amigo-eyebrow">Portal administrativo</p>
        <h1 id="admin-login-title">Acesse sua conta</h1>
        <p>Use suas credenciais administrativas para continuar.</p>
        {state?.reason === 'expired' && (
          <p className="amigo-form-message" role="status">
            Sua sessão expirou. Entre novamente.
          </p>
        )}
        <form onSubmit={submit} noValidate>
          <label htmlFor="admin-email">E-mail</label>
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="username"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'admin-email-error' : undefined}
          />
          {errors.email && <span id="admin-email-error">{errors.email}</span>}

          <label htmlFor="admin-password">Senha</label>
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? 'admin-password-error' : undefined
            }
          />
          {errors.password && (
            <span id="admin-password-error">{errors.password}</span>
          )}

          {errors.form && (
            <p
              className="amigo-form-message amigo-form-message-error"
              role="alert"
            >
              {errors.form}
            </p>
          )}
          <button
            className="amigo-button amigo-button-primary"
            disabled={submitting}
          >
            {submitting ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
        <Link className="amigo-admin-back-link" to="/">← Voltar ao site público</Link>
      </section>
    </main>
  )
}
