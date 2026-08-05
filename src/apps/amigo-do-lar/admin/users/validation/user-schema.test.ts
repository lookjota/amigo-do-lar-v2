import { describe, expect, it } from 'vitest'
import { adminUserSchema, adminUsersResponseSchema, createUserSchema, updateUserPasswordSchema, updateUserSchema } from '../types/contracts'
const user = { id: '1ad575e6-0225-45ce-bb18-296407bc558b', name: 'Admin', email: 'admin@example.com', role: 'ADMIN', isActive: true, createdAt: '2026-08-05T10:00:00.000Z', updatedAt: '2026-08-05T10:00:00.000Z' }
describe('user schemas', () => {
  it('valida respostas estritas sem credenciais', () => { expect(adminUserSchema.parse(user)).toEqual(user); expect(() => adminUserSchema.parse({ ...user, token: 'secret' })).toThrow(); expect(() => adminUsersResponseSchema.parse({ data: [user], pagination: { page: 1, limit: 20, total: 1, totalPages: 1 }, extra: true })).toThrow() })
  it('normaliza criação e rejeita campos extras', () => { expect(createUserSchema.parse({ name: '  Maria   Silva ', email: ' MARIA@EXAMPLE.COM ', password: '12345678', role: 'OPERATOR' })).toMatchObject({ name: 'Maria Silva', email: 'maria@example.com' }); expect(() => createUserSchema.parse({ name: 'Maria', email: 'maria@example.com', password: '12345678', role: 'OPERATOR', extra: true })).toThrow() })
  it('rejeita atualização vazia e senha curta', () => { expect(() => updateUserSchema.parse({})).toThrow(); expect(() => updateUserPasswordSchema.parse({ password: 'curta' })).toThrow() })
})
