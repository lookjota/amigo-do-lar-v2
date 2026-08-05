export interface DashboardDateRange {
  from: string
  to: string
}

export function getLocalDayRange(date: Date): DashboardDateRange {
  const from = new Date(date)
  from.setHours(0, 0, 0, 0)

  const to = new Date(date)
  to.setHours(23, 59, 59, 999)

  return { from: from.toISOString(), to: to.toISOString() }
}
