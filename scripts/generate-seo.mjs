import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import {
  distDirectory,
  loadServerEntry,
} from './build-utils.mjs'

const { publicRoutes } = await loadServerEntry()
const sitemapRoutes = publicRoutes.filter(
  (route) => route.includeInSitemap,
)

if (sitemapRoutes.length === 0) {
  throw new Error('No public routes available for sitemap generation.')
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes
  .map(
    (route) =>
      `  <url><loc>${route.page.metadata.canonicalUrl}</loc></url>`,
  )
  .join('\n')}
</urlset>
`

const siteUrl = new URL(
  sitemapRoutes[0].page.metadata.canonicalUrl,
).origin
const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`

await Promise.all([
  writeFile(resolve(distDirectory, 'sitemap.xml'), sitemap),
  writeFile(resolve(distDirectory, 'robots.txt'), robots),
])

console.log(
  `Generated sitemap and robots for ${sitemapRoutes.length} public routes.`,
)
