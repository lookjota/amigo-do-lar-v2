import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ServiceRequestFilters } from './ServiceRequestFilters'

describe('ServiceRequestFilters', () => {
  it('aplica somente valores suportados e permite limpar', () => {
    const onApply = vi.fn()
    const onClear = vi.fn()
    render(<ServiceRequestFilters values={{}} onApply={onApply} onClear={onClear} />)
    fireEvent.change(screen.getByLabelText('Buscar'), { target: { value: '  tomada  ' } })
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'PENDING' } })
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar filtros' }))
    expect(onApply).toHaveBeenCalledWith({ search: 'tomada', status: 'PENDING', createdFrom: undefined, createdTo: undefined })
    fireEvent.click(screen.getByRole('button', { name: 'Limpar' }))
    expect(onClear).toHaveBeenCalledOnce()
  })
})
