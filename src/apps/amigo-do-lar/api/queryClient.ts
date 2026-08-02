import { QueryClient } from '@tanstack/react-query'
import {
  HttpError,
  NetworkError,
  RequestCancelledError,
  RequestTimeoutError,
} from '../../../shared/http'

const maximumRetryCount = 2

export function shouldRetryQuery(
  failureCount: number,
  error: unknown,
): boolean {
  if (failureCount >= maximumRetryCount) {
    return false
  }

  if (error instanceof RequestCancelledError) {
    return false
  }

  if (error instanceof NetworkError || error instanceof RequestTimeoutError) {
    return true
  }

  return error instanceof HttpError && error.status >= 500
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: shouldRetryQuery,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  })
}
