import { Link } from 'react-router-dom'
import { AdminPageMetadata } from '../components/AdminPageMetadata'

export function AdminHomePage() {
  return (
    <main id="conteudo-principal" className="amigo-admin-page">
      <AdminPageMetadata title="Administração — Amigo do Lar" />
      <header className="amigo-admin-header">
        <div>
          <p className="amigo-eyebrow">Portal administrativo</p>
          <h1>Dashboard administrativo</h1>
        </div>
      </header>
      <section className="amigo-admin-card">
        <p>Acompanhe e atualize as solicitações recebidas.</p>
        <Link className="amigo-button" to="/admin/solicitacoes">
          Gerenciar solicitações
        </Link>
        <Link className="amigo-button amigo-button-secondary" to="/admin/agenda">
          Gerenciar agenda
        </Link>
        <Link className="amigo-button amigo-button-secondary" to="/admin/clientes">
          Gerenciar clientes
        </Link>
        <Link className="amigo-button amigo-button-secondary" to="/admin/servicos">
          Gerenciar serviços
        </Link>
      </section>
    </main>
  )
}
