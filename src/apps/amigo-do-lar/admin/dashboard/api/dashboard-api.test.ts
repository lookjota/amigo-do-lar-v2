import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getAdminAppointments } from '../../appointments/api/appointments-admin-api'
import { getAdminCustomers } from '../../customers/api/customers-admin-api'
import { getAdminServiceRequests } from '../../service-requests/api/service-requests-admin-api'
import { getAdminServices } from '../../services/api/services-admin-api'
import { getAdminUsers } from '../../users/api/users-admin-api'
import {
  getActiveServiceCount,
  getActiveUserCount,
  getAppointmentsInRange,
  getCustomerCount,
  getPendingServiceRequests,
  getRecentServiceRequests,
  getServiceRequestsCreatedInRange,
  getUpcomingAppointments,
} from './dashboard-api'

vi.mock('../../appointments/api/appointments-admin-api', () => ({ getAdminAppointments: vi.fn() }))
vi.mock('../../customers/api/customers-admin-api', () => ({ getAdminCustomers: vi.fn() }))
vi.mock('../../service-requests/api/service-requests-admin-api', () => ({ getAdminServiceRequests: vi.fn() }))
vi.mock('../../services/api/services-admin-api', () => ({ getAdminServices: vi.fn() }))
vi.mock('../../users/api/users-admin-api', () => ({ getAdminUsers: vi.fn() }))

const response = { data: [], pagination: { page: 1, limit: 1, total: 0, totalPages: 0 } }
const range = { from: '2026-08-05T03:00:00.000Z', to: '2026-08-06T02:59:59.999Z' }

describe('dashboard api', () => {
  beforeEach(() => {
    vi.mocked(getAdminAppointments).mockResolvedValue(response)
    vi.mocked(getAdminCustomers).mockResolvedValue(response)
    vi.mocked(getAdminServiceRequests).mockResolvedValue(response)
    vi.mocked(getAdminServices).mockResolvedValue(response)
    vi.mocked(getAdminUsers).mockResolvedValue(response)
  })

  it('usa consultas mínimas, filtros e ordenações reais e encaminha AbortSignal', async () => {
    const signal = new AbortController().signal
    await Promise.all([
      getPendingServiceRequests(signal), getServiceRequestsCreatedInRange(range, signal),
      getRecentServiceRequests(signal), getCustomerCount(true, signal), getActiveServiceCount(signal),
      getAppointmentsInRange(range, signal), getUpcomingAppointments(range.from, signal), getActiveUserCount(signal),
    ])

    expect(getAdminServiceRequests).toHaveBeenCalledWith({ page: 1, limit: 1, status: 'PENDING' }, signal)
    expect(getAdminServiceRequests).toHaveBeenCalledWith(expect.objectContaining({ limit: 1, createdFrom: range.from, createdTo: range.to }), signal)
    expect(getAdminServiceRequests).toHaveBeenCalledWith({ page: 1, limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }, signal)
    expect(getAdminCustomers).toHaveBeenCalledWith({ page: 1, limit: 1, isActive: true }, signal)
    expect(getAdminServices).toHaveBeenCalledWith({ page: 1, limit: 1, isActive: true }, signal)
    expect(getAdminAppointments).toHaveBeenCalledWith(expect.objectContaining({ limit: 5, scheduledFrom: range.from, scheduledTo: range.to }), signal)
    expect(getAdminAppointments).toHaveBeenCalledWith(expect.objectContaining({ limit: 5, scheduledFrom: range.from, sortBy: 'scheduledAt' }), signal)
    expect(getAdminUsers).toHaveBeenCalledWith({ page: 1, limit: 1, isActive: true }, signal)
  })
})
