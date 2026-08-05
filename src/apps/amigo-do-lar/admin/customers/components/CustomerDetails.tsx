import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../auth/useAuth'
import { toUiError } from '../../../api/errors'
import { useCustomer } from '../api/useCustomer'
import { useUpdateCustomer } from '../api/useUpdateCustomer'
import { useUpdateCustomerStatus } from '../api/useUpdateCustomerStatus'
import { formatCustomerPhone, isValidCustomerEmail, isValidCustomerPhone } from '../validation/customer-schema'
import { CustomerForm } from './CustomerForm'
import { CustomerStatusBadge } from './CustomerStatusBadge'

const dateTime = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' })
export function CustomerDetails({ id, onClose }: { id: string; onClose: () => void }) {
  const auth = useAuth()
  const query = useCustomer(id)
  const update = useUpdateCustomer(id)
  const status = useUpdateCustomerStatus(id)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [success, setSuccess] = useState('')
  useEffect(() => { closeRef.current?.focus(); const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }; document.addEventListener('keydown', escape); return () => document.removeEventListener('keydown', escape) }, [onClose])
  const customer = query.data
  async function changeStatus() { if (!customer || status.isPending) return; const next = !customer.isActive; if (!window.confirm(`${next ? 'Reativar' : 'Desativar'} este cliente?`)) return; setSuccess(''); try { await status.mutateAsync({ isActive: next }); setSuccess(`Cliente ${next ? 'reativado' : 'desativado'} com sucesso.`) } catch { /* erro seguro abaixo */ } }
  return <aside className="amigo-admin-drawer" role="dialog" aria-modal="true" aria-labelledby="customer-title"><div className="amigo-admin-drawer-header"><h2 id="customer-title">Detalhes do cliente</h2><button ref={closeRef} type="button" onClick={onClose}>Fechar</button></div>
    {query.isPending && <p role="status">Carregando detalhes…</p>}{query.isError && <div role="alert" className="amigo-admin-state"><p>{toUiError(query.error).userMessage}</p><button type="button" onClick={() => void query.refetch()}>Tentar novamente</button></div>}
    {customer && <><dl className="amigo-admin-details-list"><div><dt>Nome</dt><dd>{customer.name}</dd></div><div><dt>Telefone</dt><dd>{isValidCustomerPhone(customer.phone) ? <a href={`tel:+55${customer.phone}`}>{formatCustomerPhone(customer.phone)}</a> : formatCustomerPhone(customer.phone)}</dd></div><div><dt>E-mail</dt><dd>{isValidCustomerEmail(customer.email) ? <a href={`mailto:${customer.email}`}>{customer.email}</a> : 'Não informado'}</dd></div><div><dt>Status</dt><dd><CustomerStatusBadge isActive={customer.isActive} /></dd></div><div><dt>Criado em</dt><dd>{dateTime.format(new Date(customer.createdAt))}</dd></div><div><dt>Atualizado em</dt><dd>{dateTime.format(new Date(customer.updatedAt))}</dd></div></dl>
      <section><h3>Editar dados</h3><CustomerForm customer={customer} isPending={update.isPending} error={update.error} onSubmit={async (input) => { setSuccess(''); try { await update.mutateAsync(input); setSuccess('Cliente atualizado com sucesso.') } catch { /* erro seguro no formulário */ } }} /></section>
      {auth.user?.role === 'ADMIN' && <section className="amigo-admin-status-update"><h3>{customer.isActive ? 'Desativar cliente' : 'Reativar cliente'}</h3><p>Esta alteração preserva o cadastro e o histórico existente.</p><button type="button" disabled={status.isPending} onClick={() => void changeStatus()}>{status.isPending ? 'Atualizando…' : customer.isActive ? 'Desativar cliente' : 'Reativar cliente'}</button>{status.isError && <p role="alert" className="amigo-form-message amigo-form-message-error">{toUiError(status.error).userMessage}</p>}</section>}
      <section><h3>Histórico relacionado</h3><p>A API não retorna histórico agregado neste detalhe. Consulte as telas operacionais usando os filtros reais por cliente.</p><p><Link to={`/admin/solicitacoes?customerId=${encodeURIComponent(customer.id)}`}>Ver solicitações</Link> · <Link to={`/admin/agenda?customerId=${encodeURIComponent(customer.id)}`}>Ver agendamentos</Link></p></section>
      {success && <p role="status" className="amigo-form-message amigo-form-message-success">{success}</p>}</>}
  </aside>
}
