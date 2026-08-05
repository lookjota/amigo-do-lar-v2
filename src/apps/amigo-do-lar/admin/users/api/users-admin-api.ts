import { authenticatedApiClient } from '../../../api/apiClient'
import { adminUserFiltersSchema, adminUserSchema, adminUsersResponseSchema, createUserSchema, updateUserPasswordSchema, updateUserSchema, updateUserStatusSchema, type AdminUser, type AdminUserFilters, type AdminUsersResponse, type CreateUserInput, type UpdateUserInput, type UpdateUserPasswordInput, type UpdateUserStatusInput } from '../types/contracts'

export function buildAdminUsersPath(input: AdminUserFilters) {
  const filters = adminUserFiltersSchema.parse(input)
  const params = new URLSearchParams({ page: String(filters.page), limit: String(filters.limit) })
  if (filters.search) params.set('search', filters.search)
  if (filters.role) params.set('role', filters.role)
  if (filters.isActive !== undefined) params.set('isActive', String(filters.isActive))
  if (filters.orderBy) params.set('orderBy', filters.orderBy)
  if (filters.sortOrder) params.set('sortOrder', filters.sortOrder)
  return `/users?${params.toString()}`
}

export async function getAdminUsers(filters: AdminUserFilters, signal?: AbortSignal): Promise<AdminUsersResponse> {
  return adminUsersResponseSchema.parse(await authenticatedApiClient.get<unknown>(buildAdminUsersPath(filters), { signal }))
}
export async function getAdminUser(id: string, signal?: AbortSignal): Promise<AdminUser> {
  return adminUserSchema.parse(await authenticatedApiClient.get<unknown>(`/users/${encodeURIComponent(id)}`, { signal }))
}
export async function createAdminUser(input: CreateUserInput, signal?: AbortSignal): Promise<AdminUser> {
  return adminUserSchema.parse(await authenticatedApiClient.post<unknown>('/users', createUserSchema.parse(input), { signal }))
}
export async function updateAdminUser(id: string, input: UpdateUserInput, signal?: AbortSignal): Promise<AdminUser> {
  return adminUserSchema.parse(await authenticatedApiClient.patch<unknown>(`/users/${encodeURIComponent(id)}`, updateUserSchema.parse(input), { signal }))
}
export async function updateAdminUserStatus(id: string, input: UpdateUserStatusInput, signal?: AbortSignal): Promise<AdminUser> {
  return adminUserSchema.parse(await authenticatedApiClient.patch<unknown>(`/users/${encodeURIComponent(id)}/status`, updateUserStatusSchema.parse(input), { signal }))
}
export async function updateAdminUserPassword(id: string, input: UpdateUserPasswordInput, signal?: AbortSignal): Promise<void> {
  await authenticatedApiClient.patch<unknown>(`/users/${encodeURIComponent(id)}/password`, updateUserPasswordSchema.parse(input), { signal })
}
