import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { AmigoDoLarApplication } from './apps/amigo-do-lar/AmigoDoLarApp'
import { ApiProvider } from './apps/amigo-do-lar/api/ApiProvider'
import { createQueryClient } from './apps/amigo-do-lar/api/queryClient'
import { notFoundPage } from './apps/amigo-do-lar/content/pageFactory'
import { publicRoutes } from './apps/amigo-do-lar/config/publicRoutes'

export { notFoundPage, publicRoutes }

export function render(pathname: string): string {
  const queryClient = createQueryClient()

  return renderToString(
    <StrictMode>
      <ApiProvider queryClient={queryClient}>
        <StaticRouter location={pathname}>
          <AmigoDoLarApplication />
        </StaticRouter>
      </ApiProvider>
    </StrictMode>,
  )
}
