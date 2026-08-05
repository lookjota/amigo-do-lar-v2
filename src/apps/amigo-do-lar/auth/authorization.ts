import type { AuthUser, UserRole } from './contracts'
export function hasRole(user: AuthUser | undefined, allowedRoles: readonly UserRole[]) { return user !== undefined && allowedRoles.includes(user.role) }
