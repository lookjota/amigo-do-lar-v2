import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'
import { hasRole } from './authorization'
import type { UserRole } from './contracts'

export function ProtectedRoute({ allowedRoles }: { allowedRoles?: readonly UserRole[] }) {
  const auth = useAuth()
  const location = useLocation()

  if (auth.status === 'initializing') {
    return <main className="amigo-admin-loading">Verificando sessão…</main>
  }

  if (auth.status === 'anonymous') {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  if (allowedRoles && !hasRole(auth.user, allowedRoles)) {
    return <main id="conteudo-principal" className="amigo-admin-page"><section className="amigo-admin-card" role="alert"><h1>Acesso negado</h1><p>Você não tem permissão para acessar esta área.</p></section></main>
  }

  return <Outlet />
}
