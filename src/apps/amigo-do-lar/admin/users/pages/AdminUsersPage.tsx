import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AdminPageMetadata } from '../../../components/AdminPageMetadata'
import { useCreateUser } from '../api/useCreateUser'
import { useUsers } from '../api/useUsers'
import { Pagination } from '../components/Pagination'
import { UserDetails } from '../components/UserDetails'
import { UserFilters, type UserFilterValues } from '../components/UserFilters'
import { UserForm } from '../components/UserForm'
import { UsersTable } from '../components/UsersTable'
import { createUserSchema, type AdminUserFilters, type UserOrderBy, type UserRole, type UserSortOrder } from '../types/contracts'
import { toUserUiError } from '../user-errors'
const PAGE_SIZE = 20
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const roles: UserRole[] = ['ADMIN', 'OPERATOR']; const orderFields: UserOrderBy[] = ['name', 'email', 'role', 'isActive', 'createdAt', 'updatedAt']; const sortOrders: UserSortOrder[] = ['asc', 'desc']
export function AdminUsersPage() {
  const [params, setParams] = useSearchParams(); const rawPage = Number(params.get('page')); const page = Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : 1; const search = params.get('search')?.trim().slice(0, 120) || undefined; const role = roles.find((value) => value === params.get('role')); const activeParam = params.get('isActive'); const isActive = activeParam === 'true' ? true : activeParam === 'false' ? false : undefined; const orderBy = orderFields.find((value) => value === params.get('orderBy')) ?? 'name'; const sortOrder = sortOrders.find((value) => value === params.get('sortOrder')) ?? 'asc'; const selectedId = uuid.test(params.get('user') ?? '') ? params.get('user') ?? undefined : undefined; const showCreate = params.get('create') === '1'; const filters = useMemo<AdminUserFilters>(() => ({ page, limit: PAGE_SIZE, search, role, isActive, orderBy, sortOrder }), [isActive, orderBy, page, role, search, sortOrder]); const query = useUsers(filters); const create = useCreateUser(); const [success, setSuccess] = useState('')
  const updateParams = useCallback((updates: Record<string, string | undefined>) => setParams((current) => { const next = new URLSearchParams(current); Object.entries(updates).forEach(([key, value]) => { if (value) next.set(key, value); else next.delete(key) }); return next }, { replace: true, preventScrollReset: true }), [setParams])
  function applyFilters(values: UserFilterValues) { updateParams({ page: undefined, search: values.search, role: values.role, isActive: values.isActive === undefined ? undefined : String(values.isActive), orderBy: values.orderBy === 'name' ? undefined : values.orderBy, sortOrder: values.sortOrder === 'asc' ? undefined : values.sortOrder, user: undefined }) }
  const pagination = query.data?.pagination; useEffect(() => { if (pagination && pagination.totalPages > 0 && page > pagination.totalPages) updateParams({ page: String(pagination.totalPages) }) }, [page, pagination, updateParams])
  async function createUser(input: Parameters<typeof UserForm>[0]['onSubmit'] extends (value: infer Value) => Promise<void> ? Value : never) {
    setSuccess('')
    try {
      const created = await create.mutateAsync(createUserSchema.parse(input))
      updateParams({ create: undefined, user: created.id })
      setSuccess('Usuário criado com sucesso.')
    } catch { /* mensagem segura no formulário */ }
  }
  return (
    <main id="conteudo-principal" className="amigo-admin-page amigo-admin-requests-page">
      <AdminPageMetadata title="Usuários — Amigo do Lar" />
      <header className="amigo-admin-header">
        <div><p className="amigo-eyebrow">Portal administrativo</p><h1>Gestão de usuários</h1></div>
        <div><button className="amigo-button" type="button" onClick={() => updateParams({ create: '1', user: undefined })}>Novo usuário</button> <Link className="amigo-button amigo-button-secondary" to="/admin">Dashboard</Link></div>
      </header>
      <section className="amigo-admin-card" aria-label="Filtros e usuários">
        <UserFilters key={`${search ?? ''}-${role ?? ''}-${String(isActive)}-${orderBy}-${sortOrder}`} values={{ search, role, isActive, orderBy, sortOrder }} onApply={applyFilters} onClear={() => setParams({}, { replace: true })} />
        {query.isFetching && <p role="status" className="amigo-admin-refresh">Atualizando usuários…</p>}
        {query.isError && <div role="alert" className="amigo-admin-state"><p>{toUserUiError(query.error)}</p><button type="button" onClick={() => void query.refetch()}>Tentar novamente</button></div>}
        {query.data?.data.length === 0 && <div className="amigo-admin-state"><h2>Nenhum usuário encontrado</h2><p>Ajuste ou limpe os filtros.</p></div>}
        {query.data && query.data.data.length > 0 && <UsersTable users={query.data.data} onDetails={(id) => updateParams({ user: id, create: undefined })} />}
        {pagination && <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={(next) => updateParams({ page: next === 1 ? undefined : String(next), user: undefined })} />}
      </section>
      {showCreate && <aside className="amigo-admin-drawer" role="dialog" aria-modal="true" aria-labelledby="create-user-title"><div className="amigo-admin-drawer-header"><h2 id="create-user-title">Novo usuário</h2><button type="button" onClick={() => updateParams({ create: undefined })}>Fechar</button></div><UserForm isPending={create.isPending} error={create.error} onSubmit={createUser} /></aside>}
      {selectedId && <UserDetails id={selectedId} onClose={() => updateParams({ user: undefined })} />}
      {success && <p role="status" className="amigo-form-message amigo-form-message-success">{success}</p>}
    </main>
  )
}
