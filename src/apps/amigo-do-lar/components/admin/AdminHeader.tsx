import { Menu, ShieldCheck } from 'lucide-react'
import type { AuthUser } from '../../auth/contracts'
import { NotificationBell } from '../../admin/notifications/components/NotificationBell'

interface AdminHeaderProps {
  user: AuthUser
  menuOpen: boolean
  onMenuToggle: () => void
}

export function AdminHeader({ user, menuOpen, onMenuToggle }: AdminHeaderProps) {
  return (
    <header className="amigo-admin-shell-header">
      <button
        className="amigo-admin-menu-button"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="admin-navigation"
        aria-label={menuOpen ? 'Fechar menu administrativo' : 'Abrir menu administrativo'}
        onClick={onMenuToggle}
      >
        <Menu aria-hidden="true" />
      </button>
      <div className="amigo-admin-header-brand">
        <span aria-hidden="true">A</span>
        <div><strong>Amigo do Lar</strong><small>Portal administrativo</small></div>
      </div>
      <div className="amigo-admin-user">
        <ShieldCheck aria-hidden="true" />
        <div><strong>{user.name}</strong><span>{user.email}</span></div>
        <small>{user.role}</small>
      </div>
      <NotificationBell />
    </header>
  )
}
