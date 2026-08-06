import { describe, expect, it, vi } from 'vitest'
import { parseTimelineEvent } from '../types/contracts'
import { timelineMetadataDescription, timelineRelatedLink } from './timeline-metadata'

const base = { id: '2ad575e6-0225-45ce-bb18-296407bc558b', serviceRequestId: '1ad575e6-0225-45ce-bb18-296407bc558b', title: 'Evento', description: null, createdAt: '2026-08-05T12:00:00.000Z', actor: null }
describe('metadata semântico', () => {
  it('traduz mudança de status', () => expect(timelineMetadataDescription(parseTimelineEvent({ ...base, type: 'STATUS_CHANGED', metadata: { from: 'PENDING', to: 'CONTACTED' } }))).toBe('Pendente → Contatado'))
  it('formata reagendamento e cria link real', () => { const event = parseTimelineEvent({ ...base, type: 'APPOINTMENT_RESCHEDULED', metadata: { appointmentId: '3ad575e6-0225-45ce-bb18-296407bc558b', scheduledAtFrom: '2026-08-06T17:00:00.000Z', scheduledAtTo: '2026-08-07T12:00:00.000Z' } }); expect(timelineMetadataDescription(event)).toContain('para'); expect(timelineRelatedLink(event)?.to).toContain('/admin/agenda?appointment=') })
  it('não expõe metadata inválido', () => { const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined); try { const event = parseTimelineEvent({ ...base, type: 'PAYMENT_STATUS_CHANGED', metadata: { raw: '<script>' } }); expect(timelineMetadataDescription(event)).toBeNull(); expect(timelineRelatedLink(event)).toBeNull(); if (import.meta.env.DEV) expect(warn).toHaveBeenCalledWith('Timeline metadata inválido', { eventId: base.id, type: 'PAYMENT_STATUS_CHANGED' }); else expect(warn).not.toHaveBeenCalled() } finally { warn.mockRestore() } })
})
