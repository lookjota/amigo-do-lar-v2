import { CalendarDays, ClipboardList, Settings, UserPlus, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const commonActions = [
  { label: 'Ver solicitações', to: '/admin/solicitacoes', icon: ClipboardList },
  { label: 'Ver agenda', to: '/admin/agenda', icon: CalendarDays },
  { label: 'Novo cliente', to: '/admin/clientes?create=1', icon: UserPlus },
] as const

const adminActions = [
  { label: 'Novo serviço', to: '/admin/servicos?create=1', icon: Settings },
  { label: 'Gerenciar usuários', to: '/admin/usuarios', icon: Users },
] as const

export function QuickActions({ isAdmin }: { isAdmin: boolean }) {
  const actions = isAdmin ? [...commonActions, ...adminActions] : commonActions
  return <nav className="amigo-dashboard-actions" aria-label="Ações rápidas">{actions.map(({ label, to, icon: Icon }) => <Link key={to} to={to}><Icon aria-hidden="true" size={19} />{label}</Link>)}</nav>
}
