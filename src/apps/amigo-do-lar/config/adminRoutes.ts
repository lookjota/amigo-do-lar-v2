export interface AdminRouteMetadata {
  pathname: string
  title: string
  description: string
  robots: { index: false; follow: false }
  prerender: boolean
}

export const adminRoutes: AdminRouteMetadata[] = [
  {
    pathname: '/admin/login',
    title: 'Acesso administrativo — Amigo do Lar',
    description: 'Acesso restrito ao portal administrativo do Amigo do Lar.',
    robots: { index: false, follow: false },
    prerender: true,
  },
  {
    pathname: '/admin',
    title: 'Administração — Amigo do Lar',
    description: 'Área administrativa restrita do Amigo do Lar.',
    robots: { index: false, follow: false },
    prerender: true,
  },
  {
    pathname: '/admin/solicitacoes',
    title: 'Solicitações — Amigo do Lar',
    description: 'Gestão administrativa de solicitações do Amigo do Lar.',
    robots: { index: false, follow: false },
    prerender: true,
  },
  {
    pathname: '/admin/agenda',
    title: 'Agenda — Amigo do Lar',
    description: 'Gestão administrativa de agendamentos do Amigo do Lar.',
    robots: { index: false, follow: false },
    prerender: true,
  },
  {
    pathname: '/admin/calendario',
    title: 'Calendário — Amigo do Lar',
    description: 'Visualização temporal dos agendamentos do Amigo do Lar.',
    robots: { index: false, follow: false },
    prerender: true,
  },
  {
    pathname: '/admin/servicos',
    title: 'Serviços — Amigo do Lar',
    description: 'Gestão administrativa de serviços do Amigo do Lar.',
    robots: { index: false, follow: false },
    prerender: true,
  },
  {
    pathname: '/admin/financeiro',
    title: 'Financeiro — Amigo do Lar',
    description: 'Gestão administrativa de orçamentos e pagamentos do Amigo do Lar.',
    robots: { index: false, follow: false },
    prerender: true,
  },
  {
    pathname: '/admin/usuarios',
    title: 'Usuários — Amigo do Lar',
    description: 'Gestão administrativa de usuários do Amigo do Lar.',
    robots: { index: false, follow: false },
    prerender: true,
  },
  {
    pathname: '/admin/clientes',
    title: 'Clientes — Amigo do Lar',
    description: 'Gestão administrativa de clientes do Amigo do Lar.',
    robots: { index: false, follow: false },
    prerender: true,
  },
]
