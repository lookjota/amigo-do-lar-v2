import { act, renderHook, waitFor } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getServices, type PublicService } from './services-api'
import { useServices } from './useServices'

vi.mock('./services-api', () => ({ getServices: vi.fn() }))

const service: PublicService = {
  id: 'service-id', name: 'Elétrica', slug: 'eletrica',
  description: 'Reparos elétricos residenciais.', category: 'ELECTRICAL',
  isActive: true, createdAt: '2026-07-30T12:00:00.000Z',
  updatedAt: '2026-07-30T12:00:00.000Z',
}
const getServicesMock = vi.mocked(getServices)

afterEach(() => vi.clearAllMocks())

describe('useServices', () => {
  it('permanece idle e não consulta a API durante SSR', () => {
    function Probe() {
      return <span>{useServices().status}</span>
    }
    expect(renderToString(<Probe />)).toContain('idle')
    expect(getServicesMock).not.toHaveBeenCalled()
  })

  it('transita de idle para loading e success uma única vez', async () => {
    let resolveRequest: (services: PublicService[]) => void = () => undefined
    getServicesMock.mockReturnValue(new Promise((resolve) => {
      resolveRequest = resolve
    }))
    const { result } = renderHook(() => useServices())
    expect(result.current.status).toBe('idle')
    await waitFor(() => expect(result.current.status).toBe('loading'))
    expect(getServicesMock).toHaveBeenCalledOnce()
    await act(async () => resolveRequest([service]))
    expect(result.current).toMatchObject({ status: 'success', data: [service] })
  })

  it('expõe error e permite retry', async () => {
    getServicesMock.mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce([service])
    const { result } = renderHook(() => useServices())
    await waitFor(() => expect(result.current.status).toBe('error'))
    act(() => result.current.retry())
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(getServicesMock).toHaveBeenCalledTimes(2)
  })

  it('cancela a requisição ao desmontar', async () => {
    getServicesMock.mockReturnValue(new Promise(() => undefined))
    const { unmount } = renderHook(() => useServices())
    await waitFor(() => expect(getServicesMock).toHaveBeenCalledOnce())
    const signal = getServicesMock.mock.calls[0][0]
    expect(signal?.aborted).toBe(false)
    unmount()
    expect(signal?.aborted).toBe(true)
  })
})
