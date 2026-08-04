import { useApiHealth } from '../api/useApiHealth'

export function ApiStatus() {
  const { status, retry } = useApiHealth()

  const message =
    status === 'success'
      ? 'API online'
      : status === 'error'
        ? 'API indisponível'
        : 'Verificando API'

  return (
    <aside className="amigo-api-status" aria-label="Diagnóstico da API">
      <span aria-live="polite">{message}</span>
      {status === 'error' && (
        <button type="button" onClick={retry}>
          Tentar novamente
        </button>
      )}
    </aside>
  )
}
