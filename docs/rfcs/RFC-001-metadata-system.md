# RFC-001 — Metadata System

- Status: Accepted
- Target version: v0.2.0
- Created: 2026-07-25
- Project: Logos Page Engine

---

## Context

The Logos Page Engine represents pages through domain entities.

Until now, page identity, content and presentation metadata have not been
represented through a dedicated domain contract.

Metadata is required for:

- page titles
- descriptions
- search indexing
- canonical URLs
- authorship
- publication dates
- social sharing
- browser metadata
- future sitemap generation

This information must belong to the page domain without coupling the domain to
React, HTML or browser APIs.

---

## Problem

Without a metadata abstraction:

- metadata may become scattered across components
- pages may depend directly on browser APIs
- SEO configuration may be duplicated
- content adapters may produce inconsistent page structures
- future systems such as search and navigation may lack a stable contract

The Engine needs a framework-independent metadata model.

---

## Decision

Introduce a `PageMetadata` domain contract.

A `Page` will contain metadata and sections:

```ts
interface Page {
  id: string
  slug: string
  metadata: PageMetadata
  sections: PageSection[]
}