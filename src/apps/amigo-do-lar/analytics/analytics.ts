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
  | 'service_page_view'
  | 'local_page_view'

export function trackEvent(
  event: AnalyticsEvent,
  parameters: Record<string, string> = {},
) {
  window.gtag?.('event', event, parameters)
}
