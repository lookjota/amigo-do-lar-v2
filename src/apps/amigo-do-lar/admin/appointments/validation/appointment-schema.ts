import { z } from 'zod'

export const appointmentFormSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Informe uma data válida.'),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Informe um horário válido.'),
  durationMinutes: z.coerce.number().int().min(15, 'A duração mínima é 15 minutos.').max(480, 'A duração máxima é 480 minutos.'),
  notes: z.string().max(4000, 'As observações devem ter no máximo 4.000 caracteres.'),
})

export type AppointmentFormValues = z.input<typeof appointmentFormSchema>

export function localDateTimeToIso(date: string, time: string): string | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return undefined
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  const value = new Date(year, month - 1, day, hour, minute, 0, 0)
  if (value.getFullYear() !== year || value.getMonth() !== month - 1 || value.getDate() !== day || value.getHours() !== hour || value.getMinutes() !== minute) return undefined
  return value.toISOString()
}

export function isoToLocalFormParts(value: string) {
  const date = new Date(value)
  const pad = (part: number) => String(part).padStart(2, '0')
  return { date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`, time: `${pad(date.getHours())}:${pad(date.getMinutes())}` }
}
