import { screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../test/render'
import { setAnalyticsProvider } from '../analytics/analytics'
import * as serviceRequestsApi from '../api/service-requests-api'
import * as servicesApi from '../api/services-api'
import { ServiceRequestForm } from './ServiceRequestForm'

const apiService = {
  id: 'aa9a8c21-32fb-47ba-aef3-03ef668d727b',
  name: 'Elétrica',
  slug: 'eletrica',
  description: 'Reparos elétricos residenciais.',
  category: 'ELECTRICAL',
  isActive: true,
  createdAt: '2026-08-04T12:00:00.000Z',
  updatedAt: '2026-08-04T12:00:00.000Z',
}

const response: serviceRequestsApi.CreateServiceRequestResponse = {
  id: '1ad575e6-0225-45ce-bb18-296407bc558b',
  customerId: '2ad575e6-0225-45ce-bb18-296407bc558b',
  serviceId: apiService.id,
  description: 'Tomada com falha no quarto.',
  status: 'PENDING',
  preferredDate: null,
  address: 'SQN 100 — Asa Sul',
  city: 'Brasília',
  completedAt: null,
  cancelledAt: null,
  createdAt: '2026-08-04T12:00:00.000Z',
  updatedAt: '2026-08-04T12:00:00.000Z',
}

beforeEach(() => {
  vi.restoreAllMocks()
  vi.spyOn(servicesApi, 'getServices').mockResolvedValue([])
})

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

  it('emite start, submit e success somente após a confirmação da API', async () => {
    const user = userEvent.setup()
    const provider = vi.fn()
    const restoreProvider = setAnalyticsProvider(provider)
    vi.mocked(servicesApi.getServices).mockResolvedValue([apiService])
    const create = vi.spyOn(serviceRequestsApi, 'createServiceRequest').mockResolvedValue(response)
    renderWithProviders(<ServiceRequestForm />, { route: '/solicitar-atendimento?servico=eletrica' })

    await user.type(screen.getByLabelText('Nome completo'), 'Pessoa Teste')
    await user.type(screen.getByLabelText('Telefone'), '61999999999')
    await user.selectOptions(screen.getByLabelText('Região'), 'asa-sul')
    await user.type(screen.getByLabelText('Endereço do atendimento'), 'SQN 100')
    await user.type(screen.getByLabelText('Descreva o que precisa ser feito'), 'Tomada com falha no quarto.')
    await user.click(screen.getByRole('button', { name: 'Enviar solicitação' }))

    await waitFor(() => expect(create).toHaveBeenCalledOnce())
    expect(provider.mock.calls.map(([event]) => event)).toEqual([
      'request_form_start',
      'request_form_submit',
      'request_form_success',
    ])
    expect(provider.mock.calls[1][1]).toMatchObject({
      source_path: '/solicitar-atendimento',
      service_slug: 'eletrica',
      region_slug: 'asa-sul',
      offer_context: 'standard',
    })
    expect(JSON.stringify(provider.mock.calls)).not.toContain('Pessoa Teste')
    expect(JSON.stringify(provider.mock.calls)).not.toContain('61999999999')
    restoreProvider()
  })

  it('emite error após falha real, preserva os dados e permite nova tentativa', async () => {
    const user = userEvent.setup()
    const provider = vi.fn()
    const restoreProvider = setAnalyticsProvider(provider)
    vi.mocked(servicesApi.getServices).mockResolvedValue([apiService])
    const create = vi.spyOn(serviceRequestsApi, 'createServiceRequest').mockRejectedValue(new Error('offline'))
    renderWithProviders(<ServiceRequestForm />, { route: '/solicitar-atendimento?servico=eletrica' })

    const name = screen.getByLabelText('Nome completo')
    await user.type(name, 'Pessoa Teste')
    await user.type(screen.getByLabelText('Telefone'), '61999999999')
    await user.selectOptions(screen.getByLabelText('Serviço'), 'eletrica')
    await user.selectOptions(screen.getByLabelText('Região'), 'asa-sul')
    await user.type(screen.getByLabelText('Endereço do atendimento'), 'SQN 100')
    await user.type(screen.getByLabelText('Descreva o que precisa ser feito'), 'Tomada com falha no quarto.')
    await user.click(screen.getByRole('button', { name: 'Enviar solicitação' }))

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(name).toHaveValue('Pessoa Teste')
    expect(create).toHaveBeenCalledOnce()
    expect(provider.mock.calls.map(([event]) => event)).toEqual([
      'request_form_start',
      'request_form_submit',
      'request_form_error',
    ])
    fireEvent.submit(screen.getByRole('button', { name: 'Enviar solicitação' }).closest('form')!)
    expect(create).toHaveBeenCalledTimes(2)
    restoreProvider()
  })
})
