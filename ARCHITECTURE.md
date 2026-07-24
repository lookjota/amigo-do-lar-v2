# Architecture

> This document describes the architecture of the Logos Page Engine.
>
> It explains the core concepts, architectural decisions, rendering pipeline and
> design principles that guide the evolution of the Engine.

---

# Table of Contents

1. Vision
2. Design Philosophy
3. Architectural Principles
4. High-Level Architecture
5. Core Domain
6. Rendering Pipeline
7. Registry
8. Project Structure
9. Design Decisions
10. Future Evolution

---

# Vision

The Logos Page Engine is a domain-oriented rendering engine.

Instead of describing pages as trees of React components, pages are represented
as domain entities that are interpreted by a rendering pipeline.

The goal is to completely separate:

- what a page is

from

- how it is rendered.

This allows the Engine to evolve independently from the user interface.

---

# Design Philosophy

Traditional applications usually follow this flow:

```

React Component
↓
React Component
↓
React Component

```

The page is manually assembled.

The Logos Page Engine follows another philosophy.

```

Domain
↓

Page

↓

Renderer

↓

React

```

React becomes only an implementation detail.

The domain remains the source of truth.

---

# Architectural Principles

The Engine follows a small set of architectural principles.

## 1. Domain First

The domain describes reality.

Infrastructure implements reality.

React should never define the domain.

---

## 2. Declarative Composition

Pages declare **what exists**.

The Engine decides **how it is rendered**.

---

## 3. Stable Contracts

Pages should evolve without requiring changes in the rendering pipeline.

---

## 4. Separation of Concerns

Each layer has one responsibility.

Domain

↓

Renderer

↓

Presentation

---

## 5. Extensibility

Adding new sections should require registration instead of modifying the Engine.

---

# High-Level Architecture

```

                Page Repository
                       │
                       ▼
                    Page Entity
                       │
                       ▼
                 Page Renderer
                       │
                       ▼
               Section Renderer
                       │
                       ▼
                  Section Registry
                       │
                       ▼
                 React Components
                       │
                       ▼
                    Browser

```

The rendering pipeline is linear and deterministic.

Every page follows exactly the same flow.

---

# Core Domain

The Engine is built around two domain entities.

## Page

Represents an entire page.

Responsibilities:

- identity
- metadata
- route
- sections

Example:

```

Page

id
slug
title
sections[]

```

---

## PageSection

Represents one block of content.

Responsibilities:

- identify the section
- store its configuration
- expose its type

Example:

```

PageSection

id
type
props

```

Notice that the PageSection knows nothing about React.

It is pure domain.

---

# Rendering Pipeline

The rendering process always follows the same sequence.

```

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

React Component

↓

HTML

```

## Repository

Provides a Page.

The repository never renders.

---

## PageRenderer

Iterates through every section.

Its only responsibility is orchestration.

---

## SectionRenderer

Receives a PageSection.

Requests the appropriate component from the Registry.

---

## Registry

Maps:

```

Section Type

↓

React Component

```

This completely decouples the domain from the UI.

---

## React Component

Receives only the properties necessary to render the section.

No business rules should exist here.

---

# Registry

The Registry is one of the most important abstractions in the Engine.

Instead of using conditional rendering:

```

if (...)

Hero

else

Benefits

else

FAQ

```

The Engine performs a lookup.

```

Hero

↓

HeroComponent

```

```

Benefits

↓

BenefitsComponent

```

```

FAQ

↓

FaqComponent

```

This allows new section types to be added without modifying the rendering pipeline.

---

# Project Structure

```

src/

├── domain/
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

The directory structure mirrors the architecture.

---

# Design Decisions

## Why Domain First?

Because the UI changes frequently.

The business model changes much less.

---

## Why a Registry?

To eliminate conditional rendering and centralize component resolution.

---

## Why Renderers?

To isolate orchestration from presentation.

---

## Why Page entities?

Because pages belong to the domain.

They should exist independently from React.

---

# Future Evolution

The current Engine is only the foundation.

The architecture was intentionally designed to support future capabilities.

Planned evolution:

```

Current Engine

↓

Markdown Renderer

↓

Documentation Pages

↓

Navigation Engine

↓

Search Engine

↓

Documentation Engine

↓

Plugin System

↓

Knowledge Engine

```

Each new capability should extend the Engine without modifying its architectural principles.

---

# Guiding Principle

The Engine exists to answer one question:

> How can knowledge be represented as a living structure instead of a static interface?

Every architectural decision should reinforce this objective.

If a change makes the Engine more coupled,
more rigid,
or less expressive,

it should be reconsidered.

---

# Related Documents

- README.md
- ROADMAP.md
- CHANGELOG.md
- CONTRIBUTING.md

---

> Think deeply.
>
> Decide quickly.
>
> Build continuously.
