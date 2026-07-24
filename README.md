# Logos Page Engine

> **A Domain-Oriented Engine for Building Living Pages**

The **Logos Page Engine** is an open-source engine for building websites through domain entities instead of UI composition.

Rather than creating pages directly with React components, pages are described as structured domain models and rendered dynamically by the Engine.

The first public implementation of this architecture is the **Instituto Logos**, where the Engine renders the institution itself.

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

# License

Released under the MIT License.

---

> **Think deeply. Decide quickly. Build continuously.**



> Developed by Instituto Logos

Researching architectures that transform knowledge into living systems.