import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import { PageSectionRegistryProvider } from '../../engine/PageSectionRegistry'
import { ApiProvider } from './api/ApiProvider'
import { createQueryClient } from './api/queryClient'
import { Analytics } from './analytics/Analytics'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { WhatsAppButton } from './components/WhatsAppButton'
import { ApiStatus } from './components/ApiStatus'
import { routes } from './config/routes'
import { NotFoundPage } from './pages/NotFoundPage'
import { PageRoute } from './pages/PageRoute'
import { pageSectionRegistry } from './registry/pageSectionRegistry'
import { AuthProvider } from './auth/AuthContext'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminHomePage } from './pages/AdminHomePage'
import { AdminServiceRequestsPage } from './admin/service-requests/pages/AdminServiceRequestsPage'
import { AdminAppointmentsPage } from './admin/appointments/pages/AdminAppointmentsPage'
import { AdminCalendarPage } from './admin/calendar/pages/AdminCalendarPage'
import { AdminCustomersPage } from './admin/customers/pages/AdminCustomersPage'
import { AdminServicesPage } from './admin/services/pages/AdminServicesPage'
import { AdminUsersPage } from './admin/users/pages/AdminUsersPage'
import { AdminFinancePage } from './admin/finance/pages/AdminFinancePage'
import { AdminNotificationsPage } from './admin/notifications/pages/AdminNotificationsPage'
import { AdminLayout } from './components/admin'

export function AmigoDoLarApp() {
  const [queryClient] = useState(createQueryClient)

  return (
    <ApiProvider queryClient={queryClient}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AmigoDoLarApplication />
      </BrowserRouter>
    </ApiProvider>
  )
}

export function AmigoDoLarApplication() {
  return (
    <AuthProvider>
      <PageSectionRegistryProvider value={pageSectionRegistry}>
        <div className="amigo-app">
          <a className="amigo-skip-link" href="#conteudo-principal">
            Ir para o conteúdo principal
          </a>
          <Routes>
            <Route element={<PublicLayout />}>
              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<PageRoute pageSlug={route.pageSlug} />}
                />
              ))}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route element={<AdminScope />}>
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<AdminHomePage />} />
                  <Route path="/admin/solicitacoes" element={<AdminServiceRequestsPage />} />
                  <Route path="/admin/agenda" element={<AdminAppointmentsPage />} />
                  <Route path="/admin/calendario" element={<AdminCalendarPage />} />
                  <Route path="/admin/clientes" element={<AdminCustomersPage />} />
                  <Route path="/admin/servicos" element={<AdminServicesPage />} />
                  <Route path="/admin/financeiro" element={<AdminFinancePage />} />
                  <Route path="/admin/notificacoes" element={<AdminNotificationsPage />} />
                  <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                    <Route path="/admin/usuarios" element={<AdminUsersPage />} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Routes>
          {import.meta.env.DEV && <ApiStatus />}
        </div>
      </PageSectionRegistryProvider>
    </AuthProvider>
  )
}

function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="amigo-public-scope">
      <Analytics />
      <Header menuOpen={menuOpen} onMenuOpenChange={setMenuOpen} />
      <Outlet />
      <Footer />
      <WhatsAppButton menuOpen={menuOpen} />
    </div>
  )
}

function AdminScope() {
  return (
    <div className="amigo-admin-scope">
      <Outlet />
    </div>
  )
}
