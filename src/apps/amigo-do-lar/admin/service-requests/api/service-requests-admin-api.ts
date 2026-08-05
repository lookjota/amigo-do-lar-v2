import { authenticatedApiClient } from '../../../api/apiClient'
import {
  adminServiceRequestSchema,
  adminServiceRequestsResponseSchema,
  updateServiceRequestStatusSchema,
  type AdminServiceRequest,
  type AdminServiceRequestFilters,
  type AdminServiceRequestsResponse,
  type UpdateServiceRequestStatus,
} from '../types/contracts'

export function buildAdminServiceRequestsPath(
  filters: AdminServiceRequestFilters,
): string {
  const params = new URLSearchParams()
  params.set('page', String(filters.page))
  params.set('limit', String(filters.limit))

  const optionalEntries = {
    search: filters.search?.trim(),
    status: filters.status,
    serviceId: filters.serviceId,
    createdFrom: filters.createdFrom,
    createdTo: filters.createdTo,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  }
  Object.entries(optionalEntries).forEach(([key, value]) => {
    if (value) params.set(key, value)
  })

  return `/service-requests?${params.toString()}`
}

export async function getAdminServiceRequests(
  filters: AdminServiceRequestFilters,
  signal?: AbortSignal,
): Promise<AdminServiceRequestsResponse> {
  const response = await authenticatedApiClient.get<unknown>(
    buildAdminServiceRequestsPath(filters),
    { signal },
  )
  return adminServiceRequestsResponseSchema.parse(response)
}

export async function getAdminServiceRequest(
  id: string,
  signal?: AbortSignal,
): Promise<AdminServiceRequest> {
  const response = await authenticatedApiClient.get<unknown>(
    `/service-requests/${encodeURIComponent(id)}`,
    { signal },
  )
  return adminServiceRequestSchema.parse(response)
}

export async function updateAdminServiceRequestStatus(
  id: string,
  input: UpdateServiceRequestStatus,
  signal?: AbortSignal,
): Promise<AdminServiceRequest> {
  const payload = updateServiceRequestStatusSchema.parse(input)
  const response = await authenticatedApiClient.patch<unknown>(
    `/service-requests/${encodeURIComponent(id)}/status`,
    payload,
    { signal },
  )
  return adminServiceRequestSchema.parse(response)
}
