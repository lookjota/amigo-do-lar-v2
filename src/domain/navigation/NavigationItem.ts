export interface NavigationItem {
  id: string
  label: string
  path: string
  parentId?: string
  order?: number
  visible?: boolean
}
