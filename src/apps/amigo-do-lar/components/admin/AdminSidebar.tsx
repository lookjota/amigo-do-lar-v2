import {
  CalendarDays,
  CalendarRange,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Settings,
  WalletCards,
  Users,
  UserRound,
  Bell,
  BookOpen,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { hasRole } from '../../auth/authorization'
import type { AuthUser } from '../../auth/contracts'

const navigation = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Solicitações', to: '/admin/solicitacoes', icon: ClipboardList, end: false },
  { label: 'Agenda', to: '/admin/agenda', icon: CalendarDays, end: false },
  { label: 'Calendário', to: '/admin/calendario', icon: CalendarRange, end: false },
  { label: 'Clientes', to: '/admin/clientes', icon: UserRound, end: false },
  { label: 'Serviços', to: '/admin/servicos', icon: Settings, end: false },
  { label: 'Financeiro', to: '/admin/financeiro', icon: WalletCards, end: false },
  { label: 'Notificações', to: '/admin/notificacoes', icon: Bell, end: false },
  { label: 'Conteúdo', to: '/admin/conteudos', icon: BookOpen, end: false },
] as const

interface AdminSidebarProps {
  user: AuthUser
  onLogout: () => void
  onNavigate?: () => void
}

export function AdminSidebar({ user, onLogout, onNavigate }: AdminSidebarProps) {
  return (
    <nav className="amigo-admin-sidebar-nav" aria-label="Navegação administrativa">
      {navigation.map(({ label, to, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} onClick={onNavigate}>
          <Icon aria-hidden="true" size={19} />
          {label}
        </NavLink>
      ))}
      {hasRole(user, ['ADMIN']) && (
        <NavLink to="/admin/usuarios" onClick={onNavigate}>
          <Users aria-hidden="true" size={19} />
          Usuários
        </NavLink>
      )}
      <button type="button" onClick={onLogout}>
        <LogOut aria-hidden="true" size={19} />
        Sair
      </button>
    </nav>
  )
}
