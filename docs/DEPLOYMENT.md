# Deploy

## Visão geral

O código é versionado no GitHub, validado pelo GitHub Actions e publicado na Vercel. O deploy usa a integração nativa da Vercel com o repositório; não há workflow de deploy da plataforma neste projeto.

## Pipeline de build

`npm run build` executa, nesta ordem:

1. build dos projetos TypeScript;
2. bundle do cliente com Vite;
3. bundle SSR temporário;
4. geração de sitemap e robots;
5. prerenderização das rotas públicas e da página 404;
6. validação automatizada de SEO;
7. remoção do bundle SSR intermediário.

O artefato publicável fica em `dist/` e não deve ser commitado.

## Prerenderização

A entrada `src/entry-server.tsx` renderiza a aplicação com `StaticRouter`. Os scripts percorrem as 23 rotas públicas e geram HTML por caminho, além de `404.html`. Para caminhos não correspondentes a arquivos, `vercel.json` reescreve a solicitação para `index.html`, permitindo que o React Router resolva a navegação no cliente.

## Variáveis na Vercel

Configure somente os valores necessários ao ambiente:

- `VITE_PUBLIC_SITE_URL` com a origem pública;
- `VITE_API_URL` quando houver API acessível;
- `VITE_WHATSAPP_NUMBER` com o número comercial confirmado;
- `VITE_GA4_ID` e `VITE_CLARITY_ID` apenas quando medição e consentimento estiverem definidos;
- `VITE_BASE_PATH` somente para publicação fora da raiz.

Como valores `VITE_*` são públicos no bundle, segredos devem permanecer em serviços server-side, nunca na configuração do frontend.

## Publicação

O ambiente de produção está disponível em [amigo-do-lar-v2.vercel.app](https://amigo-do-lar-v2.vercel.app). A integração está configurada externamente para publicar alterações da branch `main`. Pull requests podem receber previews conforme as configurações do projeto na Vercel.

Não foi criado um workflow de deploy Vercel. O workflow legado de GitHub Pages foi removido porque a hospedagem oficial atual é a Vercel.

## Validação pós-deploy

Após publicar:

1. abra home, uma página de serviço, uma página de área e uma rota inexistente;
2. verifique navegação interna e links do WhatsApp;
3. confirme `sitemap.xml` e `robots.txt`;
4. inspecione title, description, canonical e JSON-LD em rotas distintas;
5. confirme que assets e rotas profundas carregam diretamente;
6. valide o formulário conforme a disponibilidade real da API;
7. verifique logs de build e o status do CI.

Medições de performance devem registrar ambiente e data; este projeto não declara metas ou resultados não medidos.

## Rollback

Em caso de regressão, use o histórico de deployments da Vercel para promover uma versão anterior estável ou reverta a alteração no GitHub e deixe a integração produzir um novo deploy. A escolha depende da urgência e da necessidade de preservar o histórico. Registre o motivo e valide novamente as rotas e artefatos de SEO após o rollback.
