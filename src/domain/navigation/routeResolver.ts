import type { NavigationItem } from './NavigationItem'
import type { RouteDefinition } from './RouteDefinition'

export type RouteIssue =
  | {
      type: 'duplicate-path'
      path: string
    }
  | {
      type: 'duplicate-page-slug'
      pageSlug: string
    }
  | {
      type: 'empty-path'
      routeIndex: number
    }
  | {
      type: 'empty-page-slug'
      routeIndex: number
    }

export type RouteNavigationIssue =
  | {
      type: 'missing-route'
      itemId: string
      path: string
    }
  | {
      type: 'path-conflict'
      path: string
      navigationItemCount: number
      routeCount: number
    }

export function findRouteIssues(
  routes: RouteDefinition[],
): RouteIssue[] {
  const issues: RouteIssue[] = []
  const paths = new Set<string>()
  const pageSlugs = new Set<string>()

  routes.forEach((route, routeIndex) => {
    if (route.path.trim() === '') {
      issues.push({ type: 'empty-path', routeIndex })
    } else if (paths.has(route.path)) {
      issues.push({ type: 'duplicate-path', path: route.path })
    } else {
      paths.add(route.path)
    }

    if (route.pageSlug.trim() === '') {
      issues.push({ type: 'empty-page-slug', routeIndex })
    } else if (pageSlugs.has(route.pageSlug)) {
      issues.push({
        type: 'duplicate-page-slug',
        pageSlug: route.pageSlug,
      })
    } else {
      pageSlugs.add(route.pageSlug)
    }
  })

  return issues
}

export function findRouteNavigationIssues(
  routes: RouteDefinition[],
  navigationItems: NavigationItem[],
): RouteNavigationIssue[] {
  const issues: RouteNavigationIssue[] = []
  const routeCounts = new Map<string, number>()
  const navigationCounts = new Map<string, number>()

  routes.forEach((route) => {
    routeCounts.set(route.path, (routeCounts.get(route.path) ?? 0) + 1)
  })

  navigationItems.forEach((item) => {
    navigationCounts.set(
      item.path,
      (navigationCounts.get(item.path) ?? 0) + 1,
    )

    if (item.path.trim() !== '' && !routeCounts.has(item.path)) {
      issues.push({
        type: 'missing-route',
        itemId: item.id,
        path: item.path,
      })
    }
  })

  const configuredPaths = new Set([
    ...routeCounts.keys(),
    ...navigationCounts.keys(),
  ])

  configuredPaths.forEach((path) => {
    const navigationItemCount = navigationCounts.get(path) ?? 0
    const routeCount = routeCounts.get(path) ?? 0

    if (
      path.trim() !== '' &&
      (navigationItemCount > 1 || routeCount > 1)
    ) {
      issues.push({
        type: 'path-conflict',
        path,
        navigationItemCount,
        routeCount,
      })
    }
  })

  return issues
}
