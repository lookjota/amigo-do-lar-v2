import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { AdminServiceRequest } from '../types/contracts'
import { Pagination } from './Pagination'
import { ServiceRequestStatusBadge } from './ServiceRequestStatusBadge'
import { ServiceRequestsTable } from './ServiceRequestsTable'

const request: AdminServiceRequest = {
  id: '1ad575e6-0225-45ce-bb18-296407bc558b', customerId: '2ad575e6-0225-45ce-bb18-296407bc558b', serviceId: '3ad575e6-0225-45ce-bb18-296407bc558b',
  description: 'Reparo elétrico residencial.', status: 'PENDING', preferredDate: null,
  address: 'Rua A', city: 'Brasília', internalNotes: null, completedAt: null, cancelledAt: null,
  createdAt: '2026-08-04T12:00:00.000Z', updatedAt: '2026-08-04T12:00:00.000Z',
  customer: { id: '2ad575e6-0225-45ce-bb18-296407bc558b', name: 'João', phone: '61999999999', email: null, isActive: true },
  service: { id: '3ad575e6-0225-45ce-bb18-296407bc558b', name: 'Elétrica', slug: 'eletrica', category: 'ELECTRICAL', isActive: true },
}

describe('componentes da lista administrativa', () => {
  it('renderiza tabela semântica e abre detalhes', () => {
    const onDetails = vi.fn()
    render(<ServiceRequestsTable requests={[request]} onDetails={onDetails} />)
    expect(screen.getByRole('table', { name: 'Solicitações de atendimento' })).toBeInTheDocument()
    expect(screen.getByText('João')).toBeInTheDocument()
    expect(screen.getByText('Elétrica')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /ver detalhes/i }))
    expect(onDetails).toHaveBeenCalledWith(request.id)
  })

  it('traduz o status', () => {
    render(<ServiceRequestStatusBadge status="IN_PROGRESS" />)
    expect(screen.getByText('Em andamento')).toBeInTheDocument()
  })

  it('impede páginas inválidas nos controles', () => {
    const onChange = vi.fn()
    render(<Pagination page={1} totalPages={3} onChange={onChange} />)
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Próxima' }))
    expect(onChange).toHaveBeenCalledWith(2)
  })
})
