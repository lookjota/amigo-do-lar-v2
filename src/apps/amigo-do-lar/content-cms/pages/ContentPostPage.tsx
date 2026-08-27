import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BrowserMetadataRenderer } from '../../../../engine/BrowserMetadataRenderer'
import type { JsonLdObject } from '../../../../domain/metadata/PageMetadata'
import { getPublicPost } from '../../admin/content/api/content-api'
import { absoluteUrl, siteConfig } from '../../config/site'
import { ContentRenderer } from '../components/ContentRenderer'
import { buildContentPosts } from '../buildContent'

export function ContentPostPage() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const query = useQuery({
    queryKey: ['public-content', slug],
    queryFn: ({ signal }) => getPublicPost(slug, signal),
    ...(buildContentPosts.find((post) => post.slug === slug) ? { initialData: { post: buildContentPosts.find((post) => post.slug === slug)!, redirect: false } } : {}),
  })

  useEffect(() => {
    if (query.data?.redirect) {
      navigate(`/conteudos/${query.data.post.slug}`, { replace: true })
    }
  }, [navigate, query.data])

  if (query.isLoading) return <main id="conteudo-principal"><p role="status">Carregando conteúdo…</p></main>
  if (!query.data) return <main id="conteudo-principal"><h1>Conteúdo não encontrado</h1></main>

  const { post } = query.data
  const cover = post.media.find((item) => item.id === post.coverMediaId)
  const canonical = post.canonicalUrl ?? absoluteUrl(`/conteudos/${post.slug}`)
  const title = post.seoTitle || post.title
  const description = post.seoDescription || post.excerpt
  const structuredData: JsonLdObject[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      mainEntityOfPage: canonical,
      publisher: { '@type': 'Organization', name: siteConfig.business.name, url: siteConfig.siteUrl },
      ...(cover?.url ? { image: cover.url } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: absoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: 'Conteúdos', item: absoluteUrl('/conteudos') },
        { '@type': 'ListItem', position: 3, name: post.title, item: canonical },
      ],
    },
  ]

  return <main id="conteudo-principal">
    <BrowserMetadataRenderer metadata={{ title, description, canonicalUrl: canonical, image: cover?.url, openGraphType: 'article', siteName: siteConfig.siteName, locale: siteConfig.locale, robots: { index: post.robotsIndex, follow: post.robotsFollow }, publishedAt: post.publishedAt ?? undefined, updatedAt: post.updatedAt, structuredData }} />
    <nav className="amigo-breadcrumbs" aria-label="Trilha de navegação"><ol className="amigo-container"><li><Link to="/">Início</Link></li><li><Link to="/conteudos">Conteúdos</Link></li><li aria-current="page">{post.title}</li></ol></nav>
    <article className="amigo-section"><div className="amigo-container amigo-content-article">
      <p className="amigo-eyebrow">{post.contentType}</p><h1>{post.title}</h1><p>{post.excerpt}</p>
      {cover?.url && <img className="amigo-content-cover" src={cover.url} alt={cover.altText} width={cover.width ?? undefined} height={cover.height ?? undefined} fetchPriority="high" />}
      {post.publishedAt && <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString('pt-BR')}</time>}
      <ContentRenderer post={post} />
      {post.service && <p>Serviço relacionado: <Link to={`/servicos/${post.service.slug}`}>{post.service.name}</Link></p>}
      {post.serviceArea && <p>Região relacionada: <Link to={`/areas-atendidas/${post.serviceArea.slug}`}>{post.serviceArea.name}</Link></p>}
      <aside className="amigo-content-cta"><h2>Precisa de ajuda em casa?</h2><Link className="amigo-button" to="/solicitar-atendimento">Solicitar atendimento</Link></aside>
    </div></article>
  </main>
}
