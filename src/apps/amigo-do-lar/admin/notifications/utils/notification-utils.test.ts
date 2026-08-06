import { describe, expect, it } from 'vitest'
import type { Notification } from '../types/contracts'
import { getNotificationMetadataDetails } from './notification-metadata'
import { getNotificationTarget } from './notification-navigation'

const base: Notification = { id: '1ad575e6-0225-45ce-bb18-296407bc558b', type: 'PAYMENT_CREATED', title: 'Pagamento', message: 'Pagamento criado.', resourceType: 'PAYMENT', resourceId: '2ad575e6-0225-45ce-bb18-296407bc558b', metadata: null, readAt: null, createdAt: '2026-08-05T12:00:00.000Z', actor: null }
describe('navegação e metadata de notificações', () => {
  it('não inventa rota de pagamento', () => expect(getNotificationTarget(base)).toBe('/admin/financeiro'))
  it('prefere orçamento válido do metadata', () => expect(getNotificationTarget({ ...base, metadata: { quoteId: '3ad575e6-0225-45ce-bb18-296407bc558b' } })).toBe('/admin/financeiro?quote=3ad575e6-0225-45ce-bb18-296407bc558b'))
  it('usa detalhes já suportados para solicitação e agenda', () => { expect(getNotificationTarget({ ...base, resourceType: 'SERVICE_REQUEST' })).toContain('/admin/solicitacoes?request='); expect(getNotificationTarget({ ...base, resourceType: 'APPOINTMENT' })).toContain('/admin/agenda?appointment=') })
  it('ignora metadata inválido e descreve status válido', () => { expect(getNotificationMetadataDetails('<script>')).toEqual([]); expect(getNotificationMetadataDetails({ previousStatus: 'PENDING', newStatus: 'APPROVED' })).toEqual(['Status: PENDING → APPROVED']) })
})
