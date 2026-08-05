import { useInfiniteQuery } from '@tanstack/react-query'
import { getAdminAppointments } from '../../appointments/api/appointments-admin-api'
import { adminAppointmentsKey } from '../../appointments/api/useAppointments'
import type { CalendarRange } from '../utils/calendar-range'

export const CALENDAR_PAGE_SIZE = 100

export function useCalendarAppointments(range: CalendarRange) {
  return useInfiniteQuery({
    queryKey: [...adminAppointmentsKey, 'calendar', range.from, range.to],
    queryFn: ({ pageParam, signal }) => getAdminAppointments({
      page: pageParam,
      limit: CALENDAR_PAGE_SIZE,
      scheduledFrom: range.from,
      scheduledTo: range.to,
      sortBy: 'scheduledAt',
      sortOrder: 'asc',
    }, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pagination.page < lastPage.pagination.totalPages
      ? lastPage.pagination.page + 1
      : undefined,
    enabled: typeof window !== 'undefined',
  })
}
