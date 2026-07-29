import type { NavigationItem } from './NavigationItem'

export type NavigationIssue =
  | {
      type: 'duplicate-id'
      itemId: string
    }
  | {
      type: 'duplicate-path'
      path: string
    }
  | {
      type: 'missing-parent'
      itemId: string
      parentId: string
    }
  | {
      type: 'cycle'
      itemId: string
    }

function compareNavigationItems(
  left: NavigationItem,
  right: NavigationItem,
): number {
  const orderDifference = (left.order ?? 0) - (right.order ?? 0)

  return orderDifference || left.label.localeCompare(right.label)
}

function visibleAndSorted(items: NavigationItem[]): NavigationItem[] {
  return items
    .filter((item) => item.visible !== false)
    .toSorted(compareNavigationItems)
}

export function getRootNavigationItems(
  items: NavigationItem[],
): NavigationItem[] {
  return visibleAndSorted(items.filter((item) => !item.parentId))
}

export function getChildNavigationItems(
  items: NavigationItem[],
  parentId: string,
): NavigationItem[] {
  return visibleAndSorted(
    items.filter((item) => item.parentId === parentId),
  )
}

export function findNavigationItemByPath(
  items: NavigationItem[],
  path: string,
): NavigationItem | undefined {
  return items.find((item) => item.path === path)
}

export function buildBreadcrumbs(
  items: NavigationItem[],
  path: string,
): NavigationItem[] {
  const itemById = new Map(items.map((item) => [item.id, item]))
  const currentItem = findNavigationItemByPath(items, path)

  if (!currentItem) {
    return []
  }

  const breadcrumbs: NavigationItem[] = []
  const visitedIds = new Set<string>()
  let item: NavigationItem | undefined = currentItem

  while (item) {
    if (visitedIds.has(item.id)) {
      return []
    }

    visitedIds.add(item.id)
    breadcrumbs.unshift(item)

    if (!item.parentId) {
      return breadcrumbs
    }

    item = itemById.get(item.parentId)
    if (!item) {
      return []
    }
  }

  return breadcrumbs
}

export function findNavigationIssues(
  items: NavigationItem[],
): NavigationIssue[] {
  const issues: NavigationIssue[] = []
  const itemById = new Map<string, NavigationItem>()
  const paths = new Set<string>()
  const diagnosedCycleIds = new Set<string>()

  items.forEach((item) => {
    if (paths.has(item.path)) {
      issues.push({ type: 'duplicate-path', path: item.path })
    } else {
      paths.add(item.path)
    }

    if (itemById.has(item.id)) {
      issues.push({ type: 'duplicate-id', itemId: item.id })
      return
    }

    itemById.set(item.id, item)
  })

  items.forEach((item) => {
    if (item.parentId && !itemById.has(item.parentId)) {
      issues.push({
        type: 'missing-parent',
        itemId: item.id,
        parentId: item.parentId,
      })
      return
    }

    const visitedIds = new Set<string>()
    let currentItem: NavigationItem | undefined = item

    while (currentItem?.parentId) {
      if (visitedIds.has(currentItem.id)) {
        const visitedIdList = [...visitedIds]
        const cycleStart = visitedIdList.indexOf(currentItem.id)
        const cycleIds = visitedIdList.slice(cycleStart)

        if (
          !cycleIds.some((cycleId) => diagnosedCycleIds.has(cycleId))
        ) {
          issues.push({ type: 'cycle', itemId: currentItem.id })
          cycleIds.forEach((cycleId) => diagnosedCycleIds.add(cycleId))
        }

        return
      }

      visitedIds.add(currentItem.id)
      currentItem = itemById.get(currentItem.parentId)
    }
  })

  return issues
}
