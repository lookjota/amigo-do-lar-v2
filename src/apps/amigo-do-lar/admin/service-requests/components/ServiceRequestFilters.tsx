import { useState, type FormEvent } from 'react'
import {
  serviceRequestStatuses,
  serviceRequestStatusLabels,
  type ServiceRequestStatus,
} from '../types/contracts'

export interface ServiceRequestFilterValues {
  search?: string
  status?: ServiceRequestStatus
  createdFrom?: string
  createdTo?: string
}

interface Props {
  values: ServiceRequestFilterValues
  onApply: (values: ServiceRequestFilterValues) => void
  onClear: () => void
}

export function ServiceRequestFilters({ values, onApply, onClear }: Props) {
  const [search, setSearch] = useState(values.search ?? '')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const status = form.get('status')
    onApply({
      search: search.trim() || undefined,
      status: serviceRequestStatuses.find((item) => item === status),
      createdFrom: String(form.get('createdFrom') || '') || undefined,
      createdTo: String(form.get('createdTo') || '') || undefined,
    })
  }

  return (
    <form className="amigo-admin-filters" onSubmit={submit}>
      <label>
        Buscar
        <input
          name="search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cliente, telefone, serviço, cidade…"
        />
      </label>
      <label>
        Status
        <select name="status" defaultValue={values.status ?? ''}>
          <option value="">Todos</option>
          {serviceRequestStatuses.map((status) => (
            <option key={status} value={status}>
              {serviceRequestStatusLabels[status]}
            </option>
          ))}
        </select>
      </label>
      <label>
        Criadas a partir de
        <input name="createdFrom" type="date" defaultValue={values.createdFrom} />
      </label>
      <label>
        Criadas até
        <input name="createdTo" type="date" defaultValue={values.createdTo} />
      </label>
      <div className="amigo-admin-filter-actions">
        <button className="amigo-button" type="submit">Aplicar filtros</button>
        <button className="amigo-button amigo-button-secondary" type="button" onClick={onClear}>Limpar</button>
      </div>
    </form>
  )
}
