export type UserRole = 'ADMIN' | 'OPERATOR'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  tokenType: 'Bearer'
  expiresIn: number
  user: AuthUser
}

export interface AuthSession {
  accessToken: string
  expiresAt: number
  user: AuthUser
}
