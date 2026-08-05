import { getAdminAppointments } from '../../appointments/api/appointments-admin-api'
import { getAdminCustomers } from '../../customers/api/customers-admin-api'
import { getAdminServiceRequests } from '../../service-requests/api/service-requests-admin-api'
import { getAdminServices } from '../../services/api/services-admin-api'
import { getAdminUsers } from '../../users/api/users-admin-api'
import type { DashboardDateRange } from '../utils/date-range'

export const dashboardLimits = { count: 1, preview: 5 } as const

export function getPendingServiceRequests(signal?: AbortSignal) {
  return getAdminServiceRequests({ page: 1, limit: dashboardLimits.count, status: 'PENDING' }, signal)
}

export function getInProgressServiceRequests(signal?: AbortSignal) {
  return getAdminServiceRequests({ page: 1, limit: dashboardLimits.count, status: 'IN_PROGRESS' }, signal)
}

export function getServiceRequestsCreatedInRange(range: DashboardDateRange, signal?: AbortSignal) {
  return getAdminServiceRequests({ page: 1, limit: dashboardLimits.count, createdFrom: range.from, createdTo: range.to }, signal)
}

export function getRecentServiceRequests(signal?: AbortSignal) {
  return getAdminServiceRequests({ page: 1, limit: dashboardLimits.preview, sortBy: 'createdAt', sortOrder: 'desc' }, signal)
}

export function getCustomerCount(isActive?: boolean, signal?: AbortSignal) {
  return getAdminCustomers({ page: 1, limit: dashboardLimits.count, isActive }, signal)
}

export function getActiveServiceCount(signal?: AbortSignal) {
  return getAdminServices({ page: 1, limit: dashboardLimits.count, isActive: true }, signal)
}

export function getAppointmentsInRange(range: DashboardDateRange, signal?: AbortSignal) {
  return getAdminAppointments({ page: 1, limit: dashboardLimits.preview, scheduledFrom: range.from, scheduledTo: range.to, sortBy: 'scheduledAt', sortOrder: 'asc' }, signal)
}

export function getUpcomingAppointments(from: string, signal?: AbortSignal) {
  return getAdminAppointments({ page: 1, limit: dashboardLimits.preview, scheduledFrom: from, sortBy: 'scheduledAt', sortOrder: 'asc' }, signal)
}

export function getActiveUserCount(signal?: AbortSignal) {
  return getAdminUsers({ page: 1, limit: dashboardLimits.count, isActive: true }, signal)
}
