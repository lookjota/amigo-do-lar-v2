import { useCallback, useEffect, useRef, useState } from 'react'
import { RequestCancelledError } from '../../../shared/http'
import { getServices, type PublicService } from './services-api'

export type ServicesStatus = 'idle' | 'loading' | 'success' | 'error'

export interface ServicesState {
  status: ServicesStatus
  data?: PublicService[]
  retry: () => void
}

export function useServices(): ServicesState {
  const [status, setStatus] = useState<ServicesStatus>('idle')
  const [data, setData] = useState<PublicService[]>()
  const controllerRef = useRef<AbortController>(undefined)
  const mountedRef = useRef(false)
  const lifecycleRef = useRef(0)

  const load = useCallback(() => {
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    setStatus('loading')

    void getServices(controller.signal).then(
      (services) => {
        if (mountedRef.current && !controller.signal.aborted) {
          setData(services)
          setStatus('success')
        }
      },
      (error: unknown) => {
        if (
          mountedRef.current &&
          !controller.signal.aborted &&
          !(error instanceof RequestCancelledError)
        ) {
          setData(undefined)
          setStatus('error')
        }
      },
    )
  }, [])

  useEffect(() => {
    mountedRef.current = true
    const lifecycle = ++lifecycleRef.current

    queueMicrotask(() => {
      if (mountedRef.current && lifecycleRef.current === lifecycle) {
        load()
      }
    })

    return () => {
      mountedRef.current = false
      lifecycleRef.current += 1
      controllerRef.current?.abort()
    }
  }, [load])

  return { status, data, retry: load }
}
