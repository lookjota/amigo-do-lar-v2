import type { RouteDefinition } from '../../../domain/navigation/RouteDefinition'
import { publicRoutes } from './publicRoutes'

export const routes: RouteDefinition[] = publicRoutes.map((route) => ({
  path: route.pathname,
  pageSlug: route.pageSlug,
}))
