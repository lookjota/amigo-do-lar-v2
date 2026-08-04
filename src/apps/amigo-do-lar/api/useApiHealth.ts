import { useCallback, useEffect, useRef, useState } from 'react'
import { RequestCancelledError } from '../../../shared/http'
import type { HealthResponse } from './api-types'
import { getHealth } from './health-api'

export type ApiHealthStatus = 'idle' | 'loading' | 'success' | 'error'

export interface ApiHealthState {
  status: ApiHealthStatus
  data?: HealthResponse
  retry: () => void
}

export function useApiHealth(): ApiHealthState {
  const [status, setStatus] = useState<ApiHealthStatus>('idle')
  const [data, setData] = useState<HealthResponse>()
  const controllerRef = useRef<AbortController>(undefined)
  const mountedRef = useRef(false)
  const lifecycleRef = useRef(0)

  const check = useCallback(() => {
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    setStatus('loading')

    void getHealth(controller.signal).then(
      (response) => {
        if (mountedRef.current && !controller.signal.aborted) {
          setData(response)
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
        check()
      }
    })

    return () => {
      mountedRef.current = false
      lifecycleRef.current += 1
      controllerRef.current?.abort()
    }
  }, [check])

  return { status, data, retry: check }
}
