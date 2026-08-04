# Desenvolvimento

## Requisitos

- Node.js 24, versão adotada pelo workflow de CI;
- npm e acesso às dependências registradas no `package-lock.json`.

## Configuração local

```bash
git clone git@github.com:lookjota/amigo-do-lar-v2.git
cd amigo-do-lar-v2
npm ci
cp .env.example .env.local
npm run dev
```

O servidor do Vite informa a URL local no terminal. A API não é necessária para navegar pelo catálogo estático; o envio persistido do formulário depende do endpoint configurado e oferece WhatsApp como alternativa quando falha.

## Variáveis de ambiente

| Variável | Finalidade |
| --- | --- |
| `VITE_API_URL` | URL-base absoluta para o cliente HTTP |
| `VITE_PUBLIC_SITE_URL` | origem usada em canonical, sitemap e JSON-LD |
| `VITE_WHATSAPP_NUMBER` | número internacional, somente dígitos, usado em `wa.me` |
| `VITE_GA4_ID` | ativa a inclusão do Google Analytics 4 |
| `VITE_CLARITY_ID` | ativa a inclusão do Microsoft Clarity |
| `VITE_BASE_PATH` | base path processado pelo Vite |

Todo valor `VITE_*` pode aparecer no JavaScript enviado ao navegador. Use essas variáveis apenas para configuração pública; nunca para tokens, senhas ou chaves privadas.

## Scripts

| Comando | Uso |
| --- | --- |
| `npm run dev` | desenvolvimento com HMR |
| `npm run lint` | análise estática |
| `npm run test:run` | testes em execução única |
| `npm run test:watch` | testes em modo de observação |
| `npm run build` | validação TypeScript e build completo |
| `npm run preview` | inspeção local de `dist/` |
| `npm run generate:seo` | geração de sitemap e robots |
| `npm run prerender` | geração do HTML estático |
| `npm run validate:seo` | auditoria automática do HTML gerado |

`generate:seo`, `prerender` e `validate:seo` fazem parte do pipeline de `build` e dependem dos artefatos das etapas anteriores.

## Testes

Vitest executa em jsdom. React Testing Library e `@testing-library/user-event` são usados para comportamento e semântica de componentes. `src/test/render.tsx` fornece Router e Query Client isolados quando o teste depende desses providers.

A suíte atual cobre:

- parsing, headers, body, timeout, cancelamento e erros do cliente HTTP;
- tradução de erros técnicos para categorias de interface;
- retry, defaults e isolamento do TanStack Query;
- breadcrumbs;
- conteúdo e navegação do card de serviço.

Não há relatório ou meta de cobertura configurada. Adicione novos testes próximos à feature como `*.test.ts` ou `*.test.tsx`.

## Convenções

- TypeScript/TSX com dois espaços, aspas simples e sem ponto e vírgula;
- PascalCase para componentes, entidades e respectivos arquivos;
- camelCase para funções, variáveis e módulos de dados;
- contratos tipados em vez de objetos sem estrutura;
- nenhuma chamada direta a `fetch` em componentes;
- conteúdo e regras comerciais na aplicação, não no engine genérico.

Consulte também as orientações do `AGENTS.md` do repositório.

## Fluxo Git

1. atualize `main` e crie uma branch por alteração;
2. mantenha o escopo do commit focado;
3. use Conventional Commits, preferencialmente com escopo;
4. antes do pull request, execute:

   ```bash
   npm run lint
   npm run test:run
   npm run build
   ```

5. descreva impacto, validação e mudanças visuais no pull request;
6. revise acessibilidade e SEO quando aplicáveis;
7. use squash merge após aprovação.

Não versione `.env.local`, segredos, `node_modules/` ou `dist/`.
