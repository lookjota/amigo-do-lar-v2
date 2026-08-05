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
        userMessage: 'O conteúdo solicitado não foi encontrado.',
      }
    case 409:
      return {
        ...base,
        category: 'conflict',
        userMessage: error.code === 'APPOINTMENT_TIME_CONFLICT'
          ? 'Este horário conflita com outro agendamento. Escolha outro horário.'
          : 'Os dados foram alterados. Atualize e tente novamente.',
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
