import { z } from 'zod'
import { apiClient } from './apiClient'

export interface CreateServiceRequestInput {
  customer: { name: string; phone: string; email?: string }
  serviceId: string
  description: string
  address: string
  city: string
  preferredDate?: string | null
}

const nullableDate = z.iso.datetime().nullable()
const responseSchema = z.object({
  id: z.uuid(), customerId: z.uuid(), serviceId: z.uuid(),
  description: z.string(), status: z.enum(['PENDING', 'CONTACTED', 'QUOTED', 'APPROVED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  preferredDate: nullableDate, address: z.string().nullable(), city: z.string().nullable(),
  completedAt: nullableDate, cancelledAt: nullableDate,
  createdAt: z.iso.datetime(), updatedAt: z.iso.datetime(),
})

export type CreateServiceRequestResponse = z.infer<typeof responseSchema>

export async function createServiceRequest(input: CreateServiceRequestInput, signal?: AbortSignal): Promise<CreateServiceRequestResponse> {
  const response = await apiClient.post<unknown>('/service-requests', input, { signal })
  return responseSchema.parse(response)
}
