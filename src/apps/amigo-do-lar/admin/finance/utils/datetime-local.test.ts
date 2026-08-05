import { describe, expect, it, vi } from 'vitest'
import { dateToDatetimeLocal, datetimeLocalToIso } from './datetime-local'

describe('datetime-local utilities', () => {
  it('formata usando os componentes do timezone local, sem deslocamento UTC', () => {
    vi.stubEnv('TZ', 'America/Sao_Paulo')
    expect(dateToDatetimeLocal(new Date('2026-08-05T03:30:00.000Z'))).toBe('2026-08-05T00:30')
    vi.unstubAllEnvs()
  })

  it('converte datetime-local para o instante ISO com o offset local', () => {
    vi.stubEnv('TZ', 'America/Sao_Paulo')
    expect(datetimeLocalToIso('2026-08-05T10:15')).toBe('2026-08-05T13:15:00.000Z')
    expect(() => datetimeLocalToIso('2026-02-30T10:15')).toThrow('Informe uma data e hora válidas.')
    vi.unstubAllEnvs()
  })
})
