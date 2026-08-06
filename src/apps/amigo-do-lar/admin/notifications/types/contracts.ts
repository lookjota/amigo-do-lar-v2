import { z } from 'zod'

export const notificationTypes = ['SERVICE_REQUEST_CREATED', 'SERVICE_REQUEST_STATUS_CHANGED', 'COMMENT_ADDED', 'APPOINTMENT_CREATED', 'APPOINTMENT_RESCHEDULED', 'APPOINTMENT_STATUS_CHANGED', 'QUOTE_CREATED', 'QUOTE_STATUS_CHANGED', 'PAYMENT_CREATED', 'PAYMENT_STATUS_CHANGED'] as const
export const notificationResourceTypes = ['SERVICE_REQUEST', 'APPOINTMENT', 'QUOTE', 'PAYMENT'] as const
export const notificationTypeSchema = z.enum(notificationTypes)
export const notificationResourceTypeSchema = z.enum(notificationResourceTypes)
export const notificationActorSchema = z.strictObject({ id: z.uuid(), name: z.string(), email: z.string(), role: z.enum(['ADMIN', 'OPERATOR']) })

// Metadata is supplemental and intentionally permissive: malformed or unfamiliar
// shapes must never prevent the basic notification from rendering.
export const notificationSchema = z.strictObject({
  id: z.uuid(), type: notificationTypeSchema, title: z.string(), message: z.string(),
  resourceType: notificationResourceTypeSchema, resourceId: z.uuid().nullable(),
  metadata: z.unknown().nullable(), readAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(), actor: notificationActorSchema.nullable(),
})
export const notificationPaginationSchema = z.strictObject({ page: z.int().min(1), limit: z.int().min(1).max(100), total: z.int().min(0), totalPages: z.int().min(0) })
export const notificationListResponseSchema = z.strictObject({ data: z.array(notificationSchema), pagination: notificationPaginationSchema })
export const unreadNotificationCountSchema = z.strictObject({ count: z.int().min(0) })
export const markAllNotificationsReadResponseSchema = z.strictObject({ updatedCount: z.int().min(0) })
export const notificationFiltersSchema = z.strictObject({ page: z.int().min(1), limit: z.int().min(1).max(100), unreadOnly: z.boolean().optional(), type: notificationTypeSchema.optional(), resourceType: notificationResourceTypeSchema.optional(), sortOrder: z.enum(['asc', 'desc']) })

export type Notification = z.infer<typeof notificationSchema>
export type NotificationType = z.infer<typeof notificationTypeSchema>
export type NotificationResourceType = z.infer<typeof notificationResourceTypeSchema>
export type NotificationFilters = z.infer<typeof notificationFiltersSchema>
export type NotificationListResponse = z.infer<typeof notificationListResponseSchema>

