# SEO do Amigo do Lar

## Arquitetura

Cada rota pública resolve um `Page` no `AmigoDoLarPageRepository`. O
`PageRenderer` aplica metadata e renderiza seções estruturadas pelo
`SectionRenderer`. Títulos, descriptions, canonicals e JSON-LD pertencem ao
conteúdo da página, não aos componentes visuais.

## URL pública

Defina `VITE_PUBLIC_SITE_URL` com a origem pública absoluta, sem caminho final:

```text
VITE_PUBLIC_SITE_URL=https://dominio-da-empresa.example
```

O valor técnico padrão `https://amigodolar.example` permite builds locais, mas
deve ser substituído antes do deploy. Atualize também a origem em
`public/robots.txt` e `public/sitemap.xml`.

Para publicação em subdiretório, defina `VITE_BASE_PATH`. Em domínio próprio,
use `/`.

## Sitemap e robots

`npm run generate:seo` gera `dist/sitemap.xml` e `dist/robots.txt` a partir do
catálogo tipado de rotas e com a origem configurada. O build executa esse passo
automaticamente. O sitemap contém as 23 rotas públicas e não inclui a página
404. Ao adicionar uma rota pública, atualize o catálogo de páginas; sitemap e
prerenderização acompanham a alteração automaticamente.

## Metadata

`BrowserMetadataRenderer` mantém `title`, description, author, robots,
canonical, Open Graph e Twitter Card sincronizados por rota. Meta keywords não
é emitida. A página 404 usa `noindex, nofollow`.

## Dados estruturados

O site emite JSON-LD no `<head>`:

- `Organization`, `WebSite` e `WebPage` na home;
- `Service`, `WebPage` e `BreadcrumbList` nas páginas de serviço;
- `WebPage` e `BreadcrumbList` nas páginas locais;
- `FAQPage` somente em páginas que mostram as mesmas perguntas e respostas.

Não são publicados avaliações, preços, endereço, horário ou outros dados ainda
não confirmados.

## Search Console e Google Business Profile

Depois de definir o domínio:

1. verifique a propriedade de domínio no Google Search Console;
2. envie `/sitemap.xml`;
3. acompanhe indexação, experiência da página e consultas;
4. crie ou valide o Google Business Profile apenas com nome, telefone, áreas,
   categoria e demais dados reais fornecidos pelo proprietário;
5. mantenha dados do perfil consistentes com o site.

## Medição

`VITE_GA4_ID` habilita Google Analytics 4. `VITE_CLARITY_ID` habilita
opcionalmente o Microsoft Clarity. Não existem IDs falsos no código.
Eventos semânticos cobrem cliques no WhatsApp, solicitações, páginas de serviço
e páginas locais. Antes de habilitar medição, valide consentimento e requisitos
legais aplicáveis.

## Prerenderização e limitações restantes

O build usa o SSR do Vite e `renderToString` para gerar um HTML específico para
cada rota pública. Title, description, canonical, robots, Open Graph, Twitter
Card, JSON-LD, H1, breadcrumbs e conteúdo principal estão presentes antes da
execução do JavaScript. O cliente hidrata esse mesmo markup e mantém a navegação
SPA.

A prerenderização representa o conteúdo disponível no momento do build. Se o
site passar a depender de dados alterados em tempo real, será necessário
reconstruir a aplicação ou adotar SSR em execução. Rotas desconhecidas ainda
dependem do fallback da hospedagem para chegar à interface 404; `dist/404.html`
contém a versão estática com `noindex`.

## Próximos passos

Quando o domínio e os dados comerciais forem confirmados:

1. substituir URL e telefone provisórios;
2. adicionar imagem social com dimensões estáveis;
3. validar JSON-LD no Schema Markup Validator;
4. medir Lighthouse e Core Web Vitals em produção;
5. monitorar se conteúdos futuros exigem reconstrução automática ou SSR;
6. manter o catálogo tipado de rotas como fonte única do prerender e sitemap.
