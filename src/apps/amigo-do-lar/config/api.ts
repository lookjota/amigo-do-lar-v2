import { z } from 'zod'

const developmentApiUrl = 'http://localhost:3000/api/v1'

const apiEnvironmentSchema = z.object({
  VITE_API_URL: z
    .string()
    .trim()
    .url('VITE_API_URL deve ser uma URL absoluta válida.')
    .optional(),
})

function createApiConfig(environment: ImportMetaEnv) {
  const result = apiEnvironmentSchema.safeParse({
    VITE_API_URL: environment.VITE_API_URL || undefined,
  })

  if (!result.success) {
    const issue = result.error.issues[0]
    throw new Error(
      `Configuração inválida da Amigo do Lar API: ${issue?.message ?? 'verifique VITE_API_URL.'}`,
    )
  }

  return {
    baseUrl: (result.data.VITE_API_URL ?? developmentApiUrl).replace(
      /\/+$/,
      '',
    ),
    timeoutMs: 10_000,
  } as const
}

export const apiConfig = createApiConfig(import.meta.env)
