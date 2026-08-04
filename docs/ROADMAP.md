# Roadmap

Este documento separa o estado verificável do frontend das capacidades planejadas. Ele não representa compromisso de prazo.

## Estado atual

### Concluído

- aplicação pública React com 23 rotas prerenderizadas;
- catálogo local de serviços e áreas atendidas;
- Logos Page Engine com páginas e seções tipadas;
- metadata única, canonical, Open Graph, Twitter Card e JSON-LD;
- sitemap, robots, SSR de build, prerender e validação de SEO;
- contato e geração de leads pelo WhatsApp;
- cliente HTTP tipado, erros centralizados e configuração de API;
- TanStack Query e provider disponíveis no browser e no SSR;
- formulário e mutation preparados para o endpoint de orçamento, com fallback para WhatsApp;
- testes unitários e de componentes;
- CI no GitHub Actions e produção na Vercel.

### Fundação pronta, integração pendente

- Os contratos da API ainda são provisórios.
- O catálogo não é carregado do backend.
- O envio do formulário depende de um endpoint externo e não deve ser tratado como persistência garantida do produto.
- Analytics depende de IDs e das decisões de consentimento aplicáveis.

## Próximas fases

### Fase 1 — Dados públicos pela API

- alinhar contratos com o backend;
- consultar catálogo de serviços e áreas;
- definir cache, estados vazios e estratégia de rebuild/SSR para conteúdo remoto;
- preservar metadata e páginas indexáveis.

### Fase 2 — Solicitação de orçamento

- consolidar endpoint e validações;
- persistir solicitações com confirmação confiável;
- definir idempotência, privacidade, retenção e tratamento operacional;
- ampliar testes do formulário e dos estados de erro.

### Fase 3 — Identidade e acesso

- implementar autenticação e gestão segura de sessão;
- definir papéis e permissões (RBAC) no backend e no frontend;
- proteger rotas e operações conforme autorização real.

Autenticação e RBAC ainda não existem.

### Fase 4 — Administração

- criar uma aplicação administrativa separada do frontend público;
- gerenciar catálogo, áreas e solicitações conforme contratos aprovados;
- definir auditoria e limites de cada papel.

Não existe painel administrativo no estado atual.

### Fase 5 — Qualidade operacional

- testes end-to-end dos fluxos críticos;
- observabilidade de erros e integrações;
- métricas de produto e SEO com consentimento adequado;
- melhorias de performance orientadas por medições reais;
- automação de regressões de acessibilidade.

## Separação entre aplicações

O frontend público deve permanecer otimizado para descoberta, conteúdo e contato. A futura área administrativa deve ter composição, autenticação, autorização e critérios de deploy próprios, ainda que compartilhe contratos e componentes adequados. Essa separação evita levar regras administrativas para as 23 rotas públicas.
