import { fireEvent, render, screen } from '@testing-library/react'
import { Gauge } from 'lucide-react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { DashboardSectionError } from './DashboardSection'
import { MetricCard } from './MetricCard'
import { QuickActions } from './QuickActions'
import { RecentServiceRequests } from './RecentServiceRequests'
import { UpcomingAppointments } from './UpcomingAppointments'

describe('componentes do dashboard', () => {
  it('renderiza valor real, loading e erro sem substituir por zero', () => {
    const { rerender } = render(<MemoryRouter><MetricCard label="Pendentes" metric={{ availability: 'available', value: 12 }} icon={Gauge} to="/admin/solicitacoes" /></MemoryRouter>)
    expect(screen.getByText('12')).toBeInTheDocument()
    rerender(<MemoryRouter><MetricCard label="Pendentes" metric={{ availability: 'available' }} icon={Gauge} to="/admin/solicitacoes" /></MemoryRouter>)
    expect(screen.getByLabelText('Carregando Pendentes')).toBeInTheDocument()
    rerender(<MemoryRouter><MetricCard label="Pendentes" metric={{ availability: 'error', error: new Error('secret') }} icon={Gauge} to="/admin/solicitacoes" /></MemoryRouter>)
    expect(screen.getByText('Indicador indisponível')).toBeInTheDocument()
    expect(screen.queryByText('0')).not.toBeInTheDocument()
    expect(screen.queryByText('secret')).not.toBeInTheDocument()
  })

  it('aplica RBAC nas ações rápidas e mantém links reais', () => {
    const { rerender } = render(<MemoryRouter><QuickActions isAdmin={false} /></MemoryRouter>)
    expect(screen.getByRole('link', { name: /ver solicitações/i })).toHaveAttribute('href', '/admin/solicitacoes')
    expect(screen.getByRole('link', { name: /novo cliente/i })).toHaveAttribute('href', '/admin/clientes?create=1')
    expect(screen.queryByRole('link', { name: /gerenciar usuários/i })).not.toBeInTheDocument()
    rerender(<MemoryRouter><QuickActions isAdmin /></MemoryRouter>)
    expect(screen.getByRole('link', { name: /gerenciar usuários/i })).toHaveAttribute('href', '/admin/usuarios')
    expect(screen.getByRole('link', { name: /novo serviço/i })).toHaveAttribute('href', '/admin/servicos?create=1')
  })

  it('exibe empty states e retry seguro por seção', () => {
    const retry = vi.fn()
    render(<MemoryRouter><RecentServiceRequests requests={[]} /><UpcomingAppointments appointments={[]} /><DashboardSectionError onRetry={retry} /></MemoryRouter>)
    expect(screen.getByText('Nenhuma solicitação encontrada.')).toBeInTheDocument()
    expect(screen.getByText('Nenhum próximo agendamento encontrado.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /tentar novamente/i }))
    expect(retry).toHaveBeenCalledOnce()
  })
})
