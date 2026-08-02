import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'

interface ApiProviderProps extends PropsWithChildren {
  queryClient: QueryClient
}

export function ApiProvider({ children, queryClient }: ApiProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
