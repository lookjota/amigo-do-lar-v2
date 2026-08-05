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

O mesmo bloqueio foi confirmado para a autenticação: o preflight
`OPTIONS /auth/login` com a origem de produção, método `POST` e headers
`Content-Type`/`Authorization` retornou `404`, sem os headers CORS necessários.

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
### Autenticação administrativa

O contrato confirmado no backend e na API publicada em 4 de agosto de 2026 é
`POST /auth/login`, com `{ email, password }`. A resposta `200` contém
`accessToken`, `tokenType: "Bearer"`, `expiresIn` em segundos e o usuário
público com papel `ADMIN` ou `OPERATOR`. Não existe refresh token nesta versão.
Credenciais inválidas ou conta inativa retornam `401` com
`INVALID_CREDENTIALS`; payload inválido retorna `400` com `VALIDATION_ERROR`.

O frontend mantém somente access token, usuário público e instante de expiração
em `sessionStorage`, isolando a sessão à aba. A senha nunca é persistida. O
storage é lido apenas no browser depois da hidratação; SSR começa em estado de
inicialização. Expiração local ou `401` em requisição autenticada apaga a sessão
e as rotas protegidas redirecionam para `/admin/login`. Como não há refresh
token no contrato, uma sessão expirada exige novo login.

## Próximos módulos

1. catálogo e detalhe de serviços;
2. áreas de atendimento;
3. criação e acompanhamento de solicitações de orçamento;
4. disponibilidade e agenda;
5. autenticação e perfil, somente após definir a estratégia de sessão;
6. administração e RBAC em uma etapa separada.

## Gestão administrativa de solicitações

A rota protegida `/admin/solicitacoes` usa exclusivamente o
`authenticatedApiClient`. Ela é prerenderizada apenas como estrutura inicial,
com `noindex, nofollow`, não consulta a API durante SSR e não integra o sitemap.
Tanto `ADMIN` quanto `OPERATOR` têm acesso aos endpoints abaixo; respostas `401`
encerram a sessão local e `403` é apresentado como falta de permissão.

Contratos confirmados no código, testes e documentação do backend e, para a
rota de lista sem credencial, na API de produção em 5 de agosto de 2026:

- `GET /service-requests`: lista administrativa, resposta `200` no envelope
  `{ data, pagination: { page, limit, total, totalPages } }`;
- `GET /service-requests/:id`: detalhe administrativo, resposta `200`;
- `PATCH /service-requests/:id/status`: body estrito `{ status }`, resposta
  `200` com o detalhe atualizado;
- `PATCH /service-requests/:id`: atualização de campos operacionais existente
  na API, mas não usada nesta interface.

A listagem usa `page=1`, `limit=20`, `sortBy=createdAt` e `sortOrder=desc` por
padrão. A API aceita `search`, `status`, `customerId`, `serviceId`,
`createdFrom`, `createdTo`, `preferredDateFrom`, `preferredDateTo`, `sortBy` e
`sortOrder`. Nesta interface estão disponíveis busca, status e período de
criação; filtros por IDs não são expostos até haver seletores administrativos
apropriados. Busca, filtros, página e detalhe selecionado ficam na query string.

O detalhe contém os campos persistidos da solicitação, resumos reais de cliente
(`name`, `phone`, `email`, `isActive`) e serviço (`name`, `slug`, `category`,
`isActive`). IDs relacionais existem no contrato validado, mas não são exibidos.
Todos os textos são interpolados pelo React, sem HTML remoto.

Os status, em ordem operacional, são `PENDING`, `CONTACTED`, `QUOTED`,
`APPROVED`, `SCHEDULED`, `IN_PROGRESS`, `COMPLETED` e `CANCELLED`. As transições
permitidas são as documentadas pelo backend: pendente pode ir a contatado ou
cancelado; contatado a orçamento ou cancelado; orçamento a aprovado, contatado
ou cancelado; aprovado a agendado ou cancelado; agendado a em andamento,
aprovado ou cancelado; em andamento a concluído, agendado ou cancelado. Estados
concluído e cancelado são finais. A API rejeita transições inválidas com `422` e
`INVALID_SERVICE_REQUEST_STATUS_TRANSITION`; o frontend não tenta contornar a
regra.

