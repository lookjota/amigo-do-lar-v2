import { z } from 'zod'
import { apiClient } from '../api/apiClient'
import type { LoginCredentials, LoginResponse } from './contracts'

const loginResponseSchema = z.object({
  accessToken: z.string().min(1),
  tokenType: z.literal('Bearer'),
  expiresIn: z.number().int().positive(),
  user: z.object({
    id: z.uuid(),
    name: z.string().min(1),
    email: z.email(),
    role: z.enum(['ADMIN', 'OPERATOR']),
  }),
})

export class InvalidAuthResponseError extends Error {
  constructor() {
    super('A API retornou uma resposta de autenticação inválida.')
    this.name = 'InvalidAuthResponseError'
  }
}

export async function loginRequest(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await apiClient.post<unknown>('/auth/login', credentials)
  const result = loginResponseSchema.safeParse(response)

  if (!result.success) throw new InvalidAuthResponseError()
  return result.data
}
