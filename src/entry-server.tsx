import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { AmigoDoLarApplication } from './apps/amigo-do-lar/AmigoDoLarApp'
import { ApiProvider } from './apps/amigo-do-lar/api/ApiProvider'
import { createQueryClient } from './apps/amigo-do-lar/api/queryClient'
import { notFoundPage } from './apps/amigo-do-lar/content/pageFactory'
import { publicRoutes } from './apps/amigo-do-lar/config/publicRoutes'
import { adminRoutes } from './apps/amigo-do-lar/config/adminRoutes'
import { buildContentPosts } from './apps/amigo-do-lar/content-cms/buildContent'
import { absoluteUrl, siteConfig } from './apps/amigo-do-lar/config/site'

const cmsRoutes = buildContentPosts.map((post) => {
  const cover = post.media.find((item) => item.id === post.coverMediaId)
  const canonicalUrl = post.canonicalUrl ?? absoluteUrl(`/conteudos/${post.slug}`)
  return {
    pathname: `/conteudos/${post.slug}`,
    pageSlug: `/conteudos/${post.slug}`,
    includeInSitemap: post.robotsIndex,
    prerender: true,
    page: {
      id: `content-${post.id}`,
      slug: `/conteudos/${post.slug}`,
      sections: [],
      metadata: { title: post.seoTitle || post.title, description: post.seoDescription || post.excerpt, canonicalUrl, image: cover?.url, openGraphType: 'article' as const, siteName: siteConfig.siteName, locale: siteConfig.locale, robots: { index: post.robotsIndex, follow: post.robotsFollow }, publishedAt: post.publishedAt ?? undefined, updatedAt: post.updatedAt },
    },
  }
})
const allPublicRoutes = [...publicRoutes, ...cmsRoutes]
export { adminRoutes, notFoundPage, allPublicRoutes as publicRoutes }

export function render(pathname: string): string {
  const queryClient = createQueryClient()

  return renderToString(
    <StrictMode>
      <ApiProvider queryClient={queryClient}>
        <StaticRouter location={pathname}>
          <AmigoDoLarApplication />
        </StaticRouter>
      </ApiProvider>
    </StrictMode>,
  )
}
