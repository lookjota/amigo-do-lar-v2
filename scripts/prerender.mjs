import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import {
  distDirectory,
  escapeHtml,
  getRobotsContent,
  loadServerEntry,
} from './build-utils.mjs'

const templatePath = resolve(distDirectory, 'index.html')
const template = await readFile(templatePath, 'utf8')
const { notFoundPage, publicRoutes, render } = await loadServerEntry()

function metaName(name, content) {
  return content
    ? `<meta name="${escapeHtml(name)}" content="${escapeHtml(content)}" />`
    : ''
}

function metaProperty(property, content) {
  return content
    ? `<meta property="${escapeHtml(property)}" content="${escapeHtml(content)}" />`
    : ''
}

function createHead(metadata) {
  const twitterCard = metadata.image ? 'summary_large_image' : 'summary'
  const structuredData = (metadata.structuredData ?? [])
    .map(
      (schema) =>
        `<script type="application/ld+json" data-page-structured-data>${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>`,
    )
    .join('\n')

  return [
    `<title>${escapeHtml(metadata.title)}</title>`,
    metaName('description', metadata.description),
    metaName('author', metadata.author),
    metaName('robots', getRobotsContent(metadata)),
    metadata.canonicalUrl
      ? `<link rel="canonical" href="${escapeHtml(metadata.canonicalUrl)}" />`
      : '',
    metaProperty('og:title', metadata.title),
    metaProperty('og:type', 'website'),
    metaProperty('og:description', metadata.description),
    metaProperty('og:url', metadata.canonicalUrl),
    metaProperty('og:image', metadata.image),
    metaProperty('og:locale', metadata.locale),
    metaProperty('og:site_name', metadata.siteName),
    metaName('twitter:card', twitterCard),
    metaName('twitter:title', metadata.title),
    metaName('twitter:description', metadata.description),
    metaName('twitter:image', metadata.image),
    structuredData,
  ]
    .filter(Boolean)
    .join('\n    ')
}

function removeDefaultMetadata(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(
      /<meta\s+(?:name|property)=["'](?:description|author|robots|twitter:[^"']+|og:[^"']+)["'][^>]*\/?>\s*/gi,
      '',
    )
    .replace(/<link\s+rel=["']canonical["'][^>]*\/?>\s*/gi, '')
    .replace(
      /<script[^>]*data-page-structured-data[^>]*>[\s\S]*?<\/script>\s*/gi,
      '',
    )
}

function createDocument(page, markup) {
  const html = removeDefaultMetadata(template)
    .replace('</head>', `    ${createHead(page.metadata)}\n  </head>`)
    .replace(
      '<div id="root"></div>',
      `<div id="root">${markup}</div>`,
    )

  if (!html.includes(markup)) {
    throw new Error(`Failed to inject rendered markup for "${page.slug}".`)
  }

  return html
}

function outputPath(pathname) {
  return pathname === '/'
    ? resolve(distDirectory, 'index.html')
    : resolve(distDirectory, pathname.slice(1), 'index.html')
}

function extensionlessOutputPath(pathname) {
  return pathname === '/'
    ? undefined
    : resolve(distDirectory, `${pathname.slice(1)}.html`)
}

let prerenderedCount = 0

for (const route of publicRoutes) {
  if (!route.prerender) continue

  const markup = render(route.pathname)
  if (!markup) {
    throw new Error(`SSR returned empty markup for "${route.pathname}".`)
  }

  const filePath = outputPath(route.pathname)
  const html = createDocument(route.page, markup)
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, html)

  const extensionlessPath = extensionlessOutputPath(route.pathname)
  if (extensionlessPath) {
    await mkdir(dirname(extensionlessPath), { recursive: true })
    await writeFile(extensionlessPath, html)
  }

  prerenderedCount += 1
}

const notFoundMarkup = render('/__not-found__')
if (!notFoundMarkup) {
  throw new Error('SSR returned empty markup for the 404 page.')
}

await writeFile(
  resolve(distDirectory, '404.html'),
  createDocument(notFoundPage, notFoundMarkup),
)

console.log(
  `Prerendered ${prerenderedCount} public routes and the 404 page.`,
)
