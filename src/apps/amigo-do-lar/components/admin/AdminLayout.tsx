import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { AdminHeader } from './AdminHeader'
import { AdminSidebar } from './AdminSidebar'

export function AdminLayout() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  if (!auth.user) return null

  function logout() {
    auth.logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="amigo-admin-shell">
      <AdminHeader user={auth.user} menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((open) => !open)} />
      <aside id="admin-navigation" className="amigo-admin-sidebar" data-open={menuOpen || undefined}>
        <AdminSidebar user={auth.user} onLogout={logout} onNavigate={() => setMenuOpen(false)} />
      </aside>
      {menuOpen && <button className="amigo-admin-menu-backdrop" type="button" aria-label="Dispensar menu administrativo" onClick={() => setMenuOpen(false)} />}
      <div className="amigo-admin-content"><Outlet /></div>
    </div>
  )
}
