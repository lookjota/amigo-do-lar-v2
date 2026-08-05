import { z } from 'zod'

export const serviceRequestStatuses = [
  'PENDING',
  'CONTACTED',
  'QUOTED',
  'APPROVED',
  'SCHEDULED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
] as const

export const serviceRequestStatusSchema = z.enum(serviceRequestStatuses)
export type ServiceRequestStatus = z.infer<typeof serviceRequestStatusSchema>

export const serviceRequestStatusLabels: Record<ServiceRequestStatus, string> = {
  PENDING: 'Pendente',
  CONTACTED: 'Contatado',
  QUOTED: 'Orçamento enviado',
  APPROVED: 'Aprovado',
  SCHEDULED: 'Agendado',
  IN_PROGRESS: 'Em andamento',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
}

export const serviceRequestTransitions: Record<
  ServiceRequestStatus,
  readonly ServiceRequestStatus[]
> = {
  PENDING: ['CONTACTED', 'CANCELLED'],
  CONTACTED: ['QUOTED', 'CANCELLED'],
  QUOTED: ['APPROVED', 'CONTACTED', 'CANCELLED'],
  APPROVED: ['SCHEDULED', 'CANCELLED'],
  SCHEDULED: ['IN_PROGRESS', 'APPROVED', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'SCHEDULED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
}

const nullableDateSchema = z.iso.datetime().nullable()
const customerSummarySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  phone: z.string(),
  email: z.string().nullable(),
  isActive: z.boolean(),
})
const serviceSummarySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  category: z.string(),
  isActive: z.boolean(),
})

export const adminServiceRequestSchema = z.object({
  id: z.uuid(),
  customerId: z.uuid(),
  serviceId: z.uuid(),
  description: z.string(),
  status: serviceRequestStatusSchema,
  preferredDate: nullableDateSchema,
  address: z.string().nullable(),
  city: z.string().nullable(),
  internalNotes: z.string().nullable(),
  completedAt: nullableDateSchema,
  cancelledAt: nullableDateSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  customer: customerSummarySchema,
  service: serviceSummarySchema,
})

export const adminServiceRequestsResponseSchema = z.object({
  data: z.array(adminServiceRequestSchema),
  pagination: z.object({
    page: z.number().int().min(1),
    limit: z.number().int().min(1).max(100),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(0),
  }),
})

export const updateServiceRequestStatusSchema = z.object({
  status: serviceRequestStatusSchema,
})

export type AdminServiceRequest = z.infer<typeof adminServiceRequestSchema>
export type AdminServiceRequestsResponse = z.infer<
  typeof adminServiceRequestsResponseSchema
>
export type UpdateServiceRequestStatus = z.infer<
  typeof updateServiceRequestStatusSchema
>

export interface AdminServiceRequestFilters {
  page: number
  limit: number
  search?: string
  status?: ServiceRequestStatus
  customerId?: string
  serviceId?: string
  createdFrom?: string
  createdTo?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'preferredDate' | 'status'
  sortOrder?: 'asc' | 'desc'
}
