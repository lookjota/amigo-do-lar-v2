import type { AdminAppointment } from '../../appointments/types/contracts'
import type { CalendarView as CalendarViewType } from '../utils/calendar-range'
import { formatLocalDate } from '../utils/calendar-range'
import { getCalendarDays, groupAppointmentsByLocalDay } from '../utils/calendar-grid'
import { CalendarEventCard } from './CalendarEventCard'

const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })
const fullDate = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' })

export function CalendarView({ view, focusDate, start, end, appointments, onOpen }: { view: CalendarViewType; focusDate: Date; start: Date; end: Date; appointments: AdminAppointment[]; onOpen: (id: string) => void }) {
  const groups = groupAppointmentsByLocalDay(appointments)
  const days = view === 'day' ? [focusDate] : getCalendarDays(start, end)
  const today = formatLocalDate(new Date())
  return <div className={`amigo-calendar-grid amigo-calendar-grid-${view}`} role="grid" aria-label={`Calendário em visão de ${view === 'day' ? 'dia' : view === 'week' ? 'semana' : 'mês'}`}>
    {days.map((day) => {
      const key = formatLocalDate(day)
      const items = groups.get(key) ?? []
      const outsideMonth = view === 'month' && day.getMonth() !== focusDate.getMonth()
      return <section key={key} className="amigo-calendar-day" role="gridcell" aria-current={key === today ? 'date' : undefined} data-outside-month={outsideMonth || undefined} aria-label={fullDate.format(day)}>
        <h3><time dateTime={key}>{weekday.format(day)}</time></h3>
        <div className="amigo-calendar-day-events">{items.map((appointment) => <CalendarEventCard key={appointment.id} appointment={appointment} onOpen={onOpen} />)}{items.length === 0 && <span className="amigo-calendar-day-empty">Sem agendamentos</span>}</div>
      </section>
    })}
  </div>
}
