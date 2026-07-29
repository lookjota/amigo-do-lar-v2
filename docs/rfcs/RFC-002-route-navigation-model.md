# RFC-002 — Route & Navigation Model

- Status: Accepted
- Target version: v0.2.0
- Created: 2026-07-29
- Project: Logos Page Engine

## Context

The Engine already represents a page as domain data and renders it through a
stable pipeline. The Instituto Logos application, however, routed directly to a
Home component, which obtained one hardcoded page. The repository lookup by
slug did not participate in URL resolution.

Commercial applications such as Amigo do Lar need multiple pages, nested paths,
menus and breadcrumbs without adding route-specific behavior to
`PageRenderer` or `SectionRenderer`.

## Problem

There was no contract connecting a URL to a page slug, no central navigation
configuration and no pure way to order items, hide menu entries, represent
parents or derive breadcrumbs. The existing 404 link also bypassed the Vite
base path, and direct access to a nested `BrowserRouter` URL had no GitHub Pages
fallback.

## Decision

Routes and navigation use separate domain contracts:

- `RouteDefinition` maps a router path to a page slug;
- `NavigationItem` describes a link and its optional hierarchy.

They are separate because every route must resolve content, while not every
route must be visible in a menu. Conversely, navigation presentation can change
without changing route resolution.

The application owns concrete route and navigation configuration. React Router
turns each route definition into a route. A generic route screen asks the
existing `PageRepository` for its page and passes the result to the unchanged
`PageRenderer`.

## Goals

- Resolve two or more pages through `PageRepository.getBySlug`.
- Centralize route and navigation configuration.
- Support visible and hidden navigation items.
- Sort sibling items deterministically.
- Support one-parent hierarchy through `parentId`.
- Derive breadcrumbs without React or browser APIs.
- Detect invalid route, navigation and cross-configuration data.
- Preserve page-specific metadata.
- Provide application-level not-found handling.
- Support the configured GitHub Pages base path and direct deep links.

## Non-Goals

- Dynamic route parameters.
- Generic semantic relationships or a Knowledge Graph.
- Automatic previous/next links.
- Search, permissions, Markdown, CMS or plugins.
- Automatic sitemap generation.
- Multiple advanced menu regions.
- Internationalization.
- Server-side rendering.

## Terminology

- **Route path:** URL pathname interpreted by React Router, relative to its
  basename.
- **Page slug:** stable repository lookup key stored by `Page`.
- **Route definition:** mapping from route path to page slug.
- **Navigation item:** structured link that may be displayed by the
  presentation layer.
- **Breadcrumb:** ordered ancestor chain ending at the item for the current
  path.
- **Application:** the concrete Instituto Logos composition of content,
  repositories, configuration and presentation.

## Domain Model

```ts
interface RouteDefinition {
  path: string
  pageSlug: string
}

interface NavigationItem {
  id: string
  label: string
  path: string
  parentId?: string
  order?: number
  visible?: boolean
}
```

Route resolution uses `pageSlug` to preserve the existing repository contract
and the required URL-to-slug flow. `NavigationItem` has no page identity field:
navigation points to a route path, and the route owns the page slug. Neither
contract contains components, icons or callbacks.

IDs, route paths, navigation paths and page slugs are expected to be unique
within their application configuration.

## Route Resolution

The implemented flow is:

```text
URL pathname
  → React Router route
  → RouteDefinition.pageSlug
  → PageRepository.getBySlug(pageSlug)
  → Page | undefined
  → PageRenderer or not-found screen
```

`routes.ts` is the Instituto Logos route table. `PageRoute` is generic and does
not know individual pages. Adding a page changes content, repository data and
configuration, not either renderer.

## Navigation Resolution

Pure functions provide:

- visible, ordered root items;
- visible, ordered children for a parent;
- lookup by exact path;
- breadcrumb construction;
- configuration diagnostics.

`visible: false` affects only root and child menu queries. It does not remove
the item from path lookup, breadcrumbs or routing. Missing `order` is treated
as `0`; equal orders are sorted by label for deterministic output.

The current Instituto Logos header displays visible roots and their immediate
children. That presentation choice is not part of the domain contract.

## Breadcrumb Resolution

Breadcrumb resolution finds the navigation item whose `path` matches the
current pathname and follows `parentId` until a root is reached. The collected
chain is returned root-first.

An unknown path, missing parent or cycle produces an empty breadcrumb list.
Visited IDs prevent an accidental cycle from causing an infinite loop. The
application validates the same configuration at startup and reports duplicate
IDs, duplicate paths, missing parents and cycles. A self-referencing `parentId`
is reported as a cycle, and each detected cycle is reported once.

