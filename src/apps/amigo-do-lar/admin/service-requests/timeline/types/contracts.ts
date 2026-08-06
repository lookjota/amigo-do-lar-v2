import { z } from 'zod'
import { appointmentStatusSchema } from '../../../appointments/types/contracts'
import { paymentStatusSchema, quoteStatusSchema } from '../../../finance/types/contracts'
import { serviceRequestStatusSchema } from '../../types/contracts'

export const timelineEventTypes = [
  'REQUEST_CREATED', 'STATUS_CHANGED', 'COMMENT_ADDED',
  'APPOINTMENT_CREATED', 'APPOINTMENT_RESCHEDULED', 'APPOINTMENT_STATUS_CHANGED',
  'QUOTE_CREATED', 'QUOTE_STATUS_CHANGED', 'PAYMENT_CREATED', 'PAYMENT_STATUS_CHANGED',
] as const
export const timelineEventTypeSchema = z.enum(timelineEventTypes)
export const timelineSortOrderSchema = z.enum(['asc', 'desc'])
export const timelineActorSchema = z.object({
  id: z.uuid(), name: z.string(), email: z.email(), role: z.enum(['ADMIN', 'OPERATOR']),
}).strict()
export const timelinePaginationSchema = z.object({
  page: z.number().int().min(1), limit: z.number().int().min(1).max(100),
  total: z.number().int().nonnegative(), totalPages: z.number().int().nonnegative(),
}).strict()
export const timelineCommentSchema = z.object({ content: z.string().trim().min(1).max(4000) }).strict()
export const timelineFiltersSchema = z.object({
  page: z.number().int().min(1), limit: z.number().int().min(1).max(100),
  type: timelineEventTypeSchema.optional(), sortOrder: timelineSortOrderSchema.default('desc'),
}).strict()

const metadataSchemas = {
  REQUEST_CREATED: z.null(),
  COMMENT_ADDED: z.null(),
  STATUS_CHANGED: z.object({ from: serviceRequestStatusSchema, to: serviceRequestStatusSchema }).strict(),
  APPOINTMENT_CREATED: z.object({ appointmentId: z.uuid(), scheduledAt: z.iso.datetime() }).strict(),
  APPOINTMENT_RESCHEDULED: z.object({ appointmentId: z.uuid(), scheduledAtFrom: z.iso.datetime(), scheduledAtTo: z.iso.datetime() }).strict(),
  APPOINTMENT_STATUS_CHANGED: z.object({ appointmentId: z.uuid(), from: appointmentStatusSchema, to: appointmentStatusSchema }).strict(),
  QUOTE_CREATED: z.object({ quoteId: z.uuid() }).strict(),
  QUOTE_STATUS_CHANGED: z.object({ quoteId: z.uuid(), from: quoteStatusSchema, to: quoteStatusSchema }).strict(),
  PAYMENT_CREATED: z.object({ paymentId: z.uuid(), quoteId: z.uuid() }).strict(),
  PAYMENT_STATUS_CHANGED: z.object({ paymentId: z.uuid(), quoteId: z.uuid(), from: paymentStatusSchema, to: paymentStatusSchema }).strict(),
} satisfies Record<TimelineEventType, z.ZodType>

const rawTimelineEventSchema = z.object({
  id: z.uuid(), serviceRequestId: z.uuid(), type: timelineEventTypeSchema,
  title: z.string(), description: z.string().nullable(), metadata: z.unknown().nullable(),
  createdAt: z.iso.datetime(), actor: timelineActorSchema.nullable(),
}).strict()

export type TimelineEventType = z.infer<typeof timelineEventTypeSchema>
export type TimelineSortOrder = z.infer<typeof timelineSortOrderSchema>
export type TimelineActor = z.infer<typeof timelineActorSchema>
export type TimelineMetadata = z.infer<(typeof metadataSchemas)[TimelineEventType]>
export type TimelineFilters = z.input<typeof timelineFiltersSchema>
export type TimelineComment = z.infer<typeof timelineCommentSchema>

export interface TimelineEvent extends Omit<z.infer<typeof rawTimelineEventSchema>, 'metadata'> {
  metadata: TimelineMetadata | null
  metadataValid: boolean
}

export function parseTimelineEvent(value: unknown): TimelineEvent {
  const event = rawTimelineEventSchema.parse(value)
  const result = metadataSchemas[event.type].safeParse(event.metadata)
  if (!result.success && import.meta.env.DEV) console.warn('Timeline metadata inválido', { eventId: event.id, type: event.type })
  return { ...event, metadata: result.success ? result.data as TimelineMetadata : null, metadataValid: result.success }
}

export const timelineEventSchema = rawTimelineEventSchema.transform((event) => parseTimelineEvent(event))
export const timelineListResponseSchema = z.object({
  data: z.array(z.unknown()), pagination: timelinePaginationSchema,
}).strict().transform(({ data, pagination }) => ({ data: data.map(parseTimelineEvent), pagination }))

export type TimelineListResponse = z.infer<typeof timelineListResponseSchema>
