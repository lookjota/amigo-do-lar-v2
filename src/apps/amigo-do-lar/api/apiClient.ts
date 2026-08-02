import { HttpClient } from '../../../shared/http'
import { apiConfig } from '../config/api'

// O provedor opcional de token será conectado aqui quando a autenticação existir.
export const apiClient = new HttpClient(apiConfig)
