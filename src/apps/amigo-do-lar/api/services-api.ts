import { z } from 'zod'
import { apiClient } from './apiClient'

const serviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  category: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

const servicesResponseSchema = z.object({
  data: z.array(serviceSchema),
  pagination: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  }),
})

export type PublicService = z.infer<typeof serviceSchema>
export type ServicesResponse = z.infer<typeof servicesResponseSchema>

export async function getServices(
  signal?: AbortSignal,
): Promise<PublicService[]> {
  const response = await apiClient.get<unknown>('/services', { signal })
  const parsed = servicesResponseSchema.parse(response)

  return parsed.data.filter((service) => service.isActive)
}
