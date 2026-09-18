import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  getAnalyticsContext,
  setAnalyticsProvider,
  trackEvent,
} from './analytics'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('measurement foundation', () => {
  it('deriva contexto seguro para serviço, região e Lista da Casa', () => {
    expect(getAnalyticsContext('/servicos/eletrica', 'header')).toEqual({
      source_path: '/servicos/eletrica',
      service_slug: 'eletrica',
      offer_context: 'standard',
      origin: 'header',
    })
    expect(getAnalyticsContext('/areas-atendidas/asa-sul', 'sticky_mobile')).toEqual({
      source_path: '/areas-atendidas/asa-sul',
      region_slug: 'asa-sul',
      offer_context: 'standard',
      origin: 'sticky_mobile',
    })
    expect(getAnalyticsContext('/lista-da-casa')).toEqual({
      source_path: '/lista-da-casa',
      offer_context: 'lista_da_casa',
    })
  })

  it('entrega somente payload permitido e nunca envia PII', () => {
    const provider = vi.fn()
    const restore = setAnalyticsProvider(provider)

    trackEvent('request_form_submit', {
      source_path: '/solicitar-atendimento',
      service_slug: 'eletrica',
      region_slug: 'asa-sul',
      offer_context: 'standard',
      customerName: 'Pessoa Teste',
      phone: '61999999999',
      description: 'conteúdo privado',
    } as never)

    expect(provider).toHaveBeenCalledWith('request_form_submit', {
      source_path: '/solicitar-atendimento',
      service_slug: 'eletrica',
      region_slug: 'asa-sul',
      offer_context: 'standard',
    })
    expect(JSON.stringify(provider.mock.calls)).not.toContain('Pessoa Teste')
    expect(JSON.stringify(provider.mock.calls)).not.toContain('61999999999')
    expect(JSON.stringify(provider.mock.calls)).not.toContain('conteúdo privado')
    restore()
  })

  it('não bloqueia a ação quando não há provider ou o provider falha', () => {
    const restore = setAnalyticsProvider(undefined)
    expect(() => trackEvent('whatsapp_click', getAnalyticsContext('/lista-da-casa'))).not.toThrow()
    restore()

    const restoreFailing = setAnalyticsProvider(() => { throw new Error('provider offline') })
    expect(() => trackEvent('request_form_error', { source_path: '/solicitar-atendimento' })).not.toThrow()
    restoreFailing()
  })
})
