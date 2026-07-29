import type { NavigationItem } from '../../../domain/navigation/NavigationItem'

export const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Início',
    path: '/',
    order: 1,
  },
  {
    id: 'architecture',
    label: 'Arquitetura',
    path: '/architecture',
    parentId: 'home',
    order: 1,
  },
]
