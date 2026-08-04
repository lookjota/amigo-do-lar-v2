import { BrowserRouter, Route, Routes } from 'react-router-dom'
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
    <PageSectionRegistryProvider value={pageSectionRegistry}>
      <div className="amigo-app">
        <a className="amigo-skip-link" href="#conteudo-principal">
          Ir para o conteúdo principal
        </a>
        <Analytics />
        <Header />
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<PageRoute pageSlug={route.pageSlug} />}
            />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
        <WhatsAppButton />
        {import.meta.env.DEV && <ApiStatus />}
      </div>
    </PageSectionRegistryProvider>
  )
}
