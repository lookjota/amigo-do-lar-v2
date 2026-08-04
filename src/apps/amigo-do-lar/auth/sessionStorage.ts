import { z } from 'zod'
import type { AuthSession } from './contracts'

const sessionKey = 'amigo-do-lar.admin-session'
const sessionExpiredEvent = 'amigo-do-lar:session-expired'

const sessionSchema = z.object({
  accessToken: z.string().min(1),
  expiresAt: z.number().finite().positive(),
  user: z.object({
    id: z.uuid(),
    name: z.string().min(1),
    email: z.email(),
    role: z.enum(['ADMIN', 'OPERATOR']),
  }),
})

function browserStorage(): Storage | undefined {
  return typeof window === 'undefined' ? undefined : window.sessionStorage
}

export function readStoredSession(now = Date.now()): AuthSession | undefined {
  const storage = browserStorage()
  if (!storage) return undefined

  const serialized = storage.getItem(sessionKey)
  if (!serialized) return undefined

  try {
    const result = sessionSchema.safeParse(JSON.parse(serialized))
    if (!result.success || result.data.expiresAt <= now) {
      storage.removeItem(sessionKey)
      return undefined
    }

    return result.data
  } catch {
    storage.removeItem(sessionKey)
    return undefined
  }
}

export function storeSession(session: AuthSession): void {
  browserStorage()?.setItem(sessionKey, JSON.stringify(session))
}

export function clearStoredSession(): void {
  browserStorage()?.removeItem(sessionKey)
}

export function getStoredAccessToken(): string | undefined {
  return readStoredSession()?.accessToken
}

export function notifySessionExpired(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(sessionExpiredEvent))
  }
}

export function subscribeToSessionExpiration(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined

  window.addEventListener(sessionExpiredEvent, listener)
  return () => window.removeEventListener(sessionExpiredEvent, listener)
}
