import type { ContentBlock, ContentPost } from '../../admin/content/types/contracts'
function media(post: ContentPost, id: string) { return post.media.find((item) => item.id === id) }
export function ContentRenderer({ post }: { post: ContentPost }) { return <div className="amigo-content-body">{post.content.map((block, index) => <Block key={`${block.type}-${index}`} block={block} post={post} />)}</div> }
function Block({ block, post }: { block: ContentBlock; post: ContentPost }) {
  if (block.type === 'PARAGRAPH') return <p>{block.text}</p>
  if (block.type === 'HEADING') return block.level === 2 ? <h2>{block.text}</h2> : <h3>{block.text}</h3>
  if (block.type === 'BULLET_LIST') return <ul>{block.items.map((item, index) => <li key={index}>{item}</li>)}</ul>
  if (block.type === 'NUMBERED_LIST') return <ol>{block.items.map((item, index) => <li key={index}>{item}</li>)}</ol>
  if (block.type === 'QUOTE') return <blockquote><p>{block.text}</p>{block.attribution && <cite>{block.attribution}</cite>}</blockquote>
  if (block.type === 'CALLOUT') return <aside className="amigo-content-callout">{block.text}</aside>
  if (block.type === 'VIDEO_EMBED') return <div className="amigo-content-video"><iframe src={block.url} title="Vídeo relacionado ao conteúdo" loading="lazy" sandbox="allow-scripts allow-same-origin allow-presentation" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div>
  if (block.type === 'IMAGE') { const item = media(post, block.mediaId); return item?.url ? <figure><img src={item.url} alt={item.altText} width={item.width ?? undefined} height={item.height ?? undefined} loading="lazy" />{item.caption && <figcaption>{item.caption}</figcaption>}</figure> : null }
  if (block.type === 'GALLERY') return <div className="amigo-content-gallery">{block.mediaIds.map((id) => { const item = media(post, id); return item?.url ? <figure key={id}><img src={item.url} alt={item.altText} width={item.width ?? undefined} height={item.height ?? undefined} loading="lazy" />{item.caption && <figcaption>{item.caption}</figcaption>}</figure> : null })}</div>
  return null
}
