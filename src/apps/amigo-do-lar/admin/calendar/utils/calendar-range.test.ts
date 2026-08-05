import { describe, expect, it } from 'vitest'
import { formatLocalDate, getCalendarRange, navigateCalendar, parseLocalDate } from './calendar-range'

describe('intervalos locais do calendário', () => {
  it('calcula o dia no timezone local', () => {
    const range = getCalendarRange(new Date(2026, 7, 5, 12), 'day')
    expect(new Date(range.from).getHours()).toBe(0)
    expect(new Date(range.to).getHours()).toBe(23)
    expect(new Date(range.to).getMilliseconds()).toBe(999)
  })
  it('calcula semana de segunda a domingo em virada de mês', () => {
    const range = getCalendarRange(new Date(2026, 7, 1), 'week')
    expect(formatLocalDate(range.start)).toBe('2026-07-27')
    expect(formatLocalDate(range.end)).toBe('2026-08-02')
  })
  it('inclui semanas completas do mês e a virada de ano', () => {
    const range = getCalendarRange(new Date(2026, 11, 15), 'month')
    expect(formatLocalDate(range.start)).toBe('2026-11-30')
    expect(formatLocalDate(range.end)).toBe('2027-01-03')
  })
  it('ignora datas inválidas e preserva válidas', () => {
    const fallback = new Date(2026, 7, 5)
    expect(formatLocalDate(parseLocalDate('2026-02-30', fallback))).toBe('2026-08-05')
    expect(formatLocalDate(parseLocalDate('2026-12-31', fallback))).toBe('2026-12-31')
  })
  it('navega por unidade da visualização', () => {
    const date = new Date(2026, 11, 31)
    expect(formatLocalDate(navigateCalendar(date, 'day', 1))).toBe('2027-01-01')
    expect(formatLocalDate(navigateCalendar(date, 'week', -1))).toBe('2026-12-24')
    expect(formatLocalDate(navigateCalendar(date, 'month', 1))).toBe('2027-01-01')
  })
})
