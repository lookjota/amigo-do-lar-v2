import { useState, type FormEvent } from 'react'
import type { CustomerSortBy, CustomerSortOrder } from '../types/contracts'

export interface CustomerFilterValues { search?: string; isActive?: boolean; sortBy: CustomerSortBy; sortOrder: CustomerSortOrder }
export function CustomerFilters({ values, onApply, onClear }: { values: CustomerFilterValues; onApply: (values: CustomerFilterValues) => void; onClear: () => void }) {
  const [search, setSearch] = useState(values.search ?? '')
  const [active, setActive] = useState(values.isActive === undefined ? '' : String(values.isActive))
  const [sortBy, setSortBy] = useState<CustomerSortBy>(values.sortBy)
  const [sortOrder, setSortOrder] = useState<CustomerSortOrder>(values.sortOrder)
  function submit(event: FormEvent) { event.preventDefault(); onApply({ search: search.trim() || undefined, isActive: active === '' ? undefined : active === 'true', sortBy, sortOrder }) }
  return <form className="amigo-admin-filters" aria-label="Filtros de clientes" onSubmit={submit}>
    <label>Buscar<input aria-label="Buscar" value={search} maxLength={120} onChange={(event) => setSearch(event.target.value)} placeholder="Nome, telefone ou e-mail" /></label>
    <label>Status<select aria-label="Status" value={active} onChange={(event) => setActive(event.target.value)}><option value="">Todos</option><option value="true">Ativos</option><option value="false">Inativos</option></select></label>
    <label>Ordenar por<select aria-label="Ordenar por" value={sortBy} onChange={(event) => setSortBy(event.target.value as CustomerSortBy)}><option value="name">Nome</option><option value="createdAt">Cadastro</option><option value="updatedAt">Atualização</option></select></label>
    <label>Ordem<select aria-label="Ordem" value={sortOrder} onChange={(event) => setSortOrder(event.target.value as CustomerSortOrder)}><option value="asc">Crescente</option><option value="desc">Decrescente</option></select></label>
    <button type="submit">Aplicar filtros</button><button type="button" onClick={onClear}>Limpar</button>
  </form>
}
