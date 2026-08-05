import type { AdminCustomer } from '../types/contracts'
import { formatCustomerPhone } from '../validation/customer-schema'
import { CustomerStatusBadge } from './CustomerStatusBadge'

const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' })
export function CustomersTable({ customers, onDetails }: { customers: AdminCustomer[]; onDetails: (id: string) => void }) {
  return <div className="amigo-admin-table-wrap"><table className="amigo-admin-table"><caption className="sr-only">Clientes encontrados</caption><thead><tr><th>Nome</th><th>Telefone</th><th>E-mail</th><th>Status</th><th>Criado em</th><th>Ação</th></tr></thead><tbody>{customers.map((customer) => <tr key={customer.id}><td data-label="Nome">{customer.name}</td><td data-label="Telefone">{formatCustomerPhone(customer.phone)}</td><td data-label="E-mail">{customer.email ?? 'Não informado'}</td><td data-label="Status"><CustomerStatusBadge isActive={customer.isActive} /></td><td data-label="Criado em">{date.format(new Date(customer.createdAt))}</td><td><button type="button" onClick={() => onDetails(customer.id)} aria-label={`Ver detalhes de ${customer.name}`}>Detalhes</button></td></tr>)}</tbody></table></div>
}
