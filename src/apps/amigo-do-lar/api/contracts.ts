/**
 * Contratos provisórios até que o backend publique seu contrato definitivo.
 * Módulos de endpoint podem retornar payloads próprios quando a API não usar
 * envelope ou paginação.
 */
export interface ApiResponse<Data> {
  data: Data
}

export interface ApiFieldError {
  field: string
  message: string
  code?: string
}

export interface ApiErrorResponse {
  message?: string
  code?: string
  fieldErrors?: ApiFieldError[]
}

export interface PaginationMetadata {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}
