import { apiClient } from '../../api/apiClient'
import type {
  CreateQuoteRequestInput,
  CreateQuoteRequestResponse,
} from './contracts'

export function createQuoteRequest(
  input: CreateQuoteRequestInput,
): Promise<CreateQuoteRequestResponse> {
  return apiClient.post<CreateQuoteRequestResponse>('/quote-requests', input)
}
