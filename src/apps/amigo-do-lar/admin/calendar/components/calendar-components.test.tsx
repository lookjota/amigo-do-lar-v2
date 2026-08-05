import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { AdminAppointment } from '../../appointments/types/contracts'
import { CalendarEmptyState } from './CalendarEmptyState'
import { CalendarEventCard } from './CalendarEventCard'
import { CalendarToolbar } from './CalendarToolbar'
import { CalendarView } from './CalendarView'

const appointment: AdminAppointment = { id: '1ad575e6-0225-45ce-bb18-296407bc558b', serviceRequestId: '2ad575e6-0225-45ce-bb18-296407bc558b', scheduledAt: new Date(2099, 7, 10, 11).toISOString(), durationMinutes: 90, status: 'CONFIRMED', notes: null, startedAt: null, completedAt: null, cancelledAt: null, createdAt: '2026-08-05T10:00:00.000Z', updatedAt: '2026-08-05T10:00:00.000Z', serviceRequest: { id: '2ad575e6-0225-45ce-bb18-296407bc558b', customerId: '3ad575e6-0225-45ce-bb18-296407bc558b', serviceId: '4ad575e6-0225-45ce-bb18-296407bc558b', description: 'Reparo', status: 'SCHEDULED', preferredDate: null, address: 'Rua A', city: 'Brasília', customer: { id: '3ad575e6-0225-45ce-bb18-296407bc558b', name: 'Cliente Teste', phone: '61999999999', email: null }, service: { id: '4ad575e6-0225-45ce-bb18-296407bc558b', name: 'Elétrica', slug: 'eletrica', category: 'ELECTRICAL' } } }

describe('componentes do calendário', () => {
  it('aciona hoje, navegação e mudança de visão', () => {
    const today = vi.fn(); const navigate = vi.fn(); const changeView = vi.fn()
    render(<CalendarToolbar view="week" title="3 – 9 de agosto" onToday={today} onNavigate={navigate} onView={changeView} />)
    fireEvent.click(screen.getByRole('button', { name: 'Hoje' })); fireEvent.click(screen.getByRole('button', { name: 'Período anterior' })); fireEvent.click(screen.getByRole('button', { name: 'Mês' }))
    expect(today).toHaveBeenCalledOnce(); expect(navigate).toHaveBeenCalledWith(-1); expect(changeView).toHaveBeenCalledWith('month')
    expect(screen.getByRole('button', { name: 'Semana' })).toHaveAttribute('aria-pressed', 'true')
  })
  it('mostra dados reais, status textual e abre detalhes', () => {
    const open = vi.fn(); render(<CalendarEventCard appointment={appointment} onOpen={open} />)
    expect(screen.getByText('Cliente Teste')).toBeInTheDocument(); expect(screen.getByText('Elétrica')).toBeInTheDocument(); expect(screen.getByText('Brasília')).toBeInTheDocument(); expect(screen.getByText('Confirmado')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button')); expect(open).toHaveBeenCalledWith(appointment.id)
  })
  it('renderiza grid semanticamente', () => {
    const date = new Date(2099, 7, 10); render(<CalendarView view="day" focusDate={date} start={date} end={date} appointments={[appointment]} onOpen={vi.fn()} />)
    expect(screen.getByRole('grid', { name: /visão de dia/ })).toBeInTheDocument(); expect(screen.getByRole('gridcell')).toHaveAccessibleName(/agosto/)
  })
  it('mostra o estado vazio explicitamente', () => { render(<CalendarEmptyState />); expect(screen.getByRole('heading', { name: 'Período sem agendamentos' })).toBeInTheDocument() })
})
