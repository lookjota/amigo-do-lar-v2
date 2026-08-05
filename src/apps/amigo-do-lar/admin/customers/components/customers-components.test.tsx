import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CustomerFilters } from './CustomerFilters'
import { CustomerForm } from './CustomerForm'
import { CustomersTable } from './CustomersTable'

const customer = { id: '1ad575e6-0225-45ce-bb18-296407bc558b', name: 'João', phone: '61999999999', email: null, isActive: false, createdAt: '2026-08-05T10:00:00.000Z', updatedAt: '2026-08-05T10:00:00.000Z' }
describe('customer admin components', () => {
  it('renderiza tabela, telefone, vazio de e-mail, status e detalhes', () => { const details = vi.fn(); render(<CustomersTable customers={[customer]} onDetails={details} />); expect(screen.getByText('(61) 99999-9999')).toBeInTheDocument(); expect(screen.getByText('Não informado')).toBeInTheDocument(); expect(screen.getByText('Inativo')).toBeInTheDocument(); fireEvent.click(screen.getByRole('button', { name: 'Ver detalhes de João' })); expect(details).toHaveBeenCalledWith(customer.id) })
  it('aplica e limpa apenas filtros reais', () => { const apply = vi.fn(); const clear = vi.fn(); render(<CustomerFilters values={{ sortBy: 'name', sortOrder: 'asc' }} onApply={apply} onClear={clear} />); fireEvent.change(screen.getByLabelText('Buscar'), { target: { value: ' João ' } }); fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'false' } }); fireEvent.click(screen.getByRole('button', { name: 'Aplicar filtros' })); expect(apply).toHaveBeenCalledWith({ search: 'João', isActive: false, sortBy: 'name', sortOrder: 'asc' }); fireEvent.click(screen.getByRole('button', { name: 'Limpar' })); expect(clear).toHaveBeenCalledOnce() })
  it('valida telefone e bloqueia submissão pendente', () => { const submit = vi.fn(); const { rerender } = render(<CustomerForm isPending={false} onSubmit={submit} />); fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Cliente' } }); fireEvent.change(screen.getByLabelText('Telefone'), { target: { value: '123' } }); fireEvent.click(screen.getByRole('button', { name: 'Criar cliente' })); expect(screen.getByRole('alert')).toHaveTextContent('10 ou 11 dígitos'); expect(submit).not.toHaveBeenCalled(); rerender(<CustomerForm isPending onSubmit={submit} />); expect(screen.getByRole('button', { name: 'Salvando…' })).toBeDisabled() })
})
