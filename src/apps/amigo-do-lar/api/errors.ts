import {
  HttpError,
  NetworkError,
  RequestCancelledError,
  RequestTimeoutError,
} from '../../../shared/http'
import type { ApiErrorResponse, ApiFieldError } from './contracts'

export type UiErrorCategory =
  | 'validation'
  | 'unauthorized'
  | 'forbidden'
  | 'notFound'
  | 'conflict'
  | 'timeout'
  | 'unavailable'
  | 'network'
  | 'cancelled'
  | 'unknown'

export interface UiError {
  category: UiErrorCategory
  userMessage: string
  status?: number
  fieldErrors?: ApiFieldError[]
  originalError: unknown
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Record<string, unknown>
  const fieldErrors = candidate.fieldErrors
  const hasValidFieldErrors =
    fieldErrors === undefined ||
    (Array.isArray(fieldErrors) &&
      fieldErrors.every((fieldError) => {
        if (!fieldError || typeof fieldError !== 'object') {
          return false
        }

        const item = fieldError as Record<string, unknown>
        return (
          typeof item.field === 'string' &&
          typeof item.message === 'string' &&
          (item.code === undefined || typeof item.code === 'string')
        )
      }))

  return (
    hasValidFieldErrors &&
    (candidate.message === undefined || typeof candidate.message === 'string')
  )
}

function fromHttpError(error: HttpError): UiError {
  const apiError = isApiErrorResponse(error.responseBody)
    ? error.responseBody
    : undefined
  const base = {
    status: error.status,
    fieldErrors: apiError?.fieldErrors,
    originalError: error,
  }

  switch (error.status) {
    case 400:
    case 422:
      return {
        ...base,
        category: 'validation',
        userMessage: 'Revise os dados informados e tente novamente.',
      }
    case 401:
      return {
        ...base,
        category: 'unauthorized',
        userMessage: 'Sua sessão não é válida. Entre novamente.',
      }
    case 403:
      return {
        ...base,
        category: 'forbidden',
        userMessage: 'Você não tem permissão para realizar esta ação.',
      }
    case 404:
      return {
        ...base,
        category: 'notFound',
        userMessage: error.code === 'NOTIFICATION_NOT_FOUND'
          ? 'A notificação não foi encontrada ou não está mais disponível.'
          : error.code === 'QUOTE_NOT_FOUND'
          ? 'O orçamento não foi encontrado.'
          : error.code === 'PAYMENT_NOT_FOUND'
            ? 'O pagamento não foi encontrado.'
            : 'O conteúdo solicitado não foi encontrado.',
      }
    case 409:
      {
        const financeMessages: Record<string, string> = {
          QUOTE_ALREADY_EXISTS: 'Esta solicitação já possui um orçamento.',
          QUOTE_INVALID_STATUS_TRANSITION: 'Esta alteração de status do orçamento não é permitida.',
          QUOTE_NOT_EDITABLE: 'Somente orçamentos em rascunho podem ser editados.',
          QUOTE_DISCOUNT_EXCEEDS_SUBTOTAL: 'O desconto não pode superar o subtotal.',
          QUOTE_HAS_PAID_PAYMENTS: 'O orçamento possui pagamentos confirmados e não pode ser cancelado.',
          PAYMENT_INVALID_STATUS_TRANSITION: 'Esta alteração de status do pagamento não é permitida.',
          PAYMENT_EXCEEDS_REMAINING_AMOUNT: 'O pagamento supera o saldo restante do orçamento.',
          PAYMENT_REQUIRES_APPROVED_QUOTE: 'O orçamento precisa estar aprovado para receber pagamentos.',
          PAYMENT_ALREADY_FINAL: 'Este pagamento já está em um estado final.',
          FINANCE_CONCURRENT_UPDATE: 'Os dados financeiros foram alterados por outra operação. Atualize e tente novamente.',
          SERVICE_REQUEST_INVALID_STATUS_FOR_QUOTE: 'A solicitação não está em um estado válido para orçamento.',
          SERVICE_REQUEST_STATUS_CHANGED: 'O status da solicitação mudou. Atualize e tente novamente.',
        }
        if (error.code && financeMessages[error.code]) return { ...base, category: 'conflict', userMessage: financeMessages[error.code] }
      return {
        ...base,
        category: 'conflict',
        userMessage: error.code === 'APPOINTMENT_TIME_CONFLICT'
          ? 'Este horário conflita com outro agendamento. Escolha outro horário.'
          : error.code === 'APPOINTMENT_ALREADY_EXISTS'
            ? 'Esta solicitação já possui um agendamento ativo.'
            : error.code === 'SERVICE_REQUEST_NOT_APPROVED'
              ? 'A solicitação precisa estar aprovada para ser agendada.'
              : error.code === 'SERVICE_REQUEST_ALREADY_COMPLETED' || error.code === 'SERVICE_REQUEST_CANCELLED'
                ? 'Esta solicitação não pode mais ser agendada.'
                : 'A operação conflita com o estado atual. Atualize e tente novamente.',
      }
      }
    default:
      return {
        ...base,
        category: error.status >= 500 ? 'unavailable' : 'unknown',
        userMessage:
          error.status >= 500
            ? 'O serviço está temporariamente indisponível. Tente novamente.'
            : 'Não foi possível concluir a operação. Tente novamente.',
      }
  }
}

export function toUiError(error: unknown): UiError {
  if (error instanceof HttpError) {
    return fromHttpError(error)
  }

  if (error instanceof RequestTimeoutError) {
    return {
      category: 'timeout',
      userMessage: 'O serviço demorou para responder. Tente novamente.',
      originalError: error,
    }
  }

  if (error instanceof NetworkError) {
    return {
      category: 'network',
      userMessage: 'Verifique sua conexão e tente novamente.',
      originalError: error,
    }
  }

  if (error instanceof RequestCancelledError) {
    return {
      category: 'cancelled',
      userMessage: 'A operação foi cancelada.',
      originalError: error,
    }
  }

  return {
    category: 'unknown',
    userMessage: 'Ocorreu um erro inesperado. Tente novamente.',
    originalError: error,
  }
}
