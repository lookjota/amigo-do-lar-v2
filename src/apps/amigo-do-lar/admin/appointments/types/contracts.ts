import { z } from 'zod'

export const appointmentStatuses = ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const
export const appointmentStatusSchema = z.enum(appointmentStatuses)
export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>

export const appointmentStatusLabels: Record<AppointmentStatus, string> = {
  SCHEDULED: 'Agendado', CONFIRMED: 'Confirmado', IN_PROGRESS: 'Em andamento',
  COMPLETED: 'Concluído', CANCELLED: 'Cancelado',
}

export const appointmentTransitions: Record<AppointmentStatus, readonly AppointmentStatus[]> = {
  SCHEDULED: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['IN_PROGRESS', 'SCHEDULED', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CONFIRMED', 'CANCELLED'],
  COMPLETED: [], CANCELLED: [],
}

const nullableDate = z.iso.datetime().nullable()
const serviceRequestStatus = z.enum(['PENDING', 'CONTACTED', 'QUOTED', 'APPROVED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
const appointmentCustomerSchema = z.object({ id: z.uuid(), name: z.string(), phone: z.string(), email: z.string().nullable() })
const appointmentServiceSchema = z.object({ id: z.uuid(), name: z.string(), slug: z.string(), category: z.string() })
const appointmentServiceRequestSchema = z.object({
  id: z.uuid(), customerId: z.uuid(), serviceId: z.uuid(), description: z.string(),
  status: serviceRequestStatus, preferredDate: nullableDate, address: z.string().nullable(),
  city: z.string().nullable(), customer: appointmentCustomerSchema, service: appointmentServiceSchema,
})

export const adminAppointmentSchema = z.object({
  id: z.uuid(), serviceRequestId: z.uuid(), scheduledAt: z.iso.datetime(),
  durationMinutes: z.number().int().min(15).max(480), status: appointmentStatusSchema,
  notes: z.string().nullable(), startedAt: nullableDate, completedAt: nullableDate,
  cancelledAt: nullableDate, createdAt: z.iso.datetime(), updatedAt: z.iso.datetime(),
  serviceRequest: appointmentServiceRequestSchema,
})

export const adminAppointmentsResponseSchema = z.object({
  data: z.array(adminAppointmentSchema),
  pagination: z.object({ page: z.number().int().min(1), limit: z.number().int().min(1).max(100), total: z.number().int().min(0), totalPages: z.number().int().min(0) }),
})

const scheduleFields = {
  scheduledAt: z.iso.datetime(), durationMinutes: z.number().int().min(15).max(480),
  notes: z.string().max(4000).nullable().optional(),
}
export const createAppointmentSchema = z.object({ serviceRequestId: z.uuid(), ...scheduleFields }).strict()
export const updateAppointmentSchema = z.object({
  scheduledAt: scheduleFields.scheduledAt.optional(), durationMinutes: scheduleFields.durationMinutes.optional(), notes: scheduleFields.notes,
}).strict().refine((value) => Object.values(value).some((item) => item !== undefined), 'Informe ao menos uma alteração.')
export const updateAppointmentStatusSchema = z.object({ status: appointmentStatusSchema }).strict()

export type AdminAppointment = z.infer<typeof adminAppointmentSchema>
export type AdminAppointmentsResponse = z.infer<typeof adminAppointmentsResponseSchema>
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>
export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>
export interface AdminAppointmentFilters {
  page: number
  limit: number
  status?: AppointmentStatus
  serviceRequestId?: string
  customerId?: string
  serviceId?: string
  scheduledFrom?: string
  scheduledTo?: string
  sortBy?: 'scheduledAt' | 'createdAt' | 'updatedAt' | 'status'
  sortOrder?: 'asc' | 'desc'
}
