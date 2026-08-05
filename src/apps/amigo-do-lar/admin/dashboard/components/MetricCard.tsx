import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { DashboardMetric } from '../types/contracts'

export function MetricCard({ label, metric, icon: Icon, to }: { label: string; metric: DashboardMetric; icon: LucideIcon; to: string }) {
  return (
    <article className="amigo-dashboard-metric">
      <div className="amigo-dashboard-metric-heading"><Icon aria-hidden="true" size={20} /><h2>{label}</h2></div>
      {metric.availability === 'available' && metric.value === undefined && <span className="amigo-dashboard-skeleton" aria-label={`Carregando ${label}`} />}
      {metric.availability === 'available' && metric.value !== undefined && <strong>{metric.value.toLocaleString('pt-BR')}</strong>}
      {metric.availability === 'error' && <p role="status">Indicador indisponível</p>}
      {metric.availability === 'unavailable-contract' && <p>Não fornecido pela API</p>}
      {metric.availability === 'unavailable-permission' && <p>Sem permissão</p>}
      <Link to={to}>Abrir módulo</Link>
    </article>
  )
}
