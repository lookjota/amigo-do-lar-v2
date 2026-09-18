declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...arguments_: unknown[]) => void
    clarity?: ClarityFunction
  }
}

interface ClarityFunction {
  (...arguments_: unknown[]): void
  q?: unknown[][]
}

export type AnalyticsEvent =
  | 'whatsapp_click'
  | 'request_service_click'
  | 'request_form_start'
  | 'request_form_submit'
  | 'request_form_success'
  | 'request_form_error'
  | 'service_page_view'
  | 'local_page_view'

export type AnalyticsOfferContext = 'standard' | 'lista_da_casa'

export interface AnalyticsPayload {
  source_path?: string
  service_slug?: string
  region_slug?: string
  offer_context?: AnalyticsOfferContext
  /** Preserved source identifiers from the existing measurement layer. */
  origin?: string
  page_path?: string
}

export type AnalyticsProvider = (
  event: AnalyticsEvent,
  payload: AnalyticsPayload,
) => void

const payloadKeys: (keyof AnalyticsPayload)[] = [
  'source_path',
  'service_slug',
  'region_slug',
  'offer_context',
  'origin',
  'page_path',
]

let analyticsProvider: AnalyticsProvider | undefined = (event, payload) => {
  window.gtag?.('event', event, payload)
}

export function setAnalyticsProvider(
  provider: AnalyticsProvider | undefined,
): () => void {
  const previous = analyticsProvider
  analyticsProvider = provider
  return () => {
    analyticsProvider = previous
  }
}

export function getAnalyticsContext(
  pathname: string,
  origin?: string,
): AnalyticsPayload {
  const context: AnalyticsPayload = {
    source_path: pathname,
    offer_context: pathname === '/lista-da-casa' ? 'lista_da_casa' : 'standard',
  }

  if (origin) context.origin = origin

  const serviceMatch = /^\/servicos\/([^/]+)$/.exec(pathname)
  if (serviceMatch) context.service_slug = serviceMatch[1]

  const regionMatch = /^\/areas-atendidas\/([^/]+)$/.exec(pathname)
  if (regionMatch) context.region_slug = regionMatch[1]

  return context
}

export function trackEvent(
  event: AnalyticsEvent,
  parameters: AnalyticsPayload = {},
) {
  const safePayload = Object.fromEntries(
    payloadKeys.flatMap((key) => parameters[key] === undefined ? [] : [[key, parameters[key]]]),
  ) as AnalyticsPayload

  try {
    analyticsProvider?.(event, safePayload)
  } catch {
    // Measurement must never block a conversion action.
  }
}
