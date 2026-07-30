import { useEffect } from 'react'
import { siteConfig } from '../config/site'

export function Analytics() {
  useEffect(() => {
    const { ga4Id, clarityId } = siteConfig.analytics

    if (ga4Id) {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`
      script.dataset.amigoAnalytics = 'ga4'
      document.head.append(script)

      window.dataLayer = window.dataLayer ?? []
      window.gtag = (...arguments_) => {
        window.dataLayer?.push(arguments_)
      }
      window.gtag('js', new Date())
      window.gtag('config', ga4Id)
    }

    if (clarityId) {
      const clarity: NonNullable<typeof window.clarity> = (
        ...arguments_: unknown[]
      ) => {
        clarity.q?.push(arguments_)
      }
      clarity.q = []
      window.clarity = clarity

      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.clarity.ms/tag/${encodeURIComponent(clarityId)}`
      script.dataset.amigoAnalytics = 'clarity'
      document.head.append(script)
    }

    return () => {
      document
        .querySelectorAll('[data-amigo-analytics]')
        .forEach((element) => element.remove())
      delete window.gtag
      delete window.clarity
    }
  }, [])

  return null
}
