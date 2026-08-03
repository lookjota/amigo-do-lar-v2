import { describe, expect, it } from 'vitest'
import {
  HttpError,
  NetworkError,
  RequestTimeoutError,
} from '../../../shared/http'
import { createQueryClient, shouldRetryQuery } from './queryClient'

function httpError(status: number) {
  return new HttpError({
    status,
    statusText: 'Error',
    responseBody: undefined,
    url: 'https://api.example.com/resource',
    method: 'GET',
  })
}

describe('shouldRetryQuery', () => {
  it.each([400, 401, 403, 404])('não repete HTTP %i', (status) => {
    expect(shouldRetryQuery(0, httpError(status))).toBe(false)
  })

  it.each([
    ['rede', new NetworkError()],
    ['timeout', new RequestTimeoutError(100)],
    ['HTTP 5xx', httpError(503)],
  ])('limita retry para falha de %s', (_label, error) => {
    expect(shouldRetryQuery(0, error)).toBe(true)
    expect(shouldRetryQuery(1, error)).toBe(true)
    expect(shouldRetryQuery(2, error)).toBe(false)
  })

  it('não repete erros desconhecidos', () => {
    expect(shouldRetryQuery(0, new Error('unexpected'))).toBe(false)
  })
})

describe('createQueryClient', () => {
  it('cria caches independentes para browser, testes e SSR', () => {
    const firstClient = createQueryClient()
    const secondClient = createQueryClient()

    firstClient.setQueryData(['service', 1], { name: 'Elétrica' })

    expect(secondClient).not.toBe(firstClient)
    expect(secondClient.getQueryData(['service', 1])).toBeUndefined()
    expect(firstClient.getDefaultOptions()).toMatchObject({
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
      },
      mutations: { retry: false },
    })
  })
})
