import { useState, type FormEvent } from 'react'
import { toUiError } from '../../../api/errors'
import type { AdminCustomer, CreateCustomerInput } from '../types/contracts'
import { createCustomerSchema } from '../validation/customer-schema'

export function CustomerForm({ customer, isPending, error, onSubmit }: { customer?: AdminCustomer; isPending: boolean; error?: unknown; onSubmit: (input: CreateCustomerInput) => Promise<void> }) {
  const [message, setMessage] = useState('')
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isPending) return
    const form = new FormData(event.currentTarget)
    const parsed = createCustomerSchema.safeParse({ name: form.get('name'), phone: form.get('phone'), email: form.get('email') })
    if (!parsed.success) { const field = parsed.error.issues[0]?.path[0]; setMessage(field === 'phone' ? 'Informe um telefone com DDD e 10 ou 11 dígitos.' : field === 'email' ? 'Informe um e-mail válido.' : 'Informe um nome entre 2 e 120 caracteres.'); return }
    setMessage('')
    await onSubmit(parsed.data)
  }
  return <form onSubmit={(event) => void submit(event)} aria-label={customer ? 'Editar cliente' : 'Criar cliente'}>
    <label>Nome<input name="name" defaultValue={customer?.name ?? ''} minLength={2} maxLength={120} required disabled={isPending} /></label>
    <label>Telefone<input name="phone" type="tel" defaultValue={customer?.phone ?? ''} maxLength={30} required disabled={isPending} /></label>
    <label>E-mail<input name="email" type="email" defaultValue={customer?.email ?? ''} maxLength={320} disabled={isPending} /></label>
    <button className="amigo-button" type="submit" disabled={isPending}>{isPending ? 'Salvando…' : customer ? 'Salvar alterações' : 'Criar cliente'}</button>
    {message && <p role="alert" className="amigo-form-message amigo-form-message-error">{message}</p>}
    {error !== undefined && <p role="alert" className="amigo-form-message amigo-form-message-error">{toUiError(error).userMessage}</p>}
  </form>
}
