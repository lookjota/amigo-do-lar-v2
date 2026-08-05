import { authenticatedApiClient } from '../../../api/apiClient'
import { adminServiceDetailsSchema, adminServicesResponseSchema, createServiceSchema, updateServiceSchema, updateServiceStatusSchema, type AdminService, type AdminServiceFilters, type AdminServicesResponse, type CreateServiceInput, type UpdateServiceInput, type UpdateServiceStatusInput } from '../types/contracts'

export function buildAdminServicesPath(filters: AdminServiceFilters) {
  const params = new URLSearchParams({ page: String(filters.page), limit: String(filters.limit) })
  const search = filters.search?.trim()
  const category = filters.category?.trim()
  if (search) params.set('search', search)
  if (category) params.set('category', category)
  if (filters.isActive !== undefined) params.set('isActive', String(filters.isActive))
  if (filters.orderBy) params.set('orderBy', filters.orderBy)
  if (filters.sortOrder) params.set('sortOrder', filters.sortOrder)
  return `/services?${params.toString()}`
}

export async function getAdminServices(filters: AdminServiceFilters, signal?: AbortSignal): Promise<AdminServicesResponse> {
  return adminServicesResponseSchema.parse(await authenticatedApiClient.get<unknown>(buildAdminServicesPath(filters), { signal }))
}
export async function getAdminService(slug: string, signal?: AbortSignal): Promise<AdminService> {
  return adminServiceDetailsSchema.parse(await authenticatedApiClient.get<unknown>(`/services/${encodeURIComponent(slug)}`, { signal }))
}
export async function createAdminService(input: CreateServiceInput, signal?: AbortSignal): Promise<AdminService> {
  const payload = createServiceSchema.parse(input)
  return adminServiceDetailsSchema.parse(await authenticatedApiClient.post<unknown>('/services', payload, { signal }))
}
export async function updateAdminService(id: string, input: UpdateServiceInput, signal?: AbortSignal): Promise<AdminService> {
  const payload = updateServiceSchema.parse(input)
  return adminServiceDetailsSchema.parse(await authenticatedApiClient.patch<unknown>(`/services/${encodeURIComponent(id)}`, payload, { signal }))
}
export async function updateAdminServiceStatus(id: string, input: UpdateServiceStatusInput, signal?: AbortSignal): Promise<AdminService> {
  const payload = updateServiceStatusSchema.parse(input)
  return adminServiceDetailsSchema.parse(await authenticatedApiClient.patch<unknown>(`/services/${encodeURIComponent(id)}`, payload, { signal }))
}
