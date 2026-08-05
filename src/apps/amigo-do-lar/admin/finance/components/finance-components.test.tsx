import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthContext, type AuthContextValue } from '../../../auth/auth-context'
import * as hooks from '../api/finance-hooks'
import type { Quote } from '../types/contracts'
import { QuoteDetails } from './QuoteDetails'

vi.mock('../api/finance-hooks')
const id = '11111111-1111-4111-8111-111111111111'
const quote: Quote = { id, serviceRequestId: id, subtotalCents: 10000, discountCents: 0, totalCents: 10000, description: 'Descrição', notes: null, status: 'DRAFT', validUntil: null, approvedAt: null, rejectedAt: null, cancelledAt: null, createdAt: '2026-08-05T12:00:00.000Z', updatedAt: '2026-08-05T12:00:00.000Z', serviceRequest: { id, status: 'QUOTED', description: 'Teste', customer: { id, name: 'Ana', phone: '61999999999', email: null }, service: { id, name: 'Elétrica', slug: 'eletrica', category: 'Casa' } }, paidTotalCents: 0, remainingCents: 10000, paymentStatus: 'UNPAID' }
const mutation = () => ({ mutateAsync: vi.fn(), isPending: false, isError: false, error: null })

function renderDetails(role: 'ADMIN' | 'OPERATOR', value = quote) {
  const auth: AuthContextValue = { status: 'authenticated', user: { id, name: 'Usuário', email: 'user@example.com', role }, login: vi.fn(), logout: vi.fn() }
  vi.mocked(hooks.useQuote).mockReturnValue({ data: value, isPending: false, isError: false } as never)
  vi.mocked(hooks.usePayments).mockReturnValue({ data: [], isPending: false, isError: false, isSuccess: true } as never)
  vi.mocked(hooks.useUpdateQuote).mockReturnValue(mutation() as never); vi.mocked(hooks.useUpdateQuoteStatus).mockReturnValue(mutation() as never); vi.mocked(hooks.useCreatePayment).mockReturnValue(mutation() as never); vi.mocked(hooks.useUpdatePaymentStatus).mockReturnValue(mutation() as never)
  return render(<AuthContext.Provider value={auth}><MemoryRouter><QuoteDetails id={id} onClose={vi.fn()} /></MemoryRouter></AuthContext.Provider>)
}

describe('finance components RBAC and details', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renderiza detalhes e edição de DRAFT para OPERATOR sem ações administrativas', () => {
    renderDetails('OPERATOR')
    expect(screen.getByRole('dialog', { name: 'Detalhes do orçamento' })).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText('Ana')).toBeInTheDocument(); expect(screen.getByRole('button', { name: 'Editar orçamento' })).toBeInTheDocument(); expect(screen.getByText('Nenhum pagamento registrado.')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Alterar status' })).not.toBeInTheDocument(); expect(screen.queryByRole('button', { name: 'Registrar pagamento' })).not.toBeInTheDocument()
  })

  it('não permite edição fora de DRAFT e mostra pagamento somente para ADMIN com orçamento aprovado', () => {
    renderDetails('ADMIN', { ...quote, status: 'APPROVED' })
    expect(screen.queryByRole('button', { name: 'Editar orçamento' })).not.toBeInTheDocument(); expect(screen.getByRole('button', { name: 'Registrar pagamento' })).toBeInTheDocument(); expect(screen.getByRole('heading', { name: 'Alterar status' })).toBeInTheDocument()
  })
})
