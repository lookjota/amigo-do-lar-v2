import { z } from 'zod'

export const userRoleSchema = z.enum(['ADMIN', 'OPERATOR'])
export const userOrderBySchema = z.enum(['name', 'email', 'role', 'isActive', 'createdAt', 'updatedAt'])
export const userSortOrderSchema = z.enum(['asc', 'desc'])

export const adminUserSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  email: z.email(),
  role: userRoleSchema,
  isActive: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
}).strict()

export const adminUsersResponseSchema = z.object({
  data: z.array(adminUserSchema),
  pagination: z.object({
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(0),
  }).strict(),
}).strict()

const nameSchema = z.string().transform((value) => value.trim().replace(/\s+/g, ' ')).pipe(z.string().min(2).max(120))
const emailSchema = z.string().transform((value) => value.trim().toLowerCase()).pipe(z.email().max(320))
// O backend exige no mínimo oito caracteres; o frontend não inventa regras adicionais.
const passwordSchema = z.string().min(8).max(128)

export const createUserSchema = z.object({ name: nameSchema, email: emailSchema, password: passwordSchema, role: userRoleSchema, isActive: z.boolean().optional() }).strict()
export const updateUserSchema = z.object({ name: nameSchema.optional(), email: emailSchema.optional(), role: userRoleSchema.optional() }).strict()
  .refine((value) => Object.values(value).some((item) => item !== undefined), 'Informe ao menos uma alteração.')
export const updateUserStatusSchema = z.object({ isActive: z.boolean() }).strict()
export const updateUserPasswordSchema = z.object({ password: passwordSchema }).strict()
export const adminUserFiltersSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  search: z.string().trim().min(1).max(120).optional(),
  role: userRoleSchema.optional(),
  isActive: z.boolean().optional(),
  orderBy: userOrderBySchema.optional(),
  sortOrder: userSortOrderSchema.optional(),
}).strict()

export type UserRole = z.infer<typeof userRoleSchema>
export type AdminUser = z.infer<typeof adminUserSchema>
export type AdminUsersResponse = z.infer<typeof adminUsersResponseSchema>
export type CreateUserInput = z.input<typeof createUserSchema>
export type UpdateUserInput = z.input<typeof updateUserSchema>
export type UpdateUserStatusInput = z.input<typeof updateUserStatusSchema>
export type UpdateUserPasswordInput = z.input<typeof updateUserPasswordSchema>
export type AdminUserFilters = z.infer<typeof adminUserFiltersSchema>
export type UserOrderBy = z.infer<typeof userOrderBySchema>
export type UserSortOrder = z.infer<typeof userSortOrderSchema>
