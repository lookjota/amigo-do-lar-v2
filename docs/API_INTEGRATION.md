# Integração com a API

## Visão geral

O frontend usa a API REST publicada em
`https://amigo-do-lar-api-production.up.railway.app`. A integração é
static-first: o catálogo público continua estático e prerenderizável e, depois
da hidratação, a API pode enriquecer os cards sem acoplar `fetch` aos
componentes.

Os health checks confirmados em 4 de agosto de 2026 não usam o prefixo de
negócio `/api/v1`:

- `GET /health` retorna `{ "status": "ok" }`;
- `GET /ready` retorna `{ "status": "ready" }`.

## Catálogo público de serviços

O endpoint confirmado pela documentação do backend e por chamada HTTP em 4 de
agosto de 2026 é `GET /services`. Ele é público, não recebe token e retorna
somente serviços ativos por padrão. `GET /api/v1/services` não existe e retorna
`404`. Não envie `isActive=true`: esse filtro explícito exige autenticação,
embora a listagem anônima já aplique o mesmo valor como padrão.

```ts
interface PublicService {
  id: string
  name: string
  slug: string
  description: string
  category: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface ServicesResponse {
  data: PublicService[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

`getServices(signal?)` valida o envelope, preserva os erros do cliente HTTP,
encaminha o `AbortSignal` e remove defensivamente itens inativos. Na verificação
acima, produção respondeu `200` com `data: []` e paginação padrão.

### Estratégia static-first e fallback

As seções recebem o catálogo de `data/services.ts` durante SSR,
prerenderização e a primeira renderização no navegador. `useServices()` começa
em `idle` e consulta a API apenas depois da hidratação. Em `loading`, em erro ou
com uma coleção remota vazia, os cards estáticos permanecem visíveis.

Uma resposta válida mantém a ordem editorial e todos os cards locais, atualiza
somente nome e descrição de slugs com página publicada, ignora slugs
desconhecidos e não cria rotas. Duplicatas não criam cards adicionais. Texto
remoto é renderizado pelo React, nunca como HTML.

### Publicando um novo serviço

Cadastrar e ativar um serviço na API não publica uma página SEO. Para publicar
no site, adicione o conteúdo editorial completo a `data/services.ts`; isso gera
rota estática, metadata, JSON-LD, links e conteúdo prerenderizado. Só quando o
slug da API coincidir exatamente com esse slug local o registro remoto poderá
enriquecer o card.

## Configuração de ambiente

Copie `.env.example` para `.env.local`. `VITE_API_URL`,
`VITE_PUBLIC_SITE_URL` e `VITE_WHATSAPP_NUMBER` possuem defaults públicos
seguros para build e prerender, mas valores fornecidos são validados no início
da aplicação. URLs têm barras finais removidas.

O módulo `config/environment.ts` é a fonte central de configuração pública. Ele
lê apenas `import.meta.env`, não acessa `window` e pode ser avaliado durante SSR.
`VITE_BASE_PATH` é consumido pelo Vite e disponibilizado como
`import.meta.env.BASE_URL`.

## Cliente HTTP

`src/shared/http/httpClient.ts` contém o cliente reutilizável baseado em
`fetch`. A instância específica do produto fica em
`src/apps/amigo-do-lar/api/apiClient.ts`.

O cliente:

- combina base URL e path sem barras duplicadas;
- envia `Accept: application/json`;
- serializa body definido como JSON e então envia `Content-Type`;
- aceita headers e `AbortSignal` do consumidor;
- suporta respostas JSON, texto e sem conteúdo;
- aplica timeout sem confundi-lo com cancelamento do consumidor.

## Padrão de erros

- `HttpError`: resposta HTTP não bem-sucedida; preserva `status`,
  `statusText`, body, método, URL e, quando enviados pela API, `code`, mensagem
  (`apiMessage`) e `details`;
- `NetworkError`: o servidor não pôde ser alcançado ou `fetch` falhou;
- `RequestCancelledError`: cancelamento solicitado pelo consumidor;
- `RequestTimeoutError`: limite do cliente excedido.

`api/errors.ts` converte erros técnicos para mensagens seguras da interface.
Não apresente bodies, traces ou detalhes internos diretamente ao usuário.

## Health check

`api/health-api.ts` expõe `getHealth(signal?)` e `getReadiness(signal?)`.
`useApiHealth()` inicia em `idle`, consulta `/health` somente em `useEffect`,
cancela a requisição no unmount e oferece `retry`. Por isso, SSR e o primeiro
HTML hidratado permanecem determinísticos.

`ApiStatus` consome esse hook exclusivamente quando `import.meta.env.DEV` é
verdadeiro. O build de produção não produz marcação para o diagnóstico.

## CORS

CORS é responsabilidade da API, não do frontend. O backend deve permitir pelo
menos estas origens:

- `https://amigo-do-lar-v2.vercel.app`;
- `http://localhost:5173`;
- `http://localhost:5174`.

Também deve aceitar os métodos e headers necessários a cada rota, incluindo
`Accept` e `Content-Type`. Alterações nessa política pertencem ao repositório da
API.

Na verificação de 4 de agosto de 2026, as respostas com `Origin` não incluíram
`Access-Control-Allow-Origin` e o preflight `OPTIONS /health` retornou 404. A
comunicação direta por servidor/cURL funciona, mas chamadas do browser ficarão
bloqueadas até a política ser habilitada no backend.

## Adicionando outro recurso

Defina contratos no módulo da feature e concentre o acesso à rede em uma função
de API:

```ts
interface ExampleResponse {
  id: string
  name: string
}

export function getExample(signal?: AbortSignal) {
  return apiClient.get<ExampleResponse>('/examples', { signal })
}
```

O componente deve consumir uma função ou hook, nunca chamar `fetch` diretamente:

```tsx
function ExampleName({ example }: { example: ExampleResponse }) {
  return <h1>{example.name}</h1>
}
```

Para dados remotos, crie um hook que controle loading, erro e cancelamento, ou
use o `QueryClient` já configurado quando cache e retry forem necessários.
Valide payloads externos quando sua estrutura afetar regras de negócio e adapte
DTOs para os modelos de domínio existentes.

## SSR e prerender

- não acesse `window`, `document` ou storage na configuração e nos services;
- efeitos de browser devem ficar em `useEffect`;
- o HTML inicial não deve depender da disponibilidade momentânea da API;
- crie um `QueryClient` por render SSR para não compartilhar cache entre rotas;
- falhas da API não podem impedir a renderização do catálogo público atual.

## Segurança

Variáveis `VITE_*` são públicas no bundle. Não coloque nelas segredos, JWTs,
credenciais ou chaves privadas. Não registre payloads sensíveis, não persista
tokens em `localStorage` nesta etapa e não injete respostas com `innerHTML`.
Autenticação futura deve definir armazenamento e renovação de sessão com uma
análise própria de ameaças.

## Próximos módulos

1. catálogo e detalhe de serviços;
2. áreas de atendimento;
3. criação e acompanhamento de solicitações de orçamento;
4. disponibilidade e agenda;
5. autenticação e perfil, somente após definir a estratégia de sessão;
6. administração e RBAC em uma etapa separada.
