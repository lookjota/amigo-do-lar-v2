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
