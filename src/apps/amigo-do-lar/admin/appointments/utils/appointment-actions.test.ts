import { describe, expect, it } from 'vitest'
import { canCancelAppointment, canEditAppointment } from './appointment-actions'

describe('ações permitidas de agendamento', () => {
  it.each(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'] as const)('permite editar e cancelar %s', (status) => { expect(canEditAppointment(status)).toBe(true); expect(canCancelAppointment(status)).toBe(true) })
  it.each(['COMPLETED', 'CANCELLED'] as const)('oculta ações operacionais em %s', (status) => { expect(canEditAppointment(status)).toBe(false); expect(canCancelAppointment(status)).toBe(false) })
})
