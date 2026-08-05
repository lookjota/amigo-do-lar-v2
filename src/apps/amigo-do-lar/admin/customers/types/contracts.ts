import { z } from 'zod'

export const customerSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(120),
  phone: z.string().min(1).max(30),
  email: z.email().nullable(),
  isActive: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
}).strict()

export const adminCustomerListItemSchema = customerSchema
export const adminCustomerDetailsSchema = customerSchema
export const adminCustomersResponseSchema = z.object({
  data: z.array(adminCustomerListItemSchema),
  pagination: z.object({
    page: z.number().int().min(1),
    limit: z.number().int().min(1).max(100),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(0),
  }).strict(),
}).strict()

const name = z.string().transform((value) => value.trim().replace(/\s+/g, ' ')).pipe(z.string().min(2).max(120))
const phone = z.string().trim().regex(/^[\d\s()+.-]+$/).transform((value) => value.replace(/\D/g, '')).pipe(z.string().regex(/^\d{10,11}$/))
const email = z.union([z.string(), z.null()])
  .transform((value) => typeof value === 'string' ? value.trim().toLowerCase() || null : null)
  .pipe(z.union([z.email(), z.null()]))

export const createCustomerSchema = z.object({ name, phone, email: email.optional() }).strict()
export const updateCustomerSchema = z.object({ name: name.optional(), phone: phone.optional(), email: email.optional() }).strict()
  .refine((value) => Object.values(value).some((item) => item !== undefined), 'Informe ao menos uma alteração.')
export const updateCustomerStatusSchema = z.object({ isActive: z.boolean() }).strict()

export type AdminCustomer = z.infer<typeof customerSchema>
export type AdminCustomersResponse = z.infer<typeof adminCustomersResponseSchema>
export type CreateCustomerInput = z.input<typeof createCustomerSchema>
export type CreateCustomerPayload = z.output<typeof createCustomerSchema>
export type UpdateCustomerInput = z.input<typeof updateCustomerSchema>
export type UpdateCustomerPayload = z.output<typeof updateCustomerSchema>
export type UpdateCustomerStatusInput = z.infer<typeof updateCustomerStatusSchema>
export type CustomerSortBy = 'name' | 'createdAt' | 'updatedAt'
export type CustomerSortOrder = 'asc' | 'desc'
export interface AdminCustomerFilters {
  page: number
  limit: number
  search?: string
  isActive?: boolean
  sortBy?: CustomerSortBy
  sortOrder?: CustomerSortOrder
}
