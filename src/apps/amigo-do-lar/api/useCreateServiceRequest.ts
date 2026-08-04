import { useCallback, useEffect, useRef, useState } from 'react'
import { RequestCancelledError } from '../../../shared/http'
import { toUiError, type UiError } from './errors'
import { createServiceRequest, type CreateServiceRequestInput } from './service-requests-api'

export type ServiceRequestMutationStatus = 'idle' | 'submitting' | 'success' | 'error'

export function useCreateServiceRequest() {
  const active = useRef<AbortController | undefined>(undefined)
  const mounted = useRef(true)
  const [status, setStatus] = useState<ServiceRequestMutationStatus>('idle')
  const [error, setError] = useState<UiError>()

  useEffect(() => () => { mounted.current = false; active.current?.abort() }, [])

  const submit = useCallback(async (input: CreateServiceRequestInput) => {
    if (active.current) return undefined
    const controller = new AbortController()
    active.current = controller
    setStatus('submitting')
    setError(undefined)
    try {
      const response = await createServiceRequest(input, controller.signal)
      if (mounted.current) setStatus('success')
      return response
    } catch (cause) {
      if (mounted.current && !(cause instanceof RequestCancelledError)) {
        setError(toUiError(cause))
        setStatus('error')
      }
      return undefined
    } finally {
      if (active.current === controller) active.current = undefined
    }
  }, [])

  const reset = useCallback(() => { if (!active.current) { setStatus('idle'); setError(undefined) } }, [])
  return { submit, reset, status, error, isSubmitting: status === 'submitting' }
}
