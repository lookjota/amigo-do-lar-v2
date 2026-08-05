import type { CalendarView } from '../utils/calendar-range'

const labels: Record<CalendarView, string> = { day: 'Dia', week: 'Semana', month: 'Mês' }

export function CalendarToolbar({ view, title, onToday, onNavigate, onView }: { view: CalendarView; title: string; onToday: () => void; onNavigate: (direction: -1 | 1) => void; onView: (view: CalendarView) => void }) {
  return <div className="amigo-calendar-toolbar" aria-label="Controles do calendário">
    <div className="amigo-calendar-navigation"><button type="button" onClick={onToday}>Hoje</button><button type="button" onClick={() => onNavigate(-1)} aria-label="Período anterior">Anterior</button><button type="button" onClick={() => onNavigate(1)} aria-label="Próximo período">Próximo</button></div>
    <h2 aria-live="polite">{title}</h2>
    <div className="amigo-calendar-views" aria-label="Visualização">{(['day', 'week', 'month'] as const).map((item) => <button key={item} type="button" aria-pressed={view === item} onClick={() => onView(item)}>{labels[item]}</button>)}</div>
  </div>
}
