# Architecture

> **The architectural foundation of the Logos Page Engine.**
>
> This document describes the concepts, principles and rendering pipeline that
> define the Logos Page Engine. Rather than documenting implementation details,
> it explains the architectural decisions that make the Engine extensible,
> reusable and domain-oriented.

---

# Table of Contents

1. Vision
2. Architectural Philosophy
3. Design Principles
4. High-Level Architecture
5. Core Domain Model
6. Rendering Pipeline
7. Section Registry
8. Layer Responsibilities
9. Project Structure
10. Architectural Decisions
11. Evolution Strategy
12. Related Documents

---

# Vision

The Logos Page Engine is a **domain-oriented rendering engine**.

Instead of constructing pages directly with UI components, the Engine represents
pages as domain entities that are interpreted by a rendering pipeline.

This architecture separates **business representation** from **user interface**.

The Engine answers a simple question:

> **What is this page?**

Instead of:

> **Which components should React render?**

By treating pages as domain objects, the Engine becomes independent of any
specific presentation technology.

---

# Architectural Philosophy

Modern frontend applications usually grow around UI components.

```
React
   ↓
Components
   ↓
Page
```

As projects evolve, the user interface gradually becomes responsible for routing,
layout, business rules and content organization.

The Logos Page Engine follows the opposite direction.

```
Domain
    ↓
Page
    ↓
Rendering Pipeline
    ↓
React
```

React becomes an implementation detail.

The domain becomes the source of truth.

---

# Design Principles

The Engine is guided by a small set of architectural principles.

---

## Domain First

Pages belong to the domain.

The rendering layer exists only to represent the domain.

The domain never depends on React.

---

## Declarative Composition

Pages declare **what exists**.

The Engine decides **how it is rendered**.

This allows content to evolve independently from the rendering pipeline.

---

## Stable Contracts

Changes inside a page should not require modifications to the rendering engine.

The rendering pipeline must remain stable as new page types are introduced.

---

## Separation of Concerns

Every layer has one responsibility.

```
Domain
    ↓
Rendering
    ↓
Presentation
```

Responsibilities never overlap.

---

## Extensibility

The Engine should grow by **adding new capabilities**, not by modifying existing
behavior.

New section types should be registered, not hardcoded.

---

## Framework Independence

Business concepts should not depend on framework-specific APIs.

React is currently the rendering technology, but it is not part of the domain.

---

# High-Level Architecture

Route resolution and rendering follow one deterministic pipeline.

```
                      URL
                       │
                       ▼
               Route Definition
                       │
                       ▼
                  Page Slug
                       │
                       ▼
                  Repository
                       │
                       ▼
                     Page
                       │
                       ▼
                 PageRenderer
                       │
                       ▼
               SectionRenderer
                       │
                       ▼
                  SectionRegistry
                       │
                       ▼
                 React Components
                       │
                       ▼
                    Browser
```

Every page rendered by the Engine follows this exact flow.

Routes and navigation are related but separate. A route maps a URL path to a
page slug. Navigation describes links, visibility, order and parent
relationships for presentation. An application may route a page without
showing it in a menu.

---

# Core Domain Model

The Engine is built around two fundamental abstractions.

---

## Page

A Page represents an entire document.

It defines:

- identity
- metadata
- route
- sections

Conceptually:

```
Page

id
slug
metadata
sections[]
```

A Page contains no rendering logic.

It simply represents information.

---

## PageSection

A PageSection represents one independent block inside a page.

Conceptually:

```
PageSection

id
type
props
```

The section knows:

- its identity
- its type
- its data

It does **not** know:

- React
- JSX
- HTML
- CSS

Those concerns belong to the presentation layer.

---

# Rendering Pipeline

Rendering always follows the same sequence.

```
URL
      ↓
Route Definition
      ↓
Page Slug
      ↓
Repository
      ↓
Page
      ↓
PageRenderer
      ↓
SectionRenderer
      ↓
Registry
      ↓
Component
      ↓
HTML
```

Each stage has a single responsibility.

---

## Route Resolution

The application owns concrete route definitions. React Router matches the
current URL and supplies the configured page slug to a generic route screen.
That screen asks `PageRepository` for the page and passes a successful result
to `PageRenderer`.

The Engine does not import React Router and does not know an application's
paths. Unknown router paths and repository misses are handled at the
application boundary.

---

## Repository

Responsible for providing Page objects.

Repositories never render.

They only retrieve domain entities.