Respostas externas são validadas com Zod. Consultas suportam cancelamento e o
retry central apenas para falhas transitórias; mutações nunca têm retry, exigem
confirmação, bloqueiam envio concorrente e só atualizam lista e detalhe após
sucesso confirmado. A interface não mostra body, JSON, stack nem request ID.

## Gestão administrativa de agendamentos

A rota protegida `/admin/agenda` usa exclusivamente o
`authenticatedApiClient`, aceita as sessões `ADMIN` e `OPERATOR`, publica
`noindex, nofollow`, fica fora do sitemap e não consulta a API no SSR. Os
contratos foram confirmados no código, testes e `docs/appointments.md` do
backend e a existência de `GET /appointments` foi confirmada por uma resposta
anônima `401 UNAUTHORIZED` da API publicada em 5 de agosto de 2026.

Os endpoints reais são `GET /appointments`, `GET /appointments/:id`,
`POST /appointments`, `PATCH /appointments/:id` e
`PATCH /appointments/:id/status`. Não existe `DELETE`: cancelamento preserva o
histórico e é feito pela transição explícita para `CANCELLED`.

A lista retorna `{ data, pagination: { page, limit, total, totalPages } }`. Usa
`page=1`, `limit=20`, `sortBy=scheduledAt`, `sortOrder=asc` e aceita apenas
`status`, `serviceRequestId`, `customerId`, `serviceId`, `scheduledFrom` e
`scheduledTo`; as ordenações válidas são `scheduledAt`, `createdAt`,
`updatedAt` e `status`. A interface expõe status e período. Cliente e serviço
não são simulados por busca local; filtros por seus UUIDs ficam reservados para
seletores administrativos futuros.

A criação exige `serviceRequestId`, `scheduledAt` e `durationMinutes`; `notes`
é opcional e aceita string ou `null`. A solicitação deve estar em `APPROVED`, o
horário deve ser futuro e livre, e só pode existir um agendamento ativo por
solicitação. Duração é um inteiro entre 15 e 480 minutos e notas têm no máximo
4.000 caracteres. O PATCH comum aceita somente `scheduledAt`,
`durationMinutes` e `notes`, com ao menos um campo, e não permite reagendar
estados finais.

Os estados reais são `SCHEDULED`, `CONFIRMED`, `IN_PROGRESS`, `COMPLETED` e
`CANCELLED`. As transições são: agendado para confirmado ou cancelado;
confirmado para em andamento, agendado ou cancelado; em andamento para
concluído, confirmado ou cancelado. Concluído e cancelado são finais. Não há
`NO_SHOW`, responsável/técnico ou motivo estruturado de cancelamento no contrato
atual.

Datas entram e saem como ISO 8601. A API persiste UTC e compara timestamps
absolutos; o formulário interpreta data e horário no timezone local do browser,
converte explicitamente com `Date#toISOString()` e apresenta em `pt-BR`. Assim,
um horário escolhido em Brasília é enviado com o offset correto e volta ao
mesmo horário local. Os limites diários dos filtros seguem o mesmo timezone do
operador.

Erros relevantes são `INVALID_APPOINTMENT_DATE` (400), `UNAUTHORIZED` (401),
`FORBIDDEN` (403), recursos ausentes (404), conflitos de solicitação ou horário
(409) e `INVALID_APPOINTMENT_STATUS_TRANSITION` (422). A UI apresenta somente
mensagens públicas normalizadas. `401` encerra a sessão pela infraestrutura
compartilhada; mutações não têm retry nem atualização otimista e invalidam lista
e detalhe apenas após sucesso.

Para validar localmente, execute `npm run lint`, `npm run test` e
`npm run build`. Uma chamada anônima segura a `GET /service-requests` deve
retornar `401 UNAUTHORIZED`. Testes autenticados reais dependem de credencial de
teste fornecida fora do repositório. Não execute o PATCH contra produção sem
autorização explícita.

## Gestão administrativa de clientes

