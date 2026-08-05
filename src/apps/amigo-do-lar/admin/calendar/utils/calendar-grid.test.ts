import { describe, expect, it } from 'vitest'
import type { AdminAppointment } from '../../appointments/types/contracts'
import { getCalendarDays, groupAppointmentsByLocalDay } from './calendar-grid'
import { formatLocalDate } from './calendar-range'

const appointment = { scheduledAt: new Date(2026, 7, 5, 9).toISOString() } as AdminAppointment
describe('grid do calendário', () => {
  it('gera todos os dias inclusivamente', () => expect(getCalendarDays(new Date(2026, 7, 3), new Date(2026, 7, 9))).toHaveLength(7))
  it('agrupa pelo dia local sem comparar ISO como texto', () => expect(groupAppointmentsByLocalDay([appointment]).get(formatLocalDate(new Date(2026, 7, 5)))).toEqual([appointment]))
})
