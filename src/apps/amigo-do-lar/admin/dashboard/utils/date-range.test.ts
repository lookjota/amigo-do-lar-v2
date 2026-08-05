import { describe, expect, it } from 'vitest'
import { getLocalDayRange } from './date-range'

describe('getLocalDayRange', () => {
  it('gera os limites do dia local sem depender de comparação textual', () => {
    const reference = new Date(2026, 7, 5, 14, 37, 22, 500)
    const range = getLocalDayRange(reference)
    const from = new Date(range.from)
    const to = new Date(range.to)

    expect([from.getHours(), from.getMinutes(), from.getSeconds(), from.getMilliseconds()]).toEqual([0, 0, 0, 0])
    expect([to.getHours(), to.getMinutes(), to.getSeconds(), to.getMilliseconds()]).toEqual([23, 59, 59, 999])
    expect(to.getDate()).toBe(reference.getDate())
  })

  it('preserva o dia correto na virada do mês', () => {
    const range = getLocalDayRange(new Date(2026, 7, 1, 0, 0, 0))
    expect(new Date(range.from).getDate()).toBe(1)
    expect(new Date(range.to).getDate()).toBe(1)
  })
})
