import type { NavigationItem } from '../../../domain/navigation/NavigationItem'
import { publishedServiceAreas } from '../data/serviceAreas'
import { services } from '../data/services'

export const navigationItems: NavigationItem[] = [
  { id: 'home', label: 'Início', path: '/', order: 1 },
  {
    id: 'services',
    label: 'Serviços',
    path: '/servicos',
    parentId: 'home',
    order: 1,
  },
  ...services.map((service, index) => ({
    id: `service-${service.slug}`,
    label: service.name,
    path: `/servicos/${service.slug}`,
    parentId: 'services',
    order: index + 1,
    visible: false,
  })),
  {
    id: 'areas',
    label: 'Áreas atendidas',
    path: '/areas-atendidas',
    parentId: 'home',
    order: 2,
  },
  ...publishedServiceAreas.map((area, index) => ({
    id: `area-${area.slug}`,
    label: area.name,
    path: `/areas-atendidas/${area.slug}`,
    parentId: 'areas',
    order: index + 1,
    visible: false,
  })),
  {
    id: 'about',
    label: 'Sobre',
    path: '/sobre',
    parentId: 'home',
    order: 3,
  },
  {
    id: 'contact',
    label: 'Contato',
    path: '/contato',
    parentId: 'home',
    order: 4,
  },
  {
    id: 'faq',
    label: 'Perguntas frequentes',
    path: '/perguntas-frequentes',
    parentId: 'home',
    order: 5,
  },
  {
    id: 'privacy',
    label: 'Política de privacidade',
    path: '/politica-de-privacidade',
    parentId: 'home',
    visible: false,
  },
  {
    id: 'terms',
    label: 'Termos de uso',
    path: '/termos-de-uso',
    parentId: 'home',
    visible: false,
  },
]
