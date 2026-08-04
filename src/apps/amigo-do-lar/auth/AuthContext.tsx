import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { loginRequest } from './auth-api'
import {
  AuthContext,
  type AuthContextValue,
  type AuthStatus,
} from './auth-context'
import type { AuthSession, LoginCredentials } from './contracts'
import {
  clearStoredSession,
  readStoredSession,
  storeSession,
  subscribeToSessionExpiration,
} from './sessionStorage'

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession>()
  const [status, setStatus] = useState<AuthStatus>('initializing')

  const logout = useCallback(() => {
    clearStoredSession()
    setSession(undefined)
    setStatus('anonymous')
  }, [])

  useEffect(() => {
    const storedSession = readStoredSession()
    queueMicrotask(() => {
      setSession(storedSession)
      setStatus(storedSession ? 'authenticated' : 'anonymous')
    })
  }, [])

  useEffect(() => subscribeToSessionExpiration(logout), [logout])

  useEffect(() => {
    if (!session) return undefined

    const remainingMs = session.expiresAt - Date.now()
    const timeoutId = window.setTimeout(logout, Math.max(remainingMs, 0))
    return () => window.clearTimeout(timeoutId)
  }, [logout, session])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await loginRequest(credentials)
    const nextSession = {
      accessToken: response.accessToken,
      expiresAt: Date.now() + response.expiresIn * 1_000,
      user: response.user,
    }

    storeSession(nextSession)
    setSession(nextSession)
    setStatus('authenticated')
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ status, user: session?.user, login, logout }),
    [login, logout, session?.user, status],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