---

## Navigation

Navigation contracts and pure resolution functions belong to the domain. They
describe link destinations, menu visibility, sibling order and optional parent
relationships without JSX, icons, callbacks or browser APIs.

The application chooses how to render those results. Breadcrumbs are derived by
matching the current path and following `parentId` to a root item. Broken or
cyclic parent chains return no breadcrumbs and configuration diagnostics expose
the error.

---

## PageRenderer

Responsible for orchestrating page rendering.

Responsibilities:

- receive a Page
- iterate through sections
- delegate rendering

It never knows how a specific section is rendered.

---

## SectionRenderer

Responsible for rendering one section.

Its responsibility is to:

- inspect the section type
- resolve the appropriate renderer
- delegate rendering

Nothing more.

---

## Registry

The Registry maps domain concepts to presentation components.

Instead of:

```
if (section.type === "hero") ...
```

The Engine performs a lookup.

```
Hero
    ↓
HeroComponent
```

```
FAQ
    ↓
FaqComponent
```

```
CTA
    ↓
CtaComponent
```

The rendering pipeline never needs to change when a new section type is added.

---

## Component

The React component receives only the data required to render itself.

Business rules do not belong here.

---

# Section Registry

The Registry is one of the central abstractions of the Engine.

Its responsibilities are:

- map section types
- isolate presentation
- eliminate conditional rendering
- support extensibility

This design makes the rendering pipeline completely generic.

Adding a new section requires:

1. Creating the component.
2. Registering the component.
3. Using the new section type.

No changes are required in the rendering pipeline.

---

# Layer Responsibilities

```
┌─────────────────────────────┐
│ Domain                      │
│-----------------------------│
│ Page                        │
│ PageSection                 │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Rendering                   │
│-----------------------------│
│ PageRenderer                │
│ SectionRenderer             │
│ Registry                    │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Presentation                │
│-----------------------------│
│ React Components            │
│ Styles                      │
│ UI                          │
└─────────────────────────────┘
```

Dependencies always point downward.

Presentation depends on Rendering.

Rendering depends on Domain.

The Domain depends on nothing.

Routing integration and concrete configuration belong to the application
adapter. They depend on the Engine contracts, never the reverse.

---

# Project Structure

```
src/

├── domain/
│   ├── entities/
│   ├── models/
│   └── repositories/
│
├── pages/
│
├── renderers/
│
├── registry/
│
├── sections/
│
├── components/
│
└── infrastructure/
```

Each directory represents one architectural responsibility.

The directory organization mirrors the architecture itself.

---

# Architectural Decisions

## Why Domain First?

Because the domain changes less frequently than the UI.

Business concepts should remain stable.

---

## Why a Rendering Pipeline?

To isolate orchestration from presentation.

Rendering becomes predictable and reusable.

---

## Why a Registry?

To eliminate conditional rendering.

Instead of modifying the renderer every time a new section appears, the Engine
uses registration.

---

## Why Generic Pages?

Because every page follows the same lifecycle.

Only its data changes.

The rendering process remains identical.

---

## Why Section Abstractions?

Because sections represent reusable capabilities.

The Engine renders sections.

Applications define which sections exist.

---

# Evolution Strategy

The current architecture intentionally represents only the foundation.

Future capabilities should extend the Engine without changing its principles.

```
Current Engine
        │
        ▼
Metadata System
        │
        ▼
Documentation Pages
        │
        ▼
Markdown Support
        │
        ▼
Navigation Engine
        │
        ▼
Search Engine
        │
        ▼
Documentation Engine
        │
        ▼
Plugin System
```

Every new capability should integrate into the existing architecture instead of
replacing it.

---

# Design Goals

The Engine should always strive to be:

- Simple
- Predictable
- Extensible
- Reusable
- Framework-independent
- Domain-oriented

Whenever a new feature is proposed, it should reinforce these characteristics.

---

# Guiding Principle

The Logos Page Engine exists to transform structured domain knowledge into
navigable user experiences.

Its goal is not simply to render pages.

Its goal is to provide a stable architecture capable of representing knowledge
through reusable rendering capabilities.

Every architectural decision should answer one question:

> **Does this make the Engine simpler, more expressive and easier to evolve?**

If the answer is no, the decision should be reconsidered.

---

# Related Documents

- README.md
- ROADMAP.md
- CONTRIBUTING.md
- CHANGELOG.md

---

> **Think deeply. Decide quickly. Build continuously.**
