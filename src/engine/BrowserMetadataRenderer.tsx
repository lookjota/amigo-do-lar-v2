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
    setMetaByName('keywords', metadata.keywords?.join(', '))
    setMetaByName('author', metadata.author)
    setMetaByName('robots', getRobotsContent(metadata))
    setCanonical(metadata.canonicalUrl)

    setMetaByProperty('og:title', metadata.title)
    setMetaByProperty('og:type', 'website')
    setMetaByProperty('og:description', metadata.description)
    setMetaByProperty('og:url', metadata.canonicalUrl)
    setMetaByProperty('og:image', metadata.image)
    setMetaByProperty('og:locale', metadata.locale)

    setMetaByName('twitter:card', metadata.image ? 'summary_large_image' : 'summary')
    setMetaByName('twitter:title', metadata.title)
    setMetaByName('twitter:description', metadata.description)
    setMetaByName('twitter:image', metadata.image)
  }, [metadata])

  return null
}
