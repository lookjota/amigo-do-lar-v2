import { authenticatedApiClient } from '../../../api/apiClient'
import {
  adminCustomerDetailsSchema,
  adminCustomersResponseSchema,
  createCustomerSchema,
  updateCustomerSchema,
  updateCustomerStatusSchema,
  type AdminCustomer,
  type AdminCustomerFilters,
  type AdminCustomersResponse,
  type CreateCustomerInput,
  type UpdateCustomerInput,
  type UpdateCustomerStatusInput,
} from '../types/contracts'

export function buildAdminCustomersPath(filters: AdminCustomerFilters) {
  const params = new URLSearchParams({ page: String(filters.page), limit: String(filters.limit) })
  const search = filters.search?.trim()
  if (search) params.set('search', search)
  if (filters.isActive !== undefined) params.set('isActive', String(filters.isActive))
  if (filters.sortBy) params.set('sortBy', filters.sortBy)
  if (filters.sortOrder) params.set('sortOrder', filters.sortOrder)
  return `/customers?${params.toString()}`
}

export async function getAdminCustomers(filters: AdminCustomerFilters, signal?: AbortSignal): Promise<AdminCustomersResponse> {
  return adminCustomersResponseSchema.parse(await authenticatedApiClient.get<unknown>(buildAdminCustomersPath(filters), { signal }))
}

export async function getAdminCustomer(id: string, signal?: AbortSignal): Promise<AdminCustomer> {
  return adminCustomerDetailsSchema.parse(await authenticatedApiClient.get<unknown>(`/customers/${encodeURIComponent(id)}`, { signal }))
}

export async function createAdminCustomer(input: CreateCustomerInput, signal?: AbortSignal): Promise<AdminCustomer> {
  const payload = createCustomerSchema.parse(input)
  return adminCustomerDetailsSchema.parse(await authenticatedApiClient.post<unknown>('/customers', payload, { signal }))
}

export async function updateAdminCustomer(id: string, input: UpdateCustomerInput, signal?: AbortSignal): Promise<AdminCustomer> {
  const payload = updateCustomerSchema.parse(input)
  return adminCustomerDetailsSchema.parse(await authenticatedApiClient.patch<unknown>(`/customers/${encodeURIComponent(id)}`, payload, { signal }))
}

export async function updateAdminCustomerStatus(id: string, input: UpdateCustomerStatusInput, signal?: AbortSignal): Promise<AdminCustomer> {
  const payload = updateCustomerStatusSchema.parse(input)
  return adminCustomerDetailsSchema.parse(await authenticatedApiClient.patch<unknown>(`/customers/${encodeURIComponent(id)}`, payload, { signal }))
}
