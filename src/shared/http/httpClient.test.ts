import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  HttpClient,
  HttpError,
  NetworkError,
  RequestCancelledError,
  RequestTimeoutError,
  buildRequestUrl,
} from './httpClient'

const client = (timeoutMs = 1_000) =>
  new HttpClient({
    baseUrl: 'https://api.example.com/',
    timeoutMs,
    getAccessToken: () => 'access-token',
  })

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('HttpClient', () => {
  it('monta URLs sem barras duplicadas', () => {
    expect(buildRequestUrl('https://api.example.com///', '//api//v1/health'))
      .toBe('https://api.example.com/api/v1/health')
  })

  it('retorna respostas JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ id: 1 }), {
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        }),
      ),
    )

    await expect(client().get('/services')).resolves.toEqual({ id: 1 })
  })

  it('retorna respostas textuais e respostas 204 vazias', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('ok', { status: 200 }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(client().get('/health')).resolves.toBe('ok')
    await expect(client().delete('/session')).resolves.toBeUndefined()
  })

  it('lança erro HTTP tipado com os detalhes da resposta', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'inválido' }), {
          status: 422,
          statusText: 'Unprocessable Content',
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    )

    const request = client().post('/quotes', {})
    await expect(request).rejects.toMatchObject({
      name: 'HttpError',
      status: 422,
      statusText: 'Unprocessable Content',
      responseBody: { message: 'inválido' },
      apiMessage: 'inválido',
      url: 'https://api.example.com/quotes',
      method: 'POST',
    } satisfies Partial<HttpError>)
  })

  it('normaliza código, mensagem e detalhes de um envelope de erro', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: {
              code: 'RESOURCE_NOT_FOUND',
              message: 'Resource not found',
              details: [],
            },
          }),
          { status: 404 },
        ),
      ),
    )

    await expect(client().get('/missing')).rejects.toMatchObject({
      status: 404,
      code: 'RESOURCE_NOT_FOUND',
      apiMessage: 'Resource not found',
      details: [],
    })
  })

  it('distingue timeout de outras interrupções', async () => {
    vi.useFakeTimers()
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, init: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init.signal?.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'))
          })
        }),
      ),
    )

    const request = client(50).get('/slow')
    const expectation = expect(request).rejects.toBeInstanceOf(
      RequestTimeoutError,
    )
    await vi.advanceTimersByTimeAsync(50)

    await expectation
  })

  it('preserva cancelamento iniciado pelo consumidor', async () => {
    const controller = new AbortController()
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, init: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          if (init.signal?.aborted) {
            reject(new DOMException('Aborted', 'AbortError'))
            return
          }

          init.signal?.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'))
          })
        }),
      ),
    )

    const request = client().get('/services', { signal: controller.signal })
    controller.abort()

    await expect(request).rejects.toBeInstanceOf(RequestCancelledError)
  })

  it('converte falhas de fetch em erro de rede', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')))

    await expect(client().get('/services')).rejects.toBeInstanceOf(NetworkError)
  })

  it('combina headers e serializa o body sem sobrescrever valores explícitos', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    vi.stubGlobal('fetch', fetchMock)

    await client().post(
      '/quotes',
      { name: 'Ana' },
      {
        headers: {
          Authorization: 'Custom token',
          'X-Request-Id': 'request-1',
        },
      },
    )

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    const headers = new Headers(init.headers)
    expect(url).toBe('https://api.example.com/quotes')
    expect(init.method).toBe('POST')
    expect(init.body).toBe(JSON.stringify({ name: 'Ana' }))
    expect(headers.get('content-type')).toBe('application/json')
    expect(headers.get('accept')).toBe('application/json')
    expect(headers.get('authorization')).toBe('Custom token')
    expect(headers.get('x-request-id')).toBe('request-1')
  })
})
