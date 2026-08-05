import { describe, expect, it } from 'vitest'
import { adminRoutes } from './adminRoutes'

describe('rota administrativa de agenda', () => {
  it('é prerenderizada somente como estrutura noindex e nofollow', () => {
    expect(adminRoutes.find((route) => route.pathname === '/admin/agenda')).toMatchObject({ prerender: true, robots: { index: false, follow: false } })
  })
})

describe('rota administrativa de clientes', () => {
  it('é prerenderizada somente como estrutura noindex e nofollow', () => {
    expect(adminRoutes.find((route) => route.pathname === '/admin/clientes')).toMatchObject({ prerender: true, robots: { index: false, follow: false } })
  })
})

describe('rota administrativa de serviços', () => {
  it('é prerenderizada somente como estrutura noindex e nofollow', () => {
    expect(adminRoutes.find((route) => route.pathname === '/admin/servicos')).toMatchObject({ prerender: true, robots: { index: false, follow: false } })
  })
})

describe('rota administrativa de usuários', () => {
  it('é prerenderizada somente como estrutura noindex e nofollow', () => {
    expect(adminRoutes.find((route) => route.pathname === '/admin/usuarios')).toMatchObject({ prerender: true, robots: { index: false, follow: false } })
  })
})

describe('SEO das rotas administrativas', () => {
  it('mantém todas as rotas fora de indexação e prontas para prerender', () => {
    expect(adminRoutes).not.toHaveLength(0)
    expect(adminRoutes.every((route) => route.prerender && !route.robots.index && !route.robots.follow)).toBe(true)
    expect(adminRoutes.map((route) => route.pathname)).toContain('/admin/login')
  })
})
