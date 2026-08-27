import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { BrowserMetadataRenderer } from '../../../../engine/BrowserMetadataRenderer'
import { listPublicPosts } from '../../admin/content/api/content-api'
import { absoluteUrl, siteConfig } from '../../config/site'
import { buildContentPosts } from '../buildContent'

export function ContentIndexPage() {
  const [params, setParams] = useSearchParams()
  const page = Math.max(1, Number(params.get('page')) || 1)
  const buildData = page === 1 ? { data: buildContentPosts.slice(0, 12), pagination: { page: 1, limit: 12, total: buildContentPosts.length, totalPages: Math.max(1, Math.ceil(buildContentPosts.length / 12)) } } : undefined
  const query = useQuery({ queryKey: ['public-content', page], queryFn: ({ signal }) => listPublicPosts(page, signal), ...(buildData ? { initialData: buildData } : {}) })
  return <main id="conteudo-principal">
    <BrowserMetadataRenderer metadata={{ title: 'Conteúdos — Amigo do Lar', description: 'Guias, artigos, casos e dicas para cuidar da sua casa.', canonicalUrl: absoluteUrl('/conteudos'), siteName: siteConfig.siteName, locale: siteConfig.locale, robots: { index: true, follow: true } }} />
    <section className="amigo-section"><div className="amigo-container"><p className="amigo-eyebrow">Conhecimento para sua casa</p><h1>Conteúdos</h1>
      {query.isLoading && <p role="status">Carregando conteúdos…</p>}
      {query.isError && <div role="alert"><p>Não foi possível carregar os conteúdos.</p><button onClick={() => void query.refetch()}>Tentar novamente</button></div>}
      {query.data?.data.length === 0 && <p>Nenhum conteúdo publicado ainda.</p>}
      <div className="amigo-content-grid">{query.data?.data.map((post) => { const cover = post.media.find((item) => item.id === post.coverMediaId); return <article className="amigo-admin-card" key={post.id}>{cover?.url && <img src={cover.url} alt={cover.altText} loading="lazy" width={cover.width ?? undefined} height={cover.height ?? undefined} />}<small>{post.contentType}</small><h2><Link to={`/conteudos/${post.slug}`}>{post.title}</Link></h2><p>{post.excerpt}</p>{post.publishedAt && <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString('pt-BR')}</time>}</article> })}</div>
      {query.data && query.data.pagination.totalPages > 1 && <nav aria-label="Paginação"><button disabled={page === 1} onClick={() => setParams(page === 2 ? {} : { page: String(page - 1) })}>Anterior</button><button disabled={page >= query.data.pagination.totalPages} onClick={() => setParams({ page: String(page + 1) })}>Próxima</button></nav>}
    </div></section>
  </main>
}
