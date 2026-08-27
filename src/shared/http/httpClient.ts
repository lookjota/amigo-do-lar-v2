export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface HttpClientOptions {
  baseUrl: string
  timeoutMs: number
  getAccessToken?: () => string | undefined | Promise<string | undefined>
  onUnauthorized?: () => void | Promise<void>
}

export interface RequestOptions {
  body?: unknown
  headers?: HeadersInit
  signal?: AbortSignal
}

export interface RawRequestOptions extends RequestOptions {
  redirect?: RequestRedirect
}

interface HttpErrorDetails {
  status: number
  statusText: string
  responseBody: unknown
  url: string
  method: HttpMethod
}

interface NormalizedApiError {
  code?: string
  message?: string
  details?: unknown
}

function normalizeApiError(value: unknown): NormalizedApiError {
  if (!value || typeof value !== 'object') {
    return {}
  }

  const response = value as Record<string, unknown>
  const candidate =
    response.error && typeof response.error === 'object'
      ? (response.error as Record<string, unknown>)
      : response
  return {
    code: typeof candidate.code === 'string' ? candidate.code : undefined,
    message:
      typeof candidate.message === 'string' ? candidate.message : undefined,
    details: candidate.details,
  }
}

export class HttpError extends Error {
  readonly status: number
  readonly statusText: string
  readonly responseBody: unknown
  readonly url: string
  readonly method: HttpMethod
  readonly code?: string
  readonly apiMessage?: string
  readonly details?: unknown

  constructor(details: HttpErrorDetails) {
    super(`A requisição ${details.method} falhou com status ${details.status}.`)
    this.name = 'HttpError'
    this.status = details.status
    this.statusText = details.statusText
    this.responseBody = details.responseBody
    this.url = details.url
    this.method = details.method
    const normalized = normalizeApiError(details.responseBody)
    this.code = normalized.code
    this.apiMessage = normalized.message
    this.details = normalized.details
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

  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

export function buildRequestUrl(baseUrl: string, path: string): string {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '')
  const normalizedPath = path.replace(/^\/+/, '').replace(/\/{2,}/g, '/')
  return `${normalizedBaseUrl}/${normalizedPath}`
}

export class HttpClient {
  private readonly baseUrl: string
  private readonly timeoutMs: number
  private readonly getAccessToken?: HttpClientOptions['getAccessToken']
  private readonly onUnauthorized?: HttpClientOptions['onUnauthorized']

  constructor({
    baseUrl,
    timeoutMs,
    getAccessToken,
    onUnauthorized,
  }: HttpClientOptions) {
    this.baseUrl = baseUrl.replace(/\/+$/, '')
    this.timeoutMs = timeoutMs
    this.getAccessToken = getAccessToken
    this.onUnauthorized = onUnauthorized
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

  raw(
    method: HttpMethod,
    path: string,
    options: RawRequestOptions = {},
  ): Promise<Response> {
    return this.fetchResponse(method, path, options)
  }

  async request<Response>(
    method: HttpMethod,
    path: string,
    options: RequestOptions = {},
  ): Promise<Response> {
    const response = await this.fetchResponse(method, path, options)
    return await readResponseBody(response) as Response
  }

  private async fetchResponse(
    method: HttpMethod,
    path: string,
    options: RawRequestOptions = {},
  ): Promise<Response> {
    const url = buildRequestUrl(this.baseUrl, path)
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

      if (!headers.has('Accept')) {
        headers.set('Accept', 'application/json')
      }

      if (hasBody && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json')
      }

      const accessToken = await this.getAccessToken?.()
      if (accessToken && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${accessToken}`)
      }

      const response = await fetch(url, {
        method,
        headers,
        body: hasBody
          ? options.body instanceof FormData ? options.body : JSON.stringify(options.body)
          : undefined,
        signal: controller.signal,
        redirect: options.redirect,
      })

      if (!response.ok) {
        const responseBody = await readResponseBody(response)
        if (response.status === 401 && accessToken) {
          await this.onUnauthorized?.()
        }

        throw new HttpError({
          status: response.status,
          statusText: response.statusText,
          responseBody,
          url,
          method,
        })
      }

      return response
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
