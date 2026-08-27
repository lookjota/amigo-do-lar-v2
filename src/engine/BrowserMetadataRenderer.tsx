import { useEffect } from 'react'
import type { PageMetadata } from '../domain/metadata/PageMetadata'

interface BrowserMetadataRendererProps {
  metadata: PageMetadata
}

function setMetaByName(name: string, content?: string) {
  const selector = `meta[name="${name}"]`
  let element = document.head.querySelector<HTMLMetaElement>(selector)

  if (!content) {
    element?.remove()
    return
  }

  if (!element) {
    element = document.createElement('meta')
    element.name = name
    document.head.append(element)
  }

  element.content = content
}

function setMetaByProperty(property: string, content?: string) {
  const selector = `meta[property="${property}"]`
  let element = document.head.querySelector<HTMLMetaElement>(selector)

  if (!content) {
    element?.remove()
    return
  }

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('property', property)
    document.head.append(element)
  }

  element.content = content
}

function setCanonical(href?: string) {
  let element = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  )

  if (!href) {
    element?.remove()
    return
  }

  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.append(element)
  }

  element.href = href
}

function getRobotsContent(metadata: PageMetadata): string | undefined {
  if (!metadata.robots) {
    return undefined
  }

  const directives: string[] = []

  if (metadata.robots.index !== undefined) {
    directives.push(metadata.robots.index ? 'index' : 'noindex')
  }

  if (metadata.robots.follow !== undefined) {
    directives.push(metadata.robots.follow ? 'follow' : 'nofollow')
  }

  return directives.length > 0 ? directives.join(', ') : undefined
}

export function BrowserMetadataRenderer({
  metadata,
}: BrowserMetadataRendererProps) {
  useEffect(() => {
    document.title = metadata.title

    setMetaByName('description', metadata.description)
    setMetaByName('keywords')
    setMetaByName('author', metadata.author)
    setMetaByName('robots', getRobotsContent(metadata))
    setCanonical(metadata.canonicalUrl)

    setMetaByProperty('og:title', metadata.title)
    setMetaByProperty('og:type', metadata.openGraphType ?? 'website')
    setMetaByProperty('og:description', metadata.description)
    setMetaByProperty('og:url', metadata.canonicalUrl)
    setMetaByProperty('og:image', metadata.image)
    setMetaByProperty('og:locale', metadata.locale)
    setMetaByProperty('og:site_name', metadata.siteName)

    setMetaByName('twitter:card', metadata.image ? 'summary_large_image' : 'summary')
    setMetaByName('twitter:title', metadata.title)
    setMetaByName('twitter:description', metadata.description)
    setMetaByName('twitter:image', metadata.image)

    const selector = 'script[data-page-structured-data]'
    document.head.querySelectorAll(selector).forEach((element) => {
      element.remove()
    })

    metadata.structuredData?.forEach((schema) => {
      const element = document.createElement('script')
      element.type = 'application/ld+json'
      element.dataset.pageStructuredData = ''
      element.text = JSON.stringify(schema).replace(/</g, '\\u003c')
      document.head.append(element)
    })
  }, [metadata])

  return null
}
