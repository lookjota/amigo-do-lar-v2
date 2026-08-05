import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AdminPageMetadata } from '../../../components/AdminPageMetadata'
import { toUiError } from '../../../api/errors'
import { useCreateCustomer } from '../api/useCreateCustomer'
import { useCustomers } from '../api/useCustomers'
import { CustomerDetails } from '../components/CustomerDetails'
import { CustomerFilters, type CustomerFilterValues } from '../components/CustomerFilters'
import { CustomerForm } from '../components/CustomerForm'
import { CustomersTable } from '../components/CustomersTable'
import { Pagination } from '../components/Pagination'
import type { AdminCustomerFilters, CustomerSortBy, CustomerSortOrder } from '../types/contracts'

const PAGE_SIZE = 20
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const sortFields: CustomerSortBy[] = ['name', 'createdAt', 'updatedAt']
const sortOrders: CustomerSortOrder[] = ['asc', 'desc']

export function AdminCustomersPage() {
  const [params, setParams] = useSearchParams()
  const rawPage = Number(params.get('page'))
  const page = Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : 1
  const search = params.get('search')?.trim().slice(0, 120) || undefined
  const activeParam = params.get('isActive')
  const isActive = activeParam === 'true' ? true : activeParam === 'false' ? false : undefined
  const sortBy = sortFields.find((value) => value === params.get('sortBy')) ?? 'name'
  const sortOrder = sortOrders.find((value) => value === params.get('sortOrder')) ?? 'asc'
  const selectedId = uuid.test(params.get('customer') ?? '') ? params.get('customer') ?? undefined : undefined
  const showCreate = params.get('create') === '1'
  const filters = useMemo<AdminCustomerFilters>(() => ({ page, limit: PAGE_SIZE, search, isActive, sortBy, sortOrder }), [isActive, page, search, sortBy, sortOrder])
  const query = useCustomers(filters)
  const create = useCreateCustomer()
  const [success, setSuccess] = useState('')
  const updateParams = useCallback((updates: Record<string, string | undefined>) => setParams((current) => { const next = new URLSearchParams(current); Object.entries(updates).forEach(([key, value]) => { if (value) next.set(key, value); else next.delete(key) }); return next }, { replace: true, preventScrollReset: true }), [setParams])
  function applyFilters(values: CustomerFilterValues) { updateParams({ page: undefined, search: values.search, isActive: values.isActive === undefined ? undefined : String(values.isActive), sortBy: values.sortBy === 'name' ? undefined : values.sortBy, sortOrder: values.sortOrder === 'asc' ? undefined : values.sortOrder, customer: undefined }) }
  const pagination = query.data?.pagination
  useEffect(() => { if (pagination && pagination.totalPages > 0 && page > pagination.totalPages) updateParams({ page: String(pagination.totalPages) }) }, [page, pagination, updateParams])
  return <main id="conteudo-principal" className="amigo-admin-page amigo-admin-requests-page"><AdminPageMetadata title="Clientes — Amigo do Lar" /><header className="amigo-admin-header"><div><p className="amigo-eyebrow">Portal administrativo</p><h1>Gestão de clientes</h1></div><div><button className="amigo-button" type="button" onClick={() => updateParams({ create: '1', customer: undefined })}>Novo cliente</button> <Link className="amigo-button amigo-button-secondary" to="/admin">Dashboard</Link></div></header>
    <section className="amigo-admin-card" aria-label="Filtros e clientes"><CustomerFilters key={`${search ?? ''}-${String(isActive)}-${sortBy}-${sortOrder}`} values={{ search, isActive, sortBy, sortOrder }} onApply={applyFilters} onClear={() => setParams({}, { replace: true })} />{query.isFetching && <p role="status" className="amigo-admin-refresh">Atualizando clientes…</p>}{query.isError && <div role="alert" className="amigo-admin-state"><p>{toUiError(query.error).userMessage}</p><button type="button" onClick={() => void query.refetch()}>Tentar novamente</button></div>}{query.data?.data.length === 0 && <div className="amigo-admin-state"><h2>Nenhum cliente encontrado</h2><p>Ajuste ou limpe os filtros.</p></div>}{query.data && query.data.data.length > 0 && <CustomersTable customers={query.data.data} onDetails={(id) => updateParams({ customer: id, create: undefined })} />}{pagination && <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={(next) => updateParams({ page: next === 1 ? undefined : String(next), customer: undefined })} />}</section>
    {showCreate && <aside className="amigo-admin-drawer" role="dialog" aria-modal="true" aria-labelledby="create-customer-title"><div className="amigo-admin-drawer-header"><h2 id="create-customer-title">Novo cliente</h2><button type="button" onClick={() => updateParams({ create: undefined })}>Fechar</button></div><CustomerForm isPending={create.isPending} error={create.error} onSubmit={async (input) => { setSuccess(''); try { const created = await create.mutateAsync(input); updateParams({ create: undefined, customer: created.id }); setSuccess('Cliente criado com sucesso.') } catch { /* erro seguro no formulário */ } }} /></aside>}
    {selectedId && <CustomerDetails id={selectedId} onClose={() => updateParams({ customer: undefined })} />}{success && <p role="status" className="amigo-form-message amigo-form-message-success">{success}</p>}
  </main>
}
