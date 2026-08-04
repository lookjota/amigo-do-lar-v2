import type { RouteDefinition } from '../../../domain/navigation/RouteDefinition'
import { publicRoutes } from './publicRoutes'

export const routes: RouteDefinition[] = publicRoutes.filter((route) => !['/solicitar-atendimento', '/solicitacao-enviada'].includes(route.pathname)).map((route) => ({
  path: route.pathname,
  pageSlug: route.pageSlug,
}))
