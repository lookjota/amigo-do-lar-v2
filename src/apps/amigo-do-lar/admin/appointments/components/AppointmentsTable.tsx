import type { AdminAppointment } from '../types/contracts'
import { AppointmentStatusBadge } from './AppointmentStatusBadge'

const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' })
const time = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' })
export function AppointmentsTable({ appointments, onDetails }: { appointments: AdminAppointment[]; onDetails: (id: string) => void }) {
  return <div className="amigo-admin-table-wrap"><table className="amigo-admin-table"><thead><tr><th>Data</th><th>Horário</th><th>Cliente</th><th>Serviço</th><th>Cidade</th><th>Status</th><th>Ação</th></tr></thead><tbody>{appointments.map((item) => { const scheduledAt = new Date(item.scheduledAt); return <tr key={item.id}><td data-label="Data">{date.format(scheduledAt)}</td><td data-label="Horário">{time.format(scheduledAt)}</td><td data-label="Cliente">{item.serviceRequest.customer.name}</td><td data-label="Serviço">{item.serviceRequest.service.name}</td><td data-label="Cidade">{item.serviceRequest.city ?? 'Não informada'}</td><td data-label="Status"><AppointmentStatusBadge status={item.status} /></td><td data-label="Ação"><button type="button" onClick={() => onDetails(item.id)}>Ver detalhes</button></td></tr> })}</tbody></table></div>
}
