# Integração com a API

## Visão geral

O frontend usa a API REST publicada em
`https://amigo-do-lar-api-production.up.railway.app`. A integração é
progressiva: o catálogo público continua estático e prerenderizável, enquanto
novos módulos podem consumir a camada HTTP central sem acoplar `fetch` aos
componentes.

Os health checks confirmados em 4 de agosto de 2026 não usam o prefixo de
negócio `/api/v1`:

- `GET /health` retorna `{ "status": "ok" }`;
- `GET /ready` retorna `{ "status": "ready" }`.

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

## Adicionando um recurso

Defina contratos no módulo da feature e concentre o acesso à rede em uma função
de API:

```ts
interface ServiceResponse {
  id: string
  name: string
}

export function getService(slug: string, signal?: AbortSignal) {
  return apiClient.get<ServiceResponse>(`/api/v1/services/${slug}`, { signal })
}
```

O componente deve consumir uma função ou hook, nunca chamar `fetch` diretamente:

```tsx
function ServiceName({ service }: { service: ServiceResponse }) {
  return <h1>{service.name}</h1>
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
