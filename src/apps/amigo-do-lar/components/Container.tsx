import type { PropsWithChildren } from 'react'

export function Container({ children }: PropsWithChildren) {
  return <div className="amigo-container">{children}</div>
}
