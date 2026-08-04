import { createContext } from 'react'
import type { AuthUser, LoginCredentials } from './contracts'

export type AuthStatus = 'initializing' | 'anonymous' | 'authenticated'

export interface AuthContextValue {
  status: AuthStatus
  user?: AuthUser
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
