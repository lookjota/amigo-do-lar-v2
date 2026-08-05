import type { AdminAppointment } from '../../appointments/types/contracts'
import type { AdminServiceRequest } from '../../service-requests/types/contracts'

export type DashboardMetricAvailability =
  | 'available'
  | 'unavailable-permission'
  | 'unavailable-contract'
  | 'error'

export interface DashboardMetric {
  availability: DashboardMetricAvailability
  value?: number
  error?: unknown
}

export interface DashboardCollection<T> {
  availability: 'available' | 'error'
  items: T[]
  error?: unknown
}

export interface DashboardSummary {
  pendingServiceRequests: DashboardMetric
  inProgressServiceRequests: DashboardMetric
  serviceRequestsCreatedToday: DashboardMetric
  totalCustomers: DashboardMetric
  activeCustomers: DashboardMetric
  activeServices: DashboardMetric
  appointmentsToday: DashboardMetric
  activeUsers: DashboardMetric
  recentServiceRequests: DashboardCollection<AdminServiceRequest>
  upcomingAppointments: DashboardCollection<AdminAppointment>
}
