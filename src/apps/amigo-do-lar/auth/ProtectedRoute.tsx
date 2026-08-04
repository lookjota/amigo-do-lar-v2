import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'

export function ProtectedRoute() {
  const auth = useAuth()
  const location = useLocation()

  if (auth.status === 'initializing') {
    return <main className="amigo-admin-loading">Verificando sessão…</main>
  }

  if (auth.status === 'anonymous') {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
