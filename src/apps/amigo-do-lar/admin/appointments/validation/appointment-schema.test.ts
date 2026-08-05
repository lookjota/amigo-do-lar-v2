import { describe, expect, it, vi } from 'vitest'
import { isoToLocalFormParts, localDateTimeToIso } from './appointment-schema'

describe('serialização de data e timezone', () => {
  it('envia ISO UTC correspondente ao horário local sem ambiguidade', () => { vi.stubEnv('TZ', 'America/Sao_Paulo'); expect(localDateTimeToIso('2026-08-10', '14:30')).toBe('2026-08-10T17:30:00.000Z'); vi.unstubAllEnvs() })
  it('faz round-trip do ISO para os campos locais', () => { vi.stubEnv('TZ', 'America/Sao_Paulo'); expect(isoToLocalFormParts('2026-08-10T17:30:00.000Z')).toEqual({ date: '2026-08-10', time: '14:30' }); vi.unstubAllEnvs() })
  it('rejeita data inexistente', () => expect(localDateTimeToIso('2026-02-30', '10:00')).toBeUndefined())
})
