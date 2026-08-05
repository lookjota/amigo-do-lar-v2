import { authenticatedApiClient } from '../../../api/apiClient'
import {
  adminAppointmentSchema, adminAppointmentsResponseSchema, createAppointmentSchema,
  updateAppointmentSchema, updateAppointmentStatusSchema, type AdminAppointment,
  type AdminAppointmentFilters, type AdminAppointmentsResponse, type CreateAppointmentInput,
  type UpdateAppointmentInput, type UpdateAppointmentStatusInput,
} from '../types/contracts'

export function buildAdminAppointmentsPath(filters: AdminAppointmentFilters) {
  const params = new URLSearchParams({ page: String(filters.page), limit: String(filters.limit) })
  const optional = { status: filters.status, serviceRequestId: filters.serviceRequestId, customerId: filters.customerId, serviceId: filters.serviceId, scheduledFrom: filters.scheduledFrom, scheduledTo: filters.scheduledTo, sortBy: filters.sortBy, sortOrder: filters.sortOrder }
  Object.entries(optional).forEach(([key, value]) => { if (value?.trim()) params.set(key, value.trim()) })
  return `/appointments?${params.toString()}`
}

export async function getAdminAppointments(filters: AdminAppointmentFilters, signal?: AbortSignal): Promise<AdminAppointmentsResponse> {
  return adminAppointmentsResponseSchema.parse(await authenticatedApiClient.get<unknown>(buildAdminAppointmentsPath(filters), { signal }))
}
export async function getAdminAppointment(id: string, signal?: AbortSignal): Promise<AdminAppointment> {
  return adminAppointmentSchema.parse(await authenticatedApiClient.get<unknown>(`/appointments/${encodeURIComponent(id)}`, { signal }))
}
export async function createAdminAppointment(input: CreateAppointmentInput, signal?: AbortSignal): Promise<AdminAppointment> {
  const payload = createAppointmentSchema.parse(input)
  return adminAppointmentSchema.parse(await authenticatedApiClient.post<unknown>('/appointments', payload, { signal }))
}
export async function updateAdminAppointment(id: string, input: UpdateAppointmentInput, signal?: AbortSignal): Promise<AdminAppointment> {
  const payload = updateAppointmentSchema.parse(input)
  return adminAppointmentSchema.parse(await authenticatedApiClient.patch<unknown>(`/appointments/${encodeURIComponent(id)}`, payload, { signal }))
}
export async function updateAdminAppointmentStatus(id: string, input: UpdateAppointmentStatusInput, signal?: AbortSignal): Promise<AdminAppointment> {
  const payload = updateAppointmentStatusSchema.parse(input)
  return adminAppointmentSchema.parse(await authenticatedApiClient.patch<unknown>(`/appointments/${encodeURIComponent(id)}/status`, payload, { signal }))
}
