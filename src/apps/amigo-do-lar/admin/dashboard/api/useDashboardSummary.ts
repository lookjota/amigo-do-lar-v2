import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { useState } from 'react'
import { hasRole } from '../../../auth/authorization'
import type { AuthUser } from '../../../auth/contracts'
import type { AdminAppointmentsResponse } from '../../appointments/types/contracts'
import type { AdminCustomersResponse } from '../../customers/types/contracts'
import type { AdminServiceRequestsResponse } from '../../service-requests/types/contracts'
import type { AdminServicesResponse } from '../../services/types/contracts'
import type { AdminUsersResponse } from '../../users/types/contracts'
import type { DashboardCollection, DashboardMetric, DashboardSummary } from '../types/contracts'
import { getLocalDayRange } from '../utils/date-range'
import {
  getActiveServiceCount,
  getActiveUserCount,
  getAppointmentsInRange,
  getCustomerCount,
  getInProgressServiceRequests,
  getPendingServiceRequests,
  getRecentServiceRequests,
  getServiceRequestsCreatedInRange,
  getUpcomingAppointments,
} from './dashboard-api'

export const dashboardQueryKey = ['admin', 'dashboard'] as const

function toMetric(query: UseQueryResult<{ pagination: { total: number } }, Error>): DashboardMetric {
  if (query.isError) return { availability: 'error', error: query.error }
  if (query.data) return { availability: 'available', value: query.data.pagination.total }
  return { availability: 'available' }
}

function toCollection<T>(query: UseQueryResult<{ data: T[] }, Error>): DashboardCollection<T> {
  if (query.isError) return { availability: 'error', items: [], error: query.error }
  return { availability: 'available', items: query.data?.data ?? [] }
}

export function useDashboardSummary(user: AuthUser, now: Date = new Date()) {
  const [referenceTime] = useState(now)
  const enabled = typeof window !== 'undefined'
  const isAdmin = hasRole(user, ['ADMIN'])
  const dayRange = getLocalDayRange(referenceTime)
  const nowIso = referenceTime.toISOString()
  const settings = { enabled, staleTime: 30_000 }

  const pending = useQuery<AdminServiceRequestsResponse>({ queryKey: [...dashboardQueryKey, 'requests', 'pending'], queryFn: ({ signal }) => getPendingServiceRequests(signal), ...settings })
  const inProgress = useQuery<AdminServiceRequestsResponse>({ queryKey: [...dashboardQueryKey, 'requests', 'in-progress'], queryFn: ({ signal }) => getInProgressServiceRequests(signal), ...settings })
  const createdToday = useQuery<AdminServiceRequestsResponse>({ queryKey: [...dashboardQueryKey, 'requests', 'today', dayRange], queryFn: ({ signal }) => getServiceRequestsCreatedInRange(dayRange, signal), ...settings })
  const recent = useQuery<AdminServiceRequestsResponse>({ queryKey: [...dashboardQueryKey, 'requests', 'recent'], queryFn: ({ signal }) => getRecentServiceRequests(signal), ...settings })
  const customers = useQuery<AdminCustomersResponse>({ queryKey: [...dashboardQueryKey, 'customers', 'total'], queryFn: ({ signal }) => getCustomerCount(undefined, signal), ...settings })
  const activeCustomers = useQuery<AdminCustomersResponse>({ queryKey: [...dashboardQueryKey, 'customers', 'active'], queryFn: ({ signal }) => getCustomerCount(true, signal), ...settings })
  const services = useQuery<AdminServicesResponse>({ queryKey: [...dashboardQueryKey, 'services', 'active'], queryFn: ({ signal }) => getActiveServiceCount(signal), ...settings })
  const appointmentsToday = useQuery<AdminAppointmentsResponse>({ queryKey: [...dashboardQueryKey, 'appointments', 'today', dayRange], queryFn: ({ signal }) => getAppointmentsInRange(dayRange, signal), ...settings })
  const upcoming = useQuery<AdminAppointmentsResponse>({ queryKey: [...dashboardQueryKey, 'appointments', 'upcoming', nowIso], queryFn: ({ signal }) => getUpcomingAppointments(nowIso, signal), ...settings })
  const users = useQuery<AdminUsersResponse>({ queryKey: [...dashboardQueryKey, 'users', 'active'], queryFn: ({ signal }) => getActiveUserCount(signal), enabled: enabled && isAdmin, staleTime: settings.staleTime })

  const summary: DashboardSummary = {
    pendingServiceRequests: toMetric(pending),
    inProgressServiceRequests: toMetric(inProgress),
    serviceRequestsCreatedToday: toMetric(createdToday),
    totalCustomers: toMetric(customers),
    activeCustomers: toMetric(activeCustomers),
    activeServices: toMetric(services),
    appointmentsToday: toMetric(appointmentsToday),
    activeUsers: isAdmin ? toMetric(users) : { availability: 'unavailable-permission' },
    recentServiceRequests: toCollection(recent),
    upcomingAppointments: toCollection(upcoming),
  }

  return {
    summary,
    isPending: [pending, inProgress, createdToday, recent, customers, activeCustomers, services, appointmentsToday, upcoming, ...(isAdmin ? [users] : [])].some((query) => query.isPending),
    retryMetrics: () => Promise.all([pending.refetch(), inProgress.refetch(), createdToday.refetch(), customers.refetch(), activeCustomers.refetch(), services.refetch(), appointmentsToday.refetch(), ...(isAdmin ? [users.refetch()] : [])]),
    retryRecentServiceRequests: recent.refetch,
    retryUpcomingAppointments: upcoming.refetch,
  }
}
