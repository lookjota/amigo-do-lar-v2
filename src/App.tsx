import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppNavigation } from './apps/instituto-logos/components/AppNavigation'
import { navigationItems } from './apps/instituto-logos/config/navigation'
import { routes } from './apps/instituto-logos/config/routes'
import { NotFoundPage } from './apps/instituto-logos/pages/NotFoundPage'
import { PageRoute } from './apps/instituto-logos/pages/PageRoute'
import { pageSectionRegistry } from './apps/instituto-logos/registry/pageSectionRegistry'
import { findNavigationIssues } from './domain/navigation/navigationResolver'
import {
  findRouteIssues,
  findRouteNavigationIssues,
} from './domain/navigation/routeResolver'
import { PageSectionRegistryProvider } from './engine/PageSectionRegistry'

const navigationIssues = findNavigationIssues(navigationItems)
const routeIssues = findRouteIssues(routes)
const routeNavigationIssues = findRouteNavigationIssues(
  routes,
  navigationItems,
)

if (
  navigationIssues.length > 0 ||
  routeIssues.length > 0 ||
  routeNavigationIssues.length > 0
) {
  throw new Error(
    `Invalid application configuration: ${JSON.stringify({
      navigation: navigationIssues,
      routes: routeIssues,
      routeNavigation: routeNavigationIssues,
    })}`,
  )
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <PageSectionRegistryProvider value={pageSectionRegistry}>
        <AppNavigation items={navigationItems} />
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
      </PageSectionRegistryProvider>
    </BrowserRouter>
  )
}

export default App
