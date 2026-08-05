export type CalendarView = 'day' | 'week' | 'month'

export interface CalendarRange {
  from: string
  to: string
  start: Date
  end: Date
}

function startOfDay(date: Date) {
  const value = new Date(date)
  value.setHours(0, 0, 0, 0)
  return value
}

function endOfDay(date: Date) {
  const value = new Date(date)
  value.setHours(23, 59, 59, 999)
  return value
}

export function addLocalDays(date: Date, amount: number) {
  const value = new Date(date)
  value.setDate(value.getDate() + amount)
  return value
}

export function parseLocalDate(value: string | null, fallback = new Date()) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return startOfDay(fallback)
  const [year, month, day] = value.split('-').map(Number)
  const parsed = new Date(year, month - 1, day)
  return parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === day
    ? parsed
    : startOfDay(fallback)
}

export function formatLocalDate(date: Date) {
  const year = String(date.getFullYear()).padStart(4, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getCalendarRange(date: Date, view: CalendarView): CalendarRange {
  let start = startOfDay(date)
  let end = endOfDay(date)
  if (view === 'week') {
    const mondayOffset = (start.getDay() + 6) % 7
    start = addLocalDays(start, -mondayOffset)
    end = endOfDay(addLocalDays(start, 6))
  }
  if (view === 'month') {
    const first = new Date(date.getFullYear(), date.getMonth(), 1)
    const last = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    start = addLocalDays(first, -((first.getDay() + 6) % 7))
    end = endOfDay(addLocalDays(last, 6 - ((last.getDay() + 6) % 7)))
  }
  return { start, end, from: start.toISOString(), to: end.toISOString() }
}

export function navigateCalendar(date: Date, view: CalendarView, direction: -1 | 1) {
  if (view === 'day') return addLocalDays(date, direction)
  if (view === 'week') return addLocalDays(date, 7 * direction)
  return new Date(date.getFullYear(), date.getMonth() + direction, 1)
}
