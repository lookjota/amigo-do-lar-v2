import type { UserRole } from '../types/contracts'
export function RoleBadge({ role }: { role: UserRole }) { return <span className={`amigo-admin-status amigo-admin-status-${role === 'ADMIN' ? 'scheduled' : 'pending'}`}>{role === 'ADMIN' ? 'Administrador' : 'Operador'}</span> }
