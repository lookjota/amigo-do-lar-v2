import { describe, expect, it } from 'vitest'
import {
  HttpError,
  NetworkError,
  RequestTimeoutError,
} from '../../../shared/http'
import { toUiError } from './errors'

function httpError(status: number, responseBody?: unknown) {
  return new HttpError({
    status,
    statusText: 'Error',
    responseBody,
    url: 'https://api.example.com/resource',
    method: 'GET',
  })
}

describe('toUiError', () => {
  it.each([
    [400, 'validation'],
    [422, 'validation'],
    [401, 'unauthorized'],
    [403, 'forbidden'],
    [404, 'notFound'],
    [409, 'conflict'],
    [500, 'unavailable'],
    [503, 'unavailable'],
    [418, 'unknown'],
  ] as const)('mapeia HTTP %i para %s', (status, category) => {
    expect(toUiError(httpError(status))).toMatchObject({ status, category })
  })

  it('preserva erros de campo válidos em falhas de validação', () => {
    const fieldErrors = [{ field: 'email', message: 'E-mail inválido' }]

    expect(toUiError(httpError(400, { fieldErrors }))).toMatchObject({
      category: 'validation',
      fieldErrors,
    })
  })

  it('mapeia timeout, rede e erro desconhecido', () => {
    expect(toUiError(new RequestTimeoutError(100))).toMatchObject({
      category: 'timeout',
    })
    expect(toUiError(new NetworkError())).toMatchObject({
      category: 'network',
    })
    expect(toUiError(new Error('unexpected'))).toMatchObject({
      category: 'unknown',
    })
  })
})
