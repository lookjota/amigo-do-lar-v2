import { describe, expect, it } from 'vitest'
import { getWhatsAppMessage } from './whatsapp'

describe('mensagens contextuais do WhatsApp', () => {
  it.each([
    ['/', 'Vim pelo site do Amigo do Lar'],
    ['/servicos/eletrica', 'Vim pela página de Elétrica'],
    ['/areas-atendidas/aguas-claras', 'Vim pela página de Águas Claras'],
    ['/servicos', 'Vim pela página de Serviços'],
  ])('deriva a origem para %s', (pathname, expected) => {
    expect(getWhatsAppMessage(pathname)).toContain(expected)
  })
})
