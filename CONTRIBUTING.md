# Contributing

> Thank you for your interest in contributing to the Logos Page Engine.
>
> This document describes the development workflow, engineering principles and
> contribution guidelines adopted by the project.

---

# Welcome

The Logos Page Engine is an open-source project developed by the Instituto Logos.

Its purpose is to investigate how structured domain models can be transformed
into reusable rendering capabilities.

Every contribution should preserve the architectural principles that define the
Engine.

Before contributing, we strongly recommend reading:

- README.md
- ARCHITECTURE.md
- ROADMAP.md

Understanding the architecture is more important than understanding the code.

---

# Engineering Philosophy

The Engine follows a simple philosophy:

> Simplicity is preferred over cleverness.

Architecture exists to reduce complexity.

Never to increase it.

Every contribution should make the Engine:

- simpler
- more expressive
- easier to extend
- easier to maintain

---

# Core Principles

Every contribution should respect these principles.

## Domain First

The domain represents reality.

The UI represents the domain.

Never the opposite.

---

## Stable Contracts

Avoid breaking public abstractions.

Whenever possible, extend existing capabilities instead of replacing them.

---

## Composition Over Duplication

Prefer reusable abstractions.

Avoid copy-and-paste implementations.

---

## Separation of Concerns

Every layer has a single responsibility.

```
Domain

↓

Rendering

↓

Presentation
```

Responsibilities should never overlap.

---

## Documentation as Part of the Product

Documentation is not an afterthought.

Code and documentation evolve together.

Whenever architecture changes, documentation should be updated accordingly.

---

# Development Workflow

Every contribution follows the same workflow.

```
Idea

↓

Discussion

↓

Architecture

↓

Implementation

↓

Documentation

↓

Pull Request
```

Large architectural changes should be discussed before implementation.

---

# Coding Standards

The project follows a few simple rules.

## TypeScript

- Prefer strict typing.
- Avoid unnecessary use of `any`.
- Keep types explicit whenever possible.

---

## Components

Components should:

- have one responsibility
- remain small
- remain reusable

Business rules should never live inside UI components.

---

## Functions

Functions should:

- perform one task
- have descriptive names
- remain easy to test

---

## Files

Prefer multiple small files over one large file.

---

# Architectural Rules

These rules should rarely change.

## Rule 1

The Domain never imports React.

---

## Rule 2

The Rendering layer never contains business rules.

---

## Rule 3

The Registry only maps abstractions.

It should never implement application logic.

---

## Rule 4

Pages describe content.

Components describe presentation.

---

## Rule 5

Infrastructure depends on Domain.

Domain never depends on Infrastructure.

---

# Pull Requests

A Pull Request should answer four questions.

## What changed?

Describe the change.

---

## Why?

Explain the motivation.

---

## How?

Describe the implementation.

---

## Documentation Updated?

If architecture changed, documentation should also be updated.

---

# Commit Messages

Prefer concise commit messages.

Examples:

```
feat: add markdown page support

fix: resolve registry lookup

refactor: simplify page renderer

docs: update architecture guide

test: improve renderer coverage
```

---

# Code Reviews

During review we prioritize:

- simplicity
- readability
- architecture
- maintainability

Micro-optimizations are rarely preferred over clarity.

---

# Reporting Issues

When reporting bugs, include:

- expected behavior
- observed behavior
- reproduction steps
- screenshots (if applicable)

---

# Feature Requests

Feature requests should describe:

- the problem
- the motivation
- the proposed capability

Prefer describing capabilities instead of isolated features.

Example:

❌ Add FAQ page.

✔ Allow any page to render FAQ sections.

---

# Documentation

Every major architectural change should update one or more of the following:

- README.md
- ARCHITECTURE.md
- ROADMAP.md
- CHANGELOG.md

The documentation should always reflect the current state of the Engine.

---

# Community

We welcome discussions about:

- architecture
- rendering systems
- domain modeling
- documentation
- software engineering

Respectful and constructive discussions are encouraged.

---

# Guiding Principle

The Logos Page Engine is built around one central idea:

> Build reusable capabilities instead of isolated features.

Every contribution should move the Engine closer to this objective.

---

Thank you for helping build the Logos Page Engine.