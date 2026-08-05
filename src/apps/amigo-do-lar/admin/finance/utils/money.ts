const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
export function centsToCurrency(cents: number) {
  if (!Number.isSafeInteger(cents)) throw new RangeError('O valor em centavos deve ser um inteiro seguro.')
  return formatter.format(cents / 100)
}
export function centsToInputValue(cents: number) {
  if (!Number.isSafeInteger(cents) || cents < 0) throw new RangeError('Valor em centavos inválido.')
  const integer = Math.floor(cents / 100).toLocaleString('pt-BR')
  return `${integer},${String(cents % 100).padStart(2, '0')}`
}
export function currencyInputToCents(raw: string) {
  const value = raw.trim()
  if (!value || value.startsWith('-') || !/^(?:0|[1-9]\d{0,2}(?:\.\d{3})*|[1-9]\d*)(?:,\d{1,2})?$/.test(value)) throw new RangeError('Informe um valor válido, com no máximo duas casas decimais.')
  const [whole, fraction = ''] = value.replaceAll('.', '').split(',')
  const cents = Number(`${whole}${fraction.padEnd(2, '0')}`)
  if (!Number.isSafeInteger(cents) || cents < 0) throw new RangeError('O valor informado é muito alto.')
  return cents
}