## Configuration Validation

Pure domain functions validate route definitions and their consistency with
navigation. Route diagnostics cover empty and duplicate paths, plus empty and
duplicate page slugs. Reusing a page slug for multiple route definitions is
treated as accidental configuration in this version.

Cross-configuration diagnostics report navigation paths without a matching
route and path conflicts caused by repeated route or navigation paths. Every
navigation item is a navigable link even when `visible: false`, so hidden items
are also checked. Routes are not required to appear in navigation.

At application startup, navigation, route and cross-configuration diagnostics
are collected into one configuration error before React renders. These checks
remain independent of `PageRepository`, React, React Router and browser APIs.

## Architectural Boundaries

- `src/domain/navigation` contains only TypeScript contracts and pure logic.
- It imports no React, React Router or browser API.
- `src/engine` keeps the existing repository and rendering contracts.
- `src/apps/instituto-logos/config` owns concrete routes and navigation.
- React Router integration, menu and breadcrumb markup remain in the
  application/presentation layer.
- The Engine contains no Instituto Logos or Amigo do Lar content.

The principle is: **the domain describes relationships and destinations; the
interface decides how to present them.**

## GitHub Pages Compatibility

Vite remains the single source of the deployment base
(`/logos-page-engine/`). `BrowserRouter` consumes `import.meta.env.BASE_URL`,
React Router `Link` components respect the basename, and static assets use
Vite's `%BASE_URL%` substitution.

The production build copies the generated SPA shell to `dist/404.html`.
GitHub Pages can therefore return the application shell for a direct request to
`/logos-page-engine/architecture`; `BrowserRouter` then resolves the retained
pathname. This is a static-host fallback, not the application 404 UI.

## Error and Not Found Handling

An unmatched React Router path renders `NotFoundPage`. If a configured route
refers to a slug absent from the repository, `PageRoute` renders the same page.
The repository continues to return `undefined` rather than throwing, keeping
not-found control at the application boundary. The return-home link uses React
Router and therefore respects the basename.

The not-found screen continues to publish `noindex, nofollow` metadata.

## Alternatives Considered

### Use `Page.slug` directly as every React Router path

Rejected because an explicit route mapping permits a URL contract to evolve
independently from storage lookup keys and makes the resolution step visible.

### Combine route and navigation into one contract

Rejected because menu visibility and hierarchy are presentation concerns that
must not determine whether a page is routable.

### Build a custom router

Rejected because React Router is already installed, active and compatible with
the required behavior.

### Use hash routing for GitHub Pages

Rejected because it would change clean paths such as `/architecture` into hash
URLs. Publishing the SPA shell as `404.html` preserves the route form.

### Add a test framework

Deferred because the repository has no test infrastructure and this RFC does
not justify introducing a dependency solely for the first resolver version.

## Risks

- GitHub Pages returns the fallback shell with an HTTP 404 status for an
  initially requested deep link even though the client subsequently renders
  the page.
- Exact path matching does not normalize trailing slashes.
- There are no automated regression tests for pure navigation functions.
- Client-rendered metadata retains the SEO limitations documented by RFC-001.

## Implementation Plan

1. Add framework-independent route and navigation contracts.
2. Add pure navigation queries, breadcrumb resolution and diagnostics.
3. Configure Instituto Logos routes and navigation centrally.
4. Expand its repository with a minimal architecture page.
5. Route every configured page through one repository-backed screen.
6. Add application-level menu and breadcrumb components.
7. Preserve not-found metadata and make links basename-aware.
8. Add the GitHub Pages deep-link fallback.
9. Synchronize architectural and release documentation.
10. Validate with lint, TypeScript production build and Git checks.

## Acceptance Criteria

- The domain imports neither React, React Router nor browser APIs.
- Route and navigation contracts are distinct and documented.
- `/` and `/architecture` resolve through the same repository and route screen.
- Both pages provide page-specific metadata.
- Adding the architecture page does not modify `PageRenderer` or
  `SectionRenderer`.
- Visible root/child items are ordered and `visible: false` is excluded from
  menu queries.
- Breadcrumbs support parent chains and safely reject unknown, broken or cyclic
  chains.
- Startup validation diagnoses invalid navigation, routes and mismatches between
  their paths.
- Unknown paths and unresolved configured slugs render the 404 screen.
- Home, route links, 404 return links and deep links respect the GitHub Pages
  base path.
- No test dependency is added while the project has no test infrastructure.
- Lint and production build pass.
