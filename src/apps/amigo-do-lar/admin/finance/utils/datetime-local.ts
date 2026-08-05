function pad(value: number) { return String(value).padStart(2, '0') }

export function dateToDatetimeLocal(date: Date): string {
  if (Number.isNaN(date.getTime())) throw new RangeError('Data inválida.')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function datetimeLocalToIso(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) throw new RangeError('Informe uma data e hora válidas.')
  const date = new Date(value)
  if (Number.isNaN(date.getTime()) || dateToDatetimeLocal(date) !== value) throw new RangeError('Informe uma data e hora válidas.')
  return date.toISOString()
}
