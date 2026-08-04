import { describe, expect, it, vi } from 'vitest'
import { HttpError } from '../../../shared/http'
import { apiClient } from '../api/apiClient'
import { InvalidAuthResponseError, loginRequest } from './auth-api'

describe('loginRequest', () => {
  it('preserva o erro padronizado de credenciais da API', async () => {
    vi.spyOn(apiClient, 'post').mockRejectedValue(
      new HttpError({
        status: 401,
        statusText: 'Unauthorized',
        responseBody: {
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
            statusCode: 401,
            details: [],
          },
        },
        method: 'POST',
        url: 'https://api.example.com/auth/login',
      }),
    )

    await expect(
      loginRequest({ email: 'admin@example.com', password: 'wrong' }),
    ).rejects.toMatchObject({ status: 401, code: 'INVALID_CREDENTIALS' })
  })

  it('rejeita resposta de sucesso fora do contrato', async () => {
    vi.spyOn(apiClient, 'post').mockResolvedValue({ token: 'unexpected' })

    await expect(
      loginRequest({ email: 'admin@example.com', password: 'secret' }),
    ).rejects.toBeInstanceOf(InvalidAuthResponseError)
  })
})
