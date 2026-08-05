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
import { ServiceRequestPage } from './pages/ServiceRequestPage'
import { ServiceRequestSuccessPage } from './pages/ServiceRequestSuccessPage'
import { pageSectionRegistry } from './registry/pageSectionRegistry'
import { AuthProvider } from './auth/AuthContext'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminHomePage } from './pages/AdminHomePage'
import { AdminServiceRequestsPage } from './admin/service-requests/pages/AdminServiceRequestsPage'
import { AdminAppointmentsPage } from './admin/appointments/pages/AdminAppointmentsPage'

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
              <Route
                path="/solicitar-atendimento"
                element={<ServiceRequestPage />}
              />
              <Route
                path="/solicitacao-enviada"
                element={<ServiceRequestSuccessPage />}
              />
              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<PageRoute pageSlug={route.pageSlug} />}
                />
              ))}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminHomePage />} />
              <Route
                path="/admin/solicitacoes"
                element={<AdminServiceRequestsPage />}
              />
              <Route path="/admin/agenda" element={<AdminAppointmentsPage />} />
            </Route>
          </Routes>
          {import.meta.env.DEV && <ApiStatus />}
        </div>
      </PageSectionRegistryProvider>
    </AuthProvider>
  )
}

function PublicLayout() {
  return (
    <>
      <Analytics />
      <Header />
      <Outlet />
      <Footer />
      <WhatsAppButton />
    </>
  )
}
