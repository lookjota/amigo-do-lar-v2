import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../test/render'
import * as servicesApi from '../api/services-api'
import { ServiceRequestForm } from './ServiceRequestForm'

beforeEach(() => { vi.restoreAllMocks(); vi.spyOn(servicesApi, 'getServices').mockResolvedValue([]) })

describe('ServiceRequestForm', () => {
  it('renderiza fallback e aplica pré-seleção válida', async () => {
    renderWithProviders(<ServiceRequestForm />, { route: '/solicitar-atendimento?servico=eletrica' })
    expect(screen.getByLabelText('Nome completo')).toHaveAttribute('autocomplete', 'name')
    await waitFor(() => expect(screen.getByLabelText('Serviço')).toHaveValue('eletrica'))
    expect(screen.getByRole('option', { name: 'Hidráulica' })).toBeInTheDocument()
  })

  it('ignora slug inválido, valida e foca o primeiro campo', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ServiceRequestForm />, { route: '/solicitar-atendimento?servico=inexistente' })
    expect(screen.getByLabelText('Serviço')).toHaveValue('')
    await user.click(screen.getByRole('button', { name: 'Enviar solicitação' }))
    expect(screen.getByRole('textbox', { name: /Nome completo/ })).toHaveFocus()
    expect(screen.getByText('Informe seu nome completo.')).toBeInTheDocument()
  })
})
