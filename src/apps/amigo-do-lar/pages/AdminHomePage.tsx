import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { AdminPageMetadata } from '../components/AdminPageMetadata'

export function AdminHomePage() {
  const auth = useAuth()
  const navigate = useNavigate()

  function logout() {
    auth.logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <main id="conteudo-principal" className="amigo-admin-page">
      <AdminPageMetadata title="Administração — Amigo do Lar" />
      <header className="amigo-admin-header">
        <div>
          <p className="amigo-eyebrow">Portal administrativo</p>
          <p>{auth.user?.name}</p>
        </div>
        <button className="amigo-button amigo-button-secondary" onClick={logout}>
          Sair
        </button>
      </header>
      <section className="amigo-admin-card">
        <h1>Dashboard administrativo</h1>
        <p>Acompanhe e atualize as solicitações recebidas.</p>
        <Link className="amigo-button" to="/admin/solicitacoes">
          Gerenciar solicitações
        </Link>
        <Link className="amigo-button amigo-button-secondary" to="/admin/agenda">
          Gerenciar agenda
        </Link>
      </section>
    </main>
  )
}