A rota protegida `/admin/clientes` usa exclusivamente o
`authenticatedApiClient`, é prerenderizada apenas como estrutura inicial,
publica `noindex, nofollow` e fica fora do sitemap. Nenhuma consulta é habilitada
durante SSR. A existência de `GET /customers` foi confirmada por resposta
anônima `401 UNAUTHORIZED` da API publicada em 5 de agosto de 2026; contratos,
validações e permissões foram confirmados no módulo Customers do backend.

Os endpoints reais são `GET /customers`, `GET /customers/:id`,
`POST /customers`, `PATCH /customers/:id` e `DELETE /customers/:id`. Não existe
`PATCH /customers/:id/status`. O `DELETE` é uma desativação lógica que mantém o
registro, mas a interface usa o `PATCH` com `{ isActive }` para desativar e
reativar de forma simétrica. Essa alteração de status é exclusiva de `ADMIN`;
`ADMIN` e `OPERATOR` podem listar, consultar, criar e atualizar nome, telefone e
e-mail.

Lista e detalhe retornam somente `id`, `name`, `phone`, `email`, `isActive`,
`createdAt` e `updatedAt`. A lista usa o envelope
`{ data, pagination: { page, limit, total, totalPages } }`, com `page=1` e
`limit=20`. Os únicos filtros reais são `search` (nome, telefone ou e-mail) e
`isActive`; ordenação aceita `name`, `createdAt` ou `updatedAt`, com `asc` ou
`desc`. A API não aceita período de cadastro. Filtros, ordenação, página e
cliente aberto são preservados na query string e processados no servidor.

Criação exige `name` e `phone`; `email` é opcional. Atualização aceita um
subconjunto não vazio de `name`, `phone`, `email` e, para administrador,
`isActive`. A interface separa edição de contato da alteração de status e nunca
envia campos imutáveis. Nome é normalizado para espaços simples e deve ter de 2
a 120 caracteres. Telefone aceita apenas dígitos e formatação comum, sendo
normalizado para 10 ou 11 dígitos com DDD. E-mail vazio vira `null`; os demais
valores são normalizados para lowercase.

Erros relevantes são dados inválidos (400), sessão inválida (401), permissão
insuficiente (403), cliente ausente (404) e telefone ou e-mail duplicado (409).
O cliente HTTP encerra a sessão em 401 e a interface converte todos os erros em
mensagens públicas seguras. Mutações não têm retry ou atualização otimista,
bloqueiam submissão duplicada e invalidam lista e detalhe apenas após sucesso.

Não há endereço no Customer nem endpoint de histórico agregado. Como
`GET /service-requests` e `GET /appointments` aceitam o filtro real
`customerId`, o detalhe oferece links para essas telas, que executam suas
próprias consultas paginadas. A API não retorna contagens agregadas, portanto a
interface não inventa totais nem duplica grandes consultas.

## Solicitação pública de atendimento

O contrato foi confirmado no código, nos testes e em `docs/service-requests.md`
do backend em 4 de agosto de 2026. A rota real é `POST /service-requests`, sem
autenticação, e retorna `201` com a solicitação pública diretamente no body (sem
envelope). `/api/v1/service-requests` não existe.

O payload contém `customer` (`name`, `phone` e `email` opcional), `serviceId`,
`description`, `address` e `city`; `preferredDate` é opcional e não é coletada
no fluxo atual. A API cria ou reutiliza o cliente pelo telefone dentro da mesma
transação, portanto o frontend não envia `customerId`. Nome aceita 2–120
caracteres, descrição 10–2.000, endereço até 300 e cidade até 120. O telefone
aceita caracteres comuns na digitação e é enviado somente com 10 ou 11 dígitos,
incluindo DDD. E-mail vazio é omitido.

`/solicitar-atendimento` é prerenderizada com todos os campos, serviços do
catálogo estático e somente as áreas publicadas. Depois da hidratação,
`GET /services?limit=100` fornece o UUID do serviço ativo exigido na mutação. O
slug da query `servico` só é aplicado quando pertence ao catálogo publicado. Em
4 de agosto de 2026 o catálogo da API de produção retornou vazio; por segurança,
nenhum UUID estático foi inventado e o formulário oferece WhatsApp quando não
consegue resolver o serviço remoto.

