export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface HttpClientOptions {
  baseUrl: string
  timeoutMs: number
  getAccessToken?: () => string | undefined | Promise<string | undefined>
}

export interface RequestOptions {
  body?: unknown
  headers?: HeadersInit
  signal?: AbortSignal
}

interface HttpErrorDetails {
  status: number
  statusText: string
  responseBody: unknown
  url: string
  method: HttpMethod
}

export class HttpError extends Error {
  readonly status: number
  readonly statusText: string
  readonly responseBody: unknown
  readonly url: string
  readonly method: HttpMethod

  constructor(details: HttpErrorDetails) {
    super(`A requisição ${details.method} falhou com status ${details.status}.`)
    this.name = 'HttpError'
    this.status = details.status
    this.statusText = details.statusText
    this.responseBody = details.responseBody
    this.url = details.url
    this.method = details.method
  }
}

export class RequestTimeoutError extends Error {
  readonly timeoutMs: number

  constructor(timeoutMs: number) {
    super(`A requisição excedeu o limite de ${timeoutMs} ms.`)
    this.name = 'RequestTimeoutError'
    this.timeoutMs = timeoutMs
  }
}

export class RequestCancelledError extends Error {
  constructor(options?: ErrorOptions) {
    super('A requisição foi cancelada pelo consumidor.', options)
    this.name = 'RequestCancelledError'
  }
}

export class NetworkError extends Error {
  constructor(options?: ErrorOptions) {
    super('Não foi possível se comunicar com o servidor.', options)
    this.name = 'NetworkError'
  }
}

async function readResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined
  }

  const text = await response.text()
  if (!text.trim()) {
    return undefined
  }

  const contentType = response.headers.get('content-type')?.toLowerCase() ?? ''
  if (!contentType.includes('json')) {
    return text
  }

  return JSON.parse(text) as unknown
}

export class HttpClient {
  private readonly baseUrl: string
  private readonly timeoutMs: number
  private readonly getAccessToken?: HttpClientOptions['getAccessToken']

  constructor({ baseUrl, timeoutMs, getAccessToken }: HttpClientOptions) {
    this.baseUrl = baseUrl.replace(/\/+$/, '')
    this.timeoutMs = timeoutMs
    this.getAccessToken = getAccessToken
  }

  get<Response>(
    path: string,
    options?: Omit<RequestOptions, 'body'>,
  ): Promise<Response> {
    return this.request<Response>('GET', path, options)
  }

  post<Response>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'body'>,
  ): Promise<Response> {
    return this.request<Response>('POST', path, { ...options, body })
  }

  put<Response>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'body'>,
  ): Promise<Response> {
    return this.request<Response>('PUT', path, { ...options, body })
  }

  patch<Response>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'body'>,
  ): Promise<Response> {
    return this.request<Response>('PATCH', path, { ...options, body })
  }

  delete<Response>(
    path: string,
    options?: RequestOptions,
  ): Promise<Response> {
    return this.request<Response>('DELETE', path, options)
  }

  async request<Response>(
    method: HttpMethod,
    path: string,
    options: RequestOptions = {},
  ): Promise<Response> {
    const url = `${this.baseUrl}/${path.replace(/^\/+/, '')}`
    const controller = new AbortController()
    let timedOut = false

    const abortFromConsumer = () => controller.abort(options.signal?.reason)
    if (options.signal?.aborted) {
      abortFromConsumer()
    } else {
      options.signal?.addEventListener('abort', abortFromConsumer, {
        once: true,
      })
    }

    const timeoutId = setTimeout(() => {
      timedOut = true
      controller.abort()
    }, this.timeoutMs)

    try {
      const headers = new Headers(options.headers)
      const hasBody = options.body !== undefined

      if (hasBody && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json')
      }

      const accessToken = await this.getAccessToken?.()
      if (accessToken && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${accessToken}`)
      }

      const response = await fetch(url, {
        method,
        headers,
        body: hasBody ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      })
      const responseBody = await readResponseBody(response)

      if (!response.ok) {
        throw new HttpError({
          status: response.status,
          statusText: response.statusText,
          responseBody,
          url,
          method,
        })
      }

      return responseBody as Response
    } catch (error) {
      if (error instanceof HttpError) {
        throw error
      }

      if (timedOut) {
        throw new RequestTimeoutError(this.timeoutMs)
      }

      if (options.signal?.aborted) {
        throw new RequestCancelledError({ cause: error })
      }

      throw new NetworkError({ cause: error })
    } finally {
      clearTimeout(timeoutId)
      options.signal?.removeEventListener('abort', abortFromConsumer)
    }
  }
}
