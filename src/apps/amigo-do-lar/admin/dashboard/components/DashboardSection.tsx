import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function DashboardSection({ title, to, linkLabel, children }: { title: string; to?: string; linkLabel?: string; children: ReactNode }) {
  return <section className="amigo-dashboard-section"><header><h2>{title}</h2>{to && linkLabel && <Link to={to}>{linkLabel}</Link>}</header>{children}</section>
}

export function DashboardSectionError({ onRetry }: { onRetry: () => void }) {
  return <div className="amigo-admin-state" role="alert"><p>Não foi possível carregar esta seção.</p><button type="button" onClick={onRetry}>Tentar novamente</button></div>
}
