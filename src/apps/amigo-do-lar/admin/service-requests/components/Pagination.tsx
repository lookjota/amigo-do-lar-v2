interface Props {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null
  return (
    <nav className="amigo-admin-pagination" aria-label="Paginação das solicitações">
      <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>Anterior</button>
      <span>Página {page} de {totalPages}</span>
      <button type="button" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Próxima</button>
    </nav>
  )
}
