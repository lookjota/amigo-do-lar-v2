# Logos Page Engine

![License](https://img.shields.io/badge/license-MIT-blue.svg)

![Version](https://img.shields.io/badge/version-v0.1.0-success)

![Status](https://img.shields.io/badge/status-active-success)

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)

![React](https://img.shields.io/badge/React-19-61DAFB)

> Developed by Instituto Logos  
> Researching architectures that transform knowledge into living systems.


> **A Domain-Oriented Engine for Building Living Pages**

The **Logos Page Engine** is an open-source engine for building websites through domain entities instead of UI composition.

Rather than creating pages directly with React components, pages are described as structured domain models and rendered dynamically by the Engine.

The first public implementation of this architecture is the **Instituto Logos**, where the Engine renders the institution itself.

---

## Screenshot

(imagem)

---

Introdução

↓

Quick Start

↓

Why

↓

Architecture

↓

Roadmap

---

# Why

Modern websites are usually built around components.

As projects grow, components become tightly coupled to layouts, routes and business rules, making evolution increasingly difficult.

The Logos Page Engine follows a different approach.

Instead of asking:

> *"Which components should this page render?"*

it asks:

> *"What is this page?"*

A page becomes a domain object.

Rendering becomes an implementation detail.

---

# Core Principles

The project is guided by a small set of architectural principles.

## Domain First

Pages belong to the domain.

React belongs to the infrastructure.

---

## Declarative Composition

Pages describe **what exists**, not **how it is rendered**.

---

## Stable Contracts

A page should evolve without requiring changes to the rendering pipeline.

---

## Separation of Concerns

Domain

↓

Rendering

↓

Presentation

Each layer has a single responsibility.

---

## Extensibility

Adding a new section should require configuration rather than modification.

---

# Architecture

```
Page
      │
      ▼
PageRenderer
      │
      ▼
SectionRenderer
      │
      ▼
Registry
      │
      ▼
React Components
```

The Engine knows **how to render**.

The domain knows **what should exist**.

---

# Features

Current capabilities include:

- Domain-oriented pages
- Dynamic section rendering
- Section Registry
- Generic Page Renderer
- GitHub Pages deployment
- Modular architecture
- TypeScript-first development

---

# Project Structure

```
src/

domain/
pages/
renderers/
registry/
components/
sections/
```

The project is intentionally organized around domain concepts rather than framework conventions.

---

# Current Status

Current version:

```
v0.1
```

Implemented:

- Initial rendering pipeline
- Page abstraction
- Section abstraction
- Dynamic rendering
- GitHub Pages deployment

In progress:

- Documentation Engine
- Architecture documentation
- Registry improvements

---

# Roadmap

## v0.2

- Documentation Pages
- Markdown support
- Theme system
- Generic Registry improvements

---

## v0.3

- Navigation Engine
- Search
- Metadata system

---

## v1.0

- Documentation Engine
- Plugin architecture
- Versioned documents
- Multi-project support

---

# Philosophy

The Logos Page Engine is part of a broader research initiative developed by the **Instituto Logos**.

Its purpose is not simply to generate pages.

Its purpose is to investigate how knowledge can be represented as living systems capable of continuous evolution.

Every architectural decision follows the same question:

> **Can this make knowledge easier to understand, evolve and share?**

If the answer is no, the architecture should be reconsidered.

---

# Contributing

Contributions are welcome.

Before opening a Pull Request, please read:

- CONTRIBUTING.md
- ARCHITECTURE.md
- ROADMAP.md

---

# Integração com a Amigo do Lar API

Esta camada estabelece a fundação para integrações HTTP da aplicação Amigo do
Lar sem acoplar chamadas de rede a componentes React:

```text
Página → componentes → hooks → módulos de endpoint → HttpClient → API
```

O frontend usa `VITE_API_URL` como URL-base. Copie `.env.example` para
`.env.local` e ajuste o valor para o ambiente local:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Quando a variável estiver ausente, o desenvolvimento usa esse mesmo endereço
como fallback. A configuração é validada na inicialização, remove barras finais
e define timeout de 10 segundos. Nenhuma credencial deve ser exposta em
variáveis `VITE_*`.

O cliente central em `src/shared/http` usa `fetch`, aceita respostas JSON, texto
e vazias, combina timeout e cancelamento externo e lança erros distintos para
status HTTP, timeout, cancelamento e rede. Exemplo de módulo de endpoint:

```ts
export function getServices(signal?: AbortSignal) {
  return apiClient.get<Service[]>('/services', { signal })
}
```

Não chame `fetch` diretamente em componentes. Módulos de endpoint ficam na
feature correspondente e hooks cuidam da lógica de apresentação.

O TanStack Query fornece cache e estado assíncrono de dados do servidor. Queries
ficam válidas por 60 segundos e não refazem automaticamente ao focar a janela.
Falhas de rede, timeout e HTTP 5xx recebem no máximo duas novas tentativas;
erros 4xx, cancelamentos e mutations não recebem retry automático. Cada render
SSR cria seu próprio `QueryClient`, impedindo vazamento de cache entre páginas.

Erros técnicos são convertidos para mensagens seguras por `toUiError`. O erro
original continua disponível apenas para logging técnico futuro; corpo de
resposta e stack trace nunca devem ser exibidos diretamente.

Os contratos em `src/apps/amigo-do-lar/api/contracts.ts` são provisórios. O
envelope, os erros de campo e a paginação precisam ser alinhados com o backend;
módulos não devem presumir que todo endpoint usa `ApiResponse<T>`.

Limitações atuais:

- não há catálogo remoto, autenticação, JWT, refresh token ou RBAC;
- não há queries reais do TanStack Query nesta fundação;
- não há hidratação/dehydration de cache porque o SSR ainda não busca dados;
- os próximos módulos previstos são serviços, áreas atendidas, solicitações de
  orçamento e usuário autenticado, depois que os endpoints forem confirmados;
- o repositório ainda não possui infraestrutura automatizada de testes. Uma
  branch futura `test/api-foundation-vitest-msw` deve avaliar Vitest, Testing
  Library e MSW em conjunto.

---

# License

Released under the MIT License.

---

> **Think deeply. Decide quickly. Build continuously.**



> Developed by Instituto Logos

Researching architectures that transform knowledge into living systems.
