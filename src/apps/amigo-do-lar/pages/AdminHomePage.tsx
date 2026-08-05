import { CalendarCheck, ClipboardClock, Clock3, Settings, UserCheck, Users, UserRound } from 'lucide-react'
import { useDashboardSummary } from '../admin/dashboard/api/useDashboardSummary'
import { DashboardSection, DashboardSectionError } from '../admin/dashboard/components/DashboardSection'
import { MetricCard } from '../admin/dashboard/components/MetricCard'
import { QuickActions } from '../admin/dashboard/components/QuickActions'
import { RecentServiceRequests } from '../admin/dashboard/components/RecentServiceRequests'
import { UpcomingAppointments } from '../admin/dashboard/components/UpcomingAppointments'
import { hasRole } from '../auth/authorization'
import { useAuth } from '../auth/useAuth'
import { AdminPageMetadata } from '../components/AdminPageMetadata'

export function AdminHomePage() {
  const auth = useAuth()
  if (!auth.user) return null

  return <AuthenticatedAdminHomePage user={auth.user} />
}

function AuthenticatedAdminHomePage({ user }: { user: NonNullable<ReturnType<typeof useAuth>['user']> }) {
  const dashboard = useDashboardSummary(user)
  const { summary } = dashboard
  const isAdmin = hasRole(user, ['ADMIN'])
  const metrics = [
    { label: 'Solicitações pendentes', metric: summary.pendingServiceRequests, icon: ClipboardClock, to: '/admin/solicitacoes?status=PENDING' },
    { label: 'Em andamento', metric: summary.inProgressServiceRequests, icon: Clock3, to: '/admin/solicitacoes?status=IN_PROGRESS' },
    { label: 'Solicitações hoje', metric: summary.serviceRequestsCreatedToday, icon: ClipboardClock, to: '/admin/solicitacoes' },
    { label: 'Agendamentos hoje', metric: summary.appointmentsToday, icon: CalendarCheck, to: '/admin/agenda' },
    { label: 'Total de clientes', metric: summary.totalCustomers, icon: UserRound, to: '/admin/clientes' },
    { label: 'Clientes ativos', metric: summary.activeCustomers, icon: UserCheck, to: '/admin/clientes?isActive=true' },
    { label: 'Serviços ativos', metric: summary.activeServices, icon: Settings, to: '/admin/servicos?isActive=true' },
    ...(isAdmin ? [{ label: 'Usuários ativos', metric: summary.activeUsers, icon: Users, to: '/admin/usuarios?isActive=true' }] : []),
  ]
  const hasMetricError = metrics.some(({ metric }) => metric.availability === 'error')

  return (
    <main id="conteudo-principal" className="amigo-admin-page amigo-dashboard-page">
      <AdminPageMetadata title="Administração — Amigo do Lar" />
      <header className="amigo-admin-header">
        <div>
          <p className="amigo-eyebrow">Portal administrativo</p>
          <h1>Olá, {user.name}</h1>
          <p>Visão operacional · {user.role === 'ADMIN' ? 'Administrador' : 'Operador'}</p>
        </div>
      </header>

      <section aria-labelledby="dashboard-metrics-title">
        <div className="amigo-dashboard-section-title"><h2 id="dashboard-metrics-title">Indicadores operacionais</h2>{hasMetricError && <button type="button" onClick={() => void dashboard.retryMetrics()}>Tentar novamente</button>}</div>
        <div className="amigo-dashboard-metrics">{metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}</div>
      </section>

      <div className="amigo-dashboard-columns">
        <DashboardSection title="Solicitações recentes" to="/admin/solicitacoes" linkLabel="Ver todas">
          {summary.recentServiceRequests.availability === 'error' ? <DashboardSectionError onRetry={() => void dashboard.retryRecentServiceRequests()} /> : dashboard.isPending && summary.recentServiceRequests.items.length === 0 ? <p role="status">Carregando solicitações…</p> : <RecentServiceRequests requests={summary.recentServiceRequests.items} />}
        </DashboardSection>
        <DashboardSection title="Próximos agendamentos" to="/admin/agenda" linkLabel="Ver agenda">
          {summary.upcomingAppointments.availability === 'error' ? <DashboardSectionError onRetry={() => void dashboard.retryUpcomingAppointments()} /> : dashboard.isPending && summary.upcomingAppointments.items.length === 0 ? <p role="status">Carregando agendamentos…</p> : <UpcomingAppointments appointments={summary.upcomingAppointments.items} />}
        </DashboardSection>
      </div>

      <DashboardSection title="Ações rápidas"><QuickActions isAdmin={isAdmin} /></DashboardSection>
    </main>
  )
}
