import { z } from 'zod'

const publicEnvironmentSchema = z.object({
  VITE_API_URL: z.string().trim().url(),
  VITE_PUBLIC_SITE_URL: z.string().trim().url(),
  VITE_WHATSAPP_NUMBER: z.string().trim().regex(/^\d+$/),
  VITE_GA4_ID: z.string().trim().optional(),
  VITE_CLARITY_ID: z.string().trim().optional(),
})

const defaults = {
  VITE_API_URL: 'https://amigo-do-lar-api-production.up.railway.app',
  VITE_PUBLIC_SITE_URL: 'https://amigo-do-lar-v2.vercel.app',
  VITE_WHATSAPP_NUMBER: '5561995646646',
} as const

function optionalValue(value: string | undefined): string | undefined {
  const normalized = value?.trim()
  return normalized || undefined
}

function withoutTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, '')
}

export function createPublicConfig(environment: ImportMetaEnv) {
  const result = publicEnvironmentSchema.safeParse({
    VITE_API_URL: optionalValue(environment.VITE_API_URL) ?? defaults.VITE_API_URL,
    VITE_PUBLIC_SITE_URL:
      optionalValue(environment.VITE_PUBLIC_SITE_URL) ??
      defaults.VITE_PUBLIC_SITE_URL,
    VITE_WHATSAPP_NUMBER:
      optionalValue(environment.VITE_WHATSAPP_NUMBER) ??
      defaults.VITE_WHATSAPP_NUMBER,
    VITE_GA4_ID: optionalValue(environment.VITE_GA4_ID),
    VITE_CLARITY_ID: optionalValue(environment.VITE_CLARITY_ID),
  })

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `${String(issue.path[0])}: ${issue.message}`)
      .join('; ')
    throw new Error(`Configuração pública inválida: ${issues}`)
  }

  return {
    apiUrl: withoutTrailingSlashes(result.data.VITE_API_URL),
    publicSiteUrl: withoutTrailingSlashes(result.data.VITE_PUBLIC_SITE_URL),
    whatsappNumber: result.data.VITE_WHATSAPP_NUMBER,
    ga4Id: result.data.VITE_GA4_ID,
    clarityId: result.data.VITE_CLARITY_ID,
  } as const
}

export const publicConfig = createPublicConfig(import.meta.env)
