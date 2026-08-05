export function CalendarEmptyState({ onCreate }: { onCreate?: () => void }) {
  return <div className="amigo-admin-state amigo-calendar-empty"><h2>Período sem agendamentos</h2><p>Não há atendimentos agendados no intervalo visível.</p>{onCreate && <button type="button" onClick={onCreate}>Criar primeiro agendamento</button>}</div>
}
