import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AdminPageMetadata } from '../../../components/AdminPageMetadata'
import { toUiError } from '../../../api/errors'
import { useAuth } from '../../../auth/useAuth'
import { useAdminServices } from '../api/useAdminServices'
import { useCreateService } from '../api/useCreateService'
import { Pagination } from '../components/Pagination'
import { ServiceDetails } from '../components/ServiceDetails'
import { ServiceFilters, type ServiceFilterValues } from '../components/ServiceFilters'
import { ServiceForm } from '../components/ServiceForm'
import { ServicesTable } from '../components/ServicesTable'
import type { AdminServiceFilters, ServiceOrderBy, ServiceSortOrder } from '../types/contracts'
const PAGE_SIZE = 20
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const orderFields: ServiceOrderBy[] = ['name', 'createdAt']; const sortOrders: ServiceSortOrder[] = ['asc', 'desc']
export function AdminServicesPage() {
  const auth = useAuth(); const [params, setParams] = useSearchParams(); const rawPage = Number(params.get('page')); const page = Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : 1; const search = params.get('search')?.trim().slice(0, 120) || undefined; const category = params.get('category')?.trim().slice(0, 100) || undefined; const activeParam = params.get('isActive'); const isActive = activeParam === 'true' ? true : activeParam === 'false' ? false : undefined; const orderBy = orderFields.find((value) => value === params.get('orderBy')) ?? 'name'; const sortOrder = sortOrders.find((value) => value === params.get('sortOrder')) ?? 'asc'; const selectedSlug = slugPattern.test(params.get('service') ?? '') ? params.get('service') ?? undefined : undefined; const showCreate = params.get('create') === '1' && auth.user?.role === 'ADMIN'; const filters = useMemo<AdminServiceFilters>(() => ({ page, limit: PAGE_SIZE, search, category, isActive, orderBy, sortOrder }), [category, isActive, orderBy, page, search, sortOrder]); const query = useAdminServices(filters); const create = useCreateService(); const [success, setSuccess] = useState('')
  const updateParams = useCallback((updates: Record<string, string | undefined>) => setParams((current) => { const next = new URLSearchParams(current); Object.entries(updates).forEach(([key, value]) => { if (value) next.set(key, value); else next.delete(key) }); return next }, { replace: true, preventScrollReset: true }), [setParams])
  function applyFilters(values: ServiceFilterValues) { updateParams({ page: undefined, search: values.search, category: values.category, isActive: values.isActive === undefined ? undefined : String(values.isActive), orderBy: values.orderBy === 'name' ? undefined : values.orderBy, sortOrder: values.sortOrder === 'asc' ? undefined : values.sortOrder, service: undefined }) }
  const pagination = query.data?.pagination; useEffect(() => { if (pagination && pagination.totalPages > 0 && page > pagination.totalPages) updateParams({ page: String(pagination.totalPages) }) }, [page, pagination, updateParams])
  return (
    <main id="conteudo-principal" className="amigo-admin-page amigo-admin-requests-page">
      <AdminPageMetadata title="Serviços — Amigo do Lar" />
      <header className="amigo-admin-header">
        <div><p className="amigo-eyebrow">Portal administrativo</p><h1>Gestão de serviços</h1></div>
        <div>{auth.user?.role === 'ADMIN' && <button className="amigo-button" type="button" onClick={() => updateParams({ create: '1', service: undefined })}>Novo serviço</button>} <Link className="amigo-button amigo-button-secondary" to="/admin">Dashboard</Link></div>
      </header>
      <section className="amigo-admin-card" aria-label="Filtros e serviços">
        <ServiceFilters key={`${search ?? ''}-${category ?? ''}-${String(isActive)}-${orderBy}-${sortOrder}`} values={{ search, category, isActive, orderBy, sortOrder }} onApply={applyFilters} onClear={() => setParams({}, { replace: true })} />
        {query.isFetching && <p role="status" className="amigo-admin-refresh">Atualizando serviços…</p>}
        {query.isError && <div role="alert" className="amigo-admin-state"><p>{toUiError(query.error).userMessage}</p><button type="button" onClick={() => void query.refetch()}>Tentar novamente</button></div>}
        {query.data?.data.length === 0 && <div className="amigo-admin-state"><h2>Nenhum serviço encontrado</h2><p>Ajuste ou limpe os filtros.</p></div>}
        {query.data && query.data.data.length > 0 && <ServicesTable services={query.data.data} onDetails={(slug) => updateParams({ service: slug, create: undefined })} />}
        {pagination && <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={(next) => updateParams({ page: next === 1 ? undefined : String(next), service: undefined })} />}
      </section>
      {showCreate && <aside className="amigo-admin-drawer" role="dialog" aria-modal="true" aria-labelledby="create-service-title"><div className="amigo-admin-drawer-header"><h2 id="create-service-title">Novo serviço operacional</h2><button type="button" onClick={() => updateParams({ create: undefined })}>Fechar</button></div><p>Criar um serviço na API não publica automaticamente uma página no site.</p><ServiceForm isPending={create.isPending} error={create.error} onSubmit={async (input) => { setSuccess(''); try { const created = await create.mutateAsync(input); updateParams({ create: undefined, service: created.slug }); setSuccess('Serviço criado com sucesso. Nenhuma página pública foi publicada.') } catch { /* erro seguro no formulário */ } }} /></aside>}
      {selectedSlug && <ServiceDetails slug={selectedSlug} onClose={() => updateParams({ service: undefined })} onSlugChange={(slug) => updateParams({ service: slug })} />}
      {success && <p role="status" className="amigo-form-message amigo-form-message-success">{success}</p>}
    </main>
  )
}
