import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { distDirectory } from './build-utils.mjs'

const sitemap = await readFile(
  resolve(distDirectory, 'sitemap.xml'),
  'utf8',
)
const publicRoutes = [
  ...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g),
].map((match) => {
  const canonicalUrl = match[1]
  const url = new URL(canonicalUrl)

  return {
    pathname: url.pathname,
    canonicalUrl,
  }
})
const titles = new Set()
const descriptions = new Set()
const failures = []

function routeFile(pathname) {
  return pathname === '/'
    ? resolve(distDirectory, 'index.html')
    : resolve(distDirectory, pathname.slice(1), 'index.html')
}

function matchContent(html, expression) {
  return html.match(expression)?.[1]
}

async function validateRoute(route) {
  let html

  try {
    html = await readFile(routeFile(route.pathname), 'utf8')
  } catch {
    failures.push(`${route.pathname}: HTML file does not exist`)
    return
  }

  const title = matchContent(html, /<title>([\s\S]*?)<\/title>/i)
  const description = matchContent(
    html,
    /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i,
  )
  const canonical = matchContent(
    html,
    /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i,
  )
  const robots = matchContent(
    html,
    /<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i,
  )
  const h1Count = (html.match(/<h1(?:\s|>)/gi) ?? []).length
  const bodyText = (matchContent(html, /<body[^>]*>([\s\S]*?)<\/body>/i) ?? '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')

  if (!title) failures.push(`${route.pathname}: missing title`)
  if (!description) failures.push(`${route.pathname}: missing description`)
  if (!canonical) failures.push(`${route.pathname}: missing canonical`)
  if (canonical !== route.canonicalUrl) {
    failures.push(`${route.pathname}: canonical does not match route`)
  }
  if (h1Count !== 1) {
    failures.push(`${route.pathname}: expected 1 H1, found ${h1Count}`)
  }
  if (robots?.includes('noindex')) {
    failures.push(`${route.pathname}: public route contains noindex`)
  }
  if (/Lorem ipsum|\[telefone\]|\[endereço\]/i.test(bodyText)) {
    failures.push(`${route.pathname}: contains a visible placeholder`)
  }

  const jsonLdBlocks = [
    ...html.matchAll(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ]

  for (const block of jsonLdBlocks) {
    try {
      JSON.parse(block[1])
    } catch {
      failures.push(`${route.pathname}: contains invalid JSON-LD`)
    }
  }

  if (title) titles.add(title)
  if (description) descriptions.add(description)
}

for (const route of publicRoutes) {
  await validateRoute(route)
}

const notFoundHtml = await readFile(
  resolve(distDirectory, '404.html'),
  'utf8',
)
if (!/name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(notFoundHtml)) {
  failures.push('/404.html: missing noindex')
}
if ((notFoundHtml.match(/<h1(?:\s|>)/gi) ?? []).length !== 1) {
  failures.push('/404.html: expected exactly 1 H1')
}
if (titles.size <= 1) failures.push('Public route titles are all equal')
if (descriptions.size <= 1) {
  failures.push('Public route descriptions are all equal')
}

if (failures.length > 0) {
  throw new Error(`SEO validation failed:\n- ${failures.join('\n- ')}`)
}

console.log(
  `Validated ${publicRoutes.length} public routes: unique metadata, canonicals, H1, robots and JSON-LD are valid.`,
)
