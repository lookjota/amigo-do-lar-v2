import { z } from 'zod'

export const SERVICE_CATEGORIES = {
  PLUMBING: 'Hidráulica',
  ELECTRICAL: 'Elétrica',
  FURNITURE_ASSEMBLY: 'Montagem de móveis',
  LOCKS_AND_DOORS: 'Fechaduras e portas',
  PAINTING: 'Pintura',
  MINOR_REPAIRS: 'Pequenos reparos',
} as const

export const serviceCategorySchema = z.string().trim().min(1).max(100)
export const serviceSlugSchema = z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)

export const adminServiceSchema = z.object({
  id: z.uuid(),
  name: z.string().min(3).max(120),
  slug: serviceSlugSchema,
  description: z.string().min(1).max(1000),
  category: serviceCategorySchema,
  isActive: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
}).strict()

export const adminServiceListItemSchema = adminServiceSchema
export const adminServiceDetailsSchema = adminServiceSchema
export const adminServicesResponseSchema = z.object({
  data: z.array(adminServiceListItemSchema),
  pagination: z.object({ page: z.number().int().min(1), limit: z.number().int().min(1).max(100), total: z.number().int().min(0), totalPages: z.number().int().min(0) }).strict(),
}).strict()

const normalizedName = z.string().transform((value) => value.trim().replace(/\s+/g, ' ')).pipe(z.string().min(3).max(120))
const normalizedDescription = z.string().transform((value) => value.trim()).pipe(z.string().min(1).max(1000))

export const createServiceSchema = z.object({ name: normalizedName, slug: serviceSlugSchema, description: normalizedDescription, category: serviceCategorySchema }).strict()
export const updateServiceSchema = z.object({ name: normalizedName.optional(), slug: serviceSlugSchema.optional(), description: normalizedDescription.optional(), category: serviceCategorySchema.optional() }).strict()
  .refine((value) => Object.values(value).some((item) => item !== undefined), 'Informe ao menos uma alteração.')
export const updateServiceStatusSchema = z.object({ isActive: z.boolean() }).strict()

export type AdminService = z.infer<typeof adminServiceSchema>
export type AdminServicesResponse = z.infer<typeof adminServicesResponseSchema>
export type CreateServiceInput = z.input<typeof createServiceSchema>
export type UpdateServiceInput = z.input<typeof updateServiceSchema>
export type UpdateServiceStatusInput = z.infer<typeof updateServiceStatusSchema>
export type ServiceOrderBy = 'name' | 'createdAt'
export type ServiceSortOrder = 'asc' | 'desc'
export interface AdminServiceFilters { page: number; limit: number; search?: string; category?: string; isActive?: boolean; orderBy?: ServiceOrderBy; sortOrder?: ServiceSortOrder }

export function getServiceCategoryLabel(category: string) {
  return SERVICE_CATEGORIES[category as keyof typeof SERVICE_CATEGORIES] ?? category
}
