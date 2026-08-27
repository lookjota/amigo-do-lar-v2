# CMS interno

O frontend integra o CMS em `src/apps/amigo-do-lar`, usando `AdminLayout`, autenticação existente, `authenticatedApiClient`, TanStack Query e os estilos atuais. As rotas são `/admin/conteudos`, `/admin/conteudos/novo`, `/admin/conteudos/:id`, `/conteudos` e `/conteudos/:slug`. Rotas administrativas permanecem `noindex, nofollow`.

O editor usa blocos estruturados, botões de adicionar/remover/mover e controles por tipo. O renderer público nunca usa `dangerouslySetInnerHTML`; strings são escapadas pelo React, imagens referenciam `PostMedia` e iframes são criados apenas para URLs já normalizadas pelo backend, com sandbox e lazy loading.

## Build e SEO

`npm run build` começa com `generate:cms`. Sem `CMS_CONTENT_MANIFEST_URL`, o build local continua e informa que rotas remotas foram ignoradas. Quando configurada, a URL deve apontar para `/content/public/routes`; falhas ou payload inválido encerram o build. O script busca os posts publicados, gera dados de build e integra as rotas ao SSR/prerender, sitemap (`lastmod`) e `validate:seo`.

Posts usam defaults de título/descrição, canonical própria salvo override administrativo, Open Graph `article`, Twitter metadata herdada do renderer existente, `Article` e `BreadcrumbList`. Apenas posts publicados com `robotsIndex=true` entram no manifest/sitemap. A capa é priorizada; imagens internas e vídeos são lazy.

Limitação atual: redirects antigos são resolvidos pela API e navegação canônica do cliente, não por HTTP 301 no edge estático. Páginas de tags/filtros não são indexadas e geração programática de páginas locais permanece fora desta sprint.
