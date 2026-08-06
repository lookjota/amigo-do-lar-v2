import { z } from 'zod'

const metadataSchema = z.object({ previousStatus: z.string().optional(), newStatus: z.string().optional(), scheduledAt: z.iso.datetime().optional(), previousScheduledAt: z.iso.datetime().optional(), quoteId: z.uuid().optional(), paymentId: z.uuid().optional() }).loose()
export function getNotificationMetadataDetails(metadata: unknown): string[] {
  const parsed = metadataSchema.safeParse(metadata)
  if (!parsed.success) return []
  const details: string[] = []
  if (parsed.data.previousStatus && parsed.data.newStatus) details.push(`Status: ${parsed.data.previousStatus} → ${parsed.data.newStatus}`)
  if (parsed.data.previousScheduledAt && parsed.data.scheduledAt) details.push(`Reagendado de ${new Date(parsed.data.previousScheduledAt).toLocaleString('pt-BR')} para ${new Date(parsed.data.scheduledAt).toLocaleString('pt-BR')}`)
  else if (parsed.data.scheduledAt) details.push(`Agendamento: ${new Date(parsed.data.scheduledAt).toLocaleString('pt-BR')}`)
  return details
}
