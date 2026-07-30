import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { AmigoDoLarApplication } from './apps/amigo-do-lar/AmigoDoLarApp'
import { notFoundPage } from './apps/amigo-do-lar/content/pageFactory'
import { publicRoutes } from './apps/amigo-do-lar/config/publicRoutes'

export { notFoundPage, publicRoutes }

export function render(pathname: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={pathname}>
        <AmigoDoLarApplication />
      </StaticRouter>
    </StrictMode>,
  )
}
