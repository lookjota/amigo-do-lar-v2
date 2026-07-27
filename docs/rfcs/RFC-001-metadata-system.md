# RFC-001 — Metadata System

- Status: Accepted
- Target version: v0.2.0
- Created: 2026-07-25
- Project: Logos Page Engine

## Context

The Logos Page Engine represents pages as domain data and delegates their
presentation to a React rendering pipeline. Page identity, sections and browser
metadata need one stable contract that remains independent of the source of the
content.

## Problem

The original `Page` contract stored `title` and an `seo` object in the Engine,
while `PageRenderer` manipulated browser tags directly. This mixed domain data
with presentation concerns, covered only title and description, and allowed
metadata from a previous route to remain in the document.

## Decision

Metadata is represented by `PageMetadata` and `RobotsMetadata` in the domain.
The existing `Page` contract owns a required `metadata` property. A dedicated
React renderer translates that contract into browser head elements.

## Goals

- Provide a typed, framework-independent metadata contract.
- Keep one `Page` and one `PageSection` definition.
- Render browser, search and basic social metadata consistently.
- Remove stale optional metadata after navigation.
- Preserve the existing page and section rendering pipeline.

## Non-Goals

- Parse Markdown or define a content storage format.
- Generate sitemaps, feeds or structured data.
- Perform server-side rendering.
- Validate URL or timestamp formats at runtime.
- Add platform-specific social metadata beyond basic Open Graph and Twitter
  tags.

## Domain Model

```ts
interface RobotsMetadata {
  index?: boolean
  follow?: boolean
}

interface PageMetadata {
  title: string
  description?: string
  keywords?: string[]
  author?: string
  locale?: string
  canonicalUrl?: string
  image?: string
  robots?: RobotsMetadata
  publishedAt?: string
  updatedAt?: string
}

interface Page {
  id: string
  slug: string
  metadata: PageMetadata
  sections: PageSection[]
}
```

`publishedAt` and `updatedAt` are retained as domain information. This first
browser renderer does not emit article metadata because page type semantics have
not yet been introduced.

## Architectural Boundaries

The contracts live under `src/domain` and import neither React nor browser APIs.
`BrowserMetadataRenderer` lives beside the existing React renderers in
`src/engine`. It alone translates `PageMetadata` to `document.head`.

The Engine consumes a complete `Page`; it does not fetch content or infer how
the page was created.

## Rendering Integration

`PageRenderer` renders `BrowserMetadataRenderer` with `page.metadata` before
mapping the unchanged `page.sections` through `SectionRenderer`.

The browser renderer:

- sets `document.title`;
- creates, updates or removes description, keywords, author and robots tags;
- creates, updates or removes the canonical link;
- manages basic Open Graph tags, including `og:type=website`, with `property`;
- manages basic Twitter tags with `name`;
- removes optional tags when the next metadata value omits them.

Standalone route screens, such as the current not-found page, may use the same
renderer directly until they are represented as engine `Page` objects.

## Content Source Independence

Any repository, static TypeScript module, API adapter, CMS or future Markdown
adapter may construct the domain contract. Metadata rendering receives only
`PageMetadata` and has no knowledge of the originating source.

## Compatibility

Existing section types, payloads, ordering, registry bindings, components,
styles and visible Home content remain unchanged. `src/engine/page.ts` remains
as a compatibility facade that re-exports the canonical domain types, avoiding
a second contract during migration.

Consumers of the old `Page.title` and `Page.seo` shape must migrate to
`Page.metadata`.

## Alternatives Considered

### Keep metadata inside `PageRenderer`

Rejected because it makes section orchestration responsible for browser head
details and is difficult to reuse for standalone screens.

### Use a third-party head-management package

Rejected for the initial implementation because the required client-side
behavior is small and does not justify a new dependency.

### Store HTML tag definitions in the domain

Rejected because tags, attributes and `document` are presentation concerns.

### Couple metadata to Markdown front matter

Rejected because it would make the Engine depend on one content source.

## Risks

- Client-side effects run after the initial HTML is delivered, so crawlers that
  do not execute JavaScript will see only static `index.html` metadata.
- Multiple head managers on the same page could compete for the same tags.
- Canonical URLs must be supplied correctly by each application.
- Social previews without a real image remain text-only.

## Implementation Plan

1. Establish `PageMetadata`, `RobotsMetadata`, `Page` and `PageSection` as
   canonical domain contracts.
2. Migrate page definitions and repositories to those contracts.
3. Add `BrowserMetadataRenderer`.
4. Integrate it with `PageRenderer` and standalone route screens.
5. Document the decision and release change.
6. Validate with lint and production build.

## Acceptance Criteria

- The domain imports neither React nor browser APIs.
- Exactly one canonical `Page` and `PageSection` definition exists.
- Every concrete engine page provides `id`, `slug`, `metadata` and `sections`.
- Home sections and visible content render unchanged.
- Title, description, keywords, author, robots, canonical, Open Graph and
  Twitter metadata are created or updated correctly.
- Optional tags absent from the next page are removed.
- Open Graph uses `meta[property]`; Twitter uses `meta[name]`.
- No unverified Open Graph image is added.
- The RFC and `Unreleased` changelog describe the implemented behavior.
- Lint and production build pass.
