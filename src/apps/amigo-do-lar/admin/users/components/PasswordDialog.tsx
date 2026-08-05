import { useEffect, useRef, useState, type FormEvent } from 'react'
import { toUserUiError } from '../user-errors'
import { updateUserPasswordSchema } from '../types/contracts'

export function PasswordDialog({ isPending, error, onSubmit, onClose }: { isPending: boolean; error?: unknown; onSubmit: (password: string) => Promise<void>; onClose: () => void }) {
  const [message, setMessage] = useState(''); const [success, setSuccess] = useState(''); const [submitError, setSubmitError] = useState<unknown>(); const formRef = useRef<HTMLFormElement>(null)
  const clearFields = () => { formRef.current?.reset() }
  useEffect(() => () => clearFields(), [])
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (isPending) return; const form = new FormData(event.currentTarget); const password = form.get('password'); const confirmation = form.get('confirmation'); const parsed = updateUserPasswordSchema.safeParse({ password }); if (!parsed.success) { clearFields(); setMessage('A senha deve ter entre 8 e 128 caracteres.'); return } if (password !== confirmation) { clearFields(); setMessage('As senhas não coincidem.'); return } setMessage(''); setSuccess(''); setSubmitError(undefined); try { await onSubmit(parsed.data.password); clearFields(); setSuccess('Senha alterada com sucesso.') } catch (caught) { clearFields(); setSubmitError(caught) } }
  function close() { clearFields(); setMessage(''); setSuccess(''); setSubmitError(undefined); onClose() }
  const visibleError = submitError ?? error
  return <section className="amigo-admin-status-update" aria-label="Alterar senha"><h3>Alterar senha</h3><form ref={formRef} onSubmit={(event) => void submit(event)}><label>Nova senha<input name="password" type="password" minLength={8} maxLength={128} autoComplete="new-password" required disabled={isPending} /></label><label>Confirmar nova senha<input name="confirmation" type="password" minLength={8} maxLength={128} autoComplete="new-password" required disabled={isPending} /></label><button type="submit" disabled={isPending}>{isPending ? 'Alterando…' : 'Alterar senha'}</button> <button type="button" disabled={isPending} onClick={close}>Cancelar</button>{message && <p role="alert" className="amigo-form-message amigo-form-message-error">{message}</p>}{visibleError !== undefined && <p role="alert" className="amigo-form-message amigo-form-message-error">{toUserUiError(visibleError)}</p>}{success && <p role="status" className="amigo-form-message amigo-form-message-success">{success}</p>}</form></section>
}