As respostas são validadas com Zod. Erros locais ficam associados aos campos;
rede, timeout, indisponibilidade, serviço inativo e duplicidade recente recebem
mensagens públicas sem body, request ID ou detalhes internos. Não há retry em
mutação, submissões concorrentes são bloqueadas e a requisição é abortada no
unmount. Em sucesso, a navegação segue para `/solicitacao-enviada`, que não
exibe dados pessoais nem IDs, tem `noindex, follow`, é prerenderizada e fica
fora do sitemap.

Valide com `npm run lint`, `npm run test` e `npm run build`. A mutação de
produção não deve ser executada enquanto o catálogo não publicar um serviço
ativo correspondente; testes usam mocks e não criam clientes ou solicitações.

## Gestão administrativa de serviços

A rota protegida `/admin/servicos` usa exclusivamente o
`authenticatedApiClient`, é prerenderizada apenas como estrutura inicial,
possui `noindex, nofollow` e fica fora do sitemap. As consultas são habilitadas
somente no navegador. `ADMIN` e `OPERATOR` podem listar e consultar detalhes;
criação, edição e alteração de status exigem `ADMIN` e seus controles não são
oferecidos ao operador.

Contrato confirmado no código, testes e `docs/services.md` do backend em 5 de
agosto de 2026:

- `GET /services`: envelope paginado `{ data, pagination }`;
- `GET /services/:slug`: detalhe por slug, não por UUID;
- `POST /services`: cria e retorna `201`, somente `ADMIN`;
- `PATCH /services/:id`: atualiza campos e retorna `200`, somente `ADMIN`;
- `DELETE /services/:id`: existe, mas faz somente desativação lógica. A tela
  não o usa porque o `PATCH` real permite tanto ativar quanto desativar;
- não existe `PATCH /services/:id/status`.

Cada serviço contém exatamente `id`, `name`, `slug`, `description`, `category`,
`isActive`, `createdAt` e `updatedAt`. Criação aceita somente `name`, `slug`,
`description` e `category`. Atualização aceita um subconjunto não vazio desses
campos e `isActive`; a UI separa a mutação de status e nunca envia `id` ou datas.
Nome possui 3–120 caracteres após trim, descrição é obrigatória e possui até
1.000, categoria é uma string não vazia de até 100 caracteres. A API não define
enum de categorias: `PLUMBING`, `ELECTRICAL`, `FURNITURE_ASSEMBLY`,
`LOCKS_AND_DOORS`, `PAINTING` e `MINOR_REPAIRS` são sugestões conhecidas do
seed, não uma lista fechada.

A lista aceita `page` (mínimo 1), `limit` (1–100), busca case-insensitive apenas
por nome em `search`, correspondência exata em `category`, `isActive`,
`orderBy` (`name` ou `createdAt`) e `sortOrder` (`asc` ou `desc`). Paginação e
filtros são server-side e sincronizados com a query string. Consultas anônimas
não podem enviar `isActive`; a interface autenticada pode listar ambos os
status.

O slug é lowercase kebab-case, segundo
`^[a-z0-9]+(?:-[a-z0-9]+)*$`, e é confirmado manualmente: o frontend não o
gera automaticamente. A unicidade é global; conflito retorna `409` com
`SERVICE_SLUG_CONFLICT`. Payload ou regra de conteúdo inválida retorna `400`,
credencial ausente/inválida retorna `401`, papel insuficiente `403` e recurso
ausente `404` com `SERVICE_NOT_FOUND`. O cliente autenticado encerra a sessão
em `401`; demais erros recebem mensagens públicas seguras.

**Criar um serviço na API não publica automaticamente uma página no site.** O
cadastro da API pertence ao catálogo operacional. A publicação SEO continua
dependendo de conteúdo editorial completo e versionado em `data/services.ts`.
A coluna de publicação e o link público são calculados somente pelos slugs
editoriais locais. Criar, renomear, ativar ou desativar um serviço não cria ou
remove rota, sitemap, metadata, JSON-LD nem conteúdo editorial. Se um serviço
publicado for desativado na API, sua página editorial continua existindo; o
catálogo dinâmico deixa de enriquecê-la e preserva o fallback estático.
