import { describe, expect, it } from 'vitest'
import { centsToCurrency, centsToInputValue, currencyInputToCents } from './money'

describe('finance money utilities', () => {
  it('formats integer cents in BRL', () => { expect(centsToCurrency(0)).toContain('0,00'); expect(centsToCurrency(1)).toContain('0,01'); expect(centsToCurrency(123456)).toContain('1.234,56'); expect(centsToInputValue(123456)).toBe('1.234,56') })
  it.each([['100', 10000], ['100,00', 10000], ['1.234,56', 123456], ['0,01', 1], ['10,9', 1090]])('parses %s without floating point', (input, expected) => expect(currencyInputToCents(input)).toBe(expected))
  it.each(['', '-10', '10,999', 'texto', '1.23', '10.00,00', '999999999999999999999999'])('rejects invalid input %s', (input) => expect(() => currencyInputToCents(input)).toThrow())
})
