> Documento histórico: nomes e caminhos de código abaixo registram a estrutura existente na data da análise e não representam links para a árvore atual.\n\n# Page Engine v1 — Architectural Analysis

## Purpose and scope

This report reconstructs the Page Engine v1 architecture from the code currently present in the Amigo do Lar repository. It documents implemented behavior, active runtime flows, inactive supporting abstractions, and dependencies between domain, application, infrastructure, presentation, configuration, and data.

The repository does not formally define `application` or `infrastructure` directories. The layer classification below is therefore based on the actual responsibilities and imports of each symbol, while retaining the project's physical organization.

## Executive summary

The engine renders a page as an ordered collection of declarative sections. A page or service contains `PageSection[]`; each section carries an identifier, a type, and untyped content. `PageRenderer` iterates over the collection, `SectionRenderer` resolves the section type through `pageSectionRegistry`, and the selected React component interprets and presents the section data.

The effective runtime pipeline is:

```text
Page or Service definition
→ concrete repository
→ route/page orchestration
→ PageRenderer
→ SectionRenderer
→ pageSectionRegistry
→ React section component
```

Four section types are registered: `hero`, `benefits`, `faq`, and `cta`. The service flow is executable for the `eletricista` service. The Home uses the same renderer but currently supplies an empty section list. `PageFactory` and `ServicePageModel` exist in the repository but are not part of the active execution path.

## Repository structure relevant to the engine

```text
src/
├── components/
│   ├── DynamicPageFactory.tsx
│   ├── PageRenderer/index.tsx
│   ├── SectionRenderer/index.tsx
│   └── service/
│       ├── HeroSection/index.tsx
│       ├── BenefitsSection/index.tsx
│       ├── FaqSection/index.tsx
│       ├── CtaSection/index.tsx
│       ├── ServicesSection/index.tsx
│       ├── ServiceGrid/index.tsx
│       └── ServiceCard/index.tsx
├── core/
│   └── registry/pageSectionRegistry.ts
├── domain/
│   ├── data/
│   │   ├── pages/homePage.ts
│   │   ├── citiesData.ts
│   │   ├── serviceAreasData.ts
│   │   └── servicesData.ts
│   ├── entities/
│   ├── factories/PageFactory.ts
│   ├── models/ServicePageModel.ts
│   └── repositories/
├── pages/
│   ├── Home.tsx
│   └── ServicePage/
├── App.tsx
└── main.tsx
```

## Architectural layers

### Domain

The domain contracts are React-independent TypeScript interfaces under `src/domain/entities`.

#### Renderable page

``Page`` represents a generic page with `slug`, `title`, `seo`, and `sections`. Its `sections: PageSection[]` field is the connection between a page definition and the rendering engine.

#### Service

``Service`` represents a commercial service. It contains `slug`, `title`, `description`, `seo`, and `sections`. Consequently, it carries both business information and the complete visual composition used by `ServicePage`.

The shared `slug`, `title`, `seo`, and `sections` fields allow a `Service` to be projected to a `Page`, although the active service flow does not perform that projection.

#### Section abstraction

``PageSection`` is the engine's central unit:

```ts
export interface PageSection {
  id: string;
  type: PageSectionType;
  data: unknown;
}
```

- `id` identifies the section and becomes its React key.
- `type` determines which registered component will render it.
- `data` carries component-specific content without encoding that content's type in `PageSection`.

``PageSectionType`` exists as both a runtime constant and a literal union type. It declares `HERO`, `BENEFITS`, `FAQ`, and `CTA`, whose values are used in page data and as registry keys.

#### Section content contracts

The content expected by registered components is described by:

- ``Hero``: title, subtitle, image, primary button, and optional secondary button.
- ``Benefit``: title, description, icon, and optional highlight flag.
- ``Faq``: question and answer.
- ``Cta``: title, description, button text, and button link.
- ``Seo``: search, canonical, robots, and Open Graph metadata.

These interfaces do not import React or browser APIs. The association between a section type and one of these content shapes is conventional rather than encoded in the `PageSection` type. Each React component performs its own type assertion.

#### Geographic domain

``City`` describes an attended city. ``ServiceArea`` represents the relationship between a service and a city through `serviceSlug` and `citySlug`. `ServiceArea` participates in route availability checks but is not passed to the renderer.

### Application

There is no dedicated application directory. Application orchestration is distributed across route-facing components and pages.

``App`` declares two routes:

```text
/                         → Home
/:citySlug/:serviceSlug   → DynamicPageFactory
```

``Home`` obtains the Home page through `PageRepository.getHome()` and supplies `page.sections` to `PageRenderer`. It also places `Navbar` and `WhatsAppButton` around the engine output; those elements are not page sections.

``DynamicPageFactory`` orchestrates the dynamic service route. It:

1. reads `citySlug` and `serviceSlug` with React Router's `useParams`;
2. resolves the service through `ServiceRepository.getBySlug`;
3. checks the relationship through `ServiceAreaRepository.exists`;
4. returns an error heading or `ServicePage`.

Despite its name, this symbol does not create a domain `Page` and does not call `PageFactory`.

``ServicePage`` adapts a resolved `Service` to the renderer by passing `service.sections` to `PageRenderer`. Its ``ServicePageProps`` also requires `citySlug`, but `ServicePage` does not use that value.

### Infrastructure

The project has no external API, database, CMS, HTTP client, or persistent state. Its current infrastructure consists of the browser runtime, React Router, static TypeScript data, and the build toolchain.

``main.tsx`` is the browser bootstrap. It locates `#root`, creates the React root, enables `StrictMode`, and mounts `App`.

``App`` uses `BrowserRouter`, `Routes`, and `Route`. ``DynamicPageFactory`` depends on that routing infrastructure through `useParams`.

The repository classes under `src/domain/repositories` act as concrete data-access implementations. They import local arrays directly rather than depending on repository interfaces or injected data sources.

### Presentation

Presentation comprises pages, renderers, the visual registry, and React section components.

#### Page renderer

``PageRenderer`` accepts `sections: PageSection[]`. It preserves array order, maps every section to `SectionRenderer`, and uses `section.id` as the React key. It does not know `Page`, `Service`, repositories, route parameters, or concrete section types.

#### Section renderer

``SectionRenderer`` accepts one `PageSection`, reads `section.type`, and looks up a component in `pageSectionRegistry`. It renders the selected component with the complete section:

```tsx
const Component = pageSectionRegistry[section.type];

if (!Component) {
  return null;
}

return <Component section={section} />;
```

An unresolved type produces no visual output or diagnostic because the renderer returns `null`.

#### Registry

``pageSectionRegistry`` is the composition point between domain identifiers and React implementations:

```text
PageSectionType.HERO     → HeroSection
PageSectionType.BENEFITS → BenefitsSection
PageSectionType.FAQ      → FaqSection
PageSectionType.CTA      → CtaSection
```

The registry does not render, query data, or create sections. It imports both `PageSectionType` and the four concrete React components. `SectionRenderer`, not `PageRenderer`, is its direct consumer.

#### Registered section components

``HeroSection`` treats `section.data` as `Hero` and renders its title, subtitle, and primary button text. It does not currently render `Hero.image` or `Hero.secondaryButton`, and the primary button has no action.

``BenefitsSection`` treats `section.data` as `Benefit[]` and renders cards containing titles and descriptions. It does not consume `Benefit.icon` or `Benefit.highlight`.

``FaqSection`` treats `section.data` as `Faq[]` and renders static question-and-answer articles.

``CtaSection`` treats `section.data` as `Cta` and renders a title, description, and external link.

All four components receive the generic `PageSection`, then assert the expected content type locally. None queries a repository or reads route parameters.

#### Related but unregistered components

``ServicesSection``, ``ServiceGrid``, and ``ServiceCard`` form a service-list presentation path. `ServicesSection` calls `ServiceRepository.getAll()` directly. No `SERVICES` value exists in `PageSectionType`, and these components are absent from `pageSectionRegistry`; therefore they are not part of declarative page rendering.

The older ``Hero``, ``Feature``, ``ServicosPremium``, ``About``, and ``Contact`` components are not used by the active Home. Their former composition remains commented in `Home.tsx`.

The components under `src/pages/servicos` are text-only placeholders and are not referenced by the routes in `App.tsx`.

### Configuration and data

#### Home definition

``homePage`` is a `Page` with slug, title, SEO, and sections. Its Hero, Benefits, and CTA examples are commented out, leaving `sections` empty. Consequently, the Home reaches `PageRenderer` but produces no registered section components.

#### Service definitions

``servicesData`` is the service catalog. It contains one `Service`, `eletricista`, with Hero, Benefits, FAQ, and CTA sections in that order. The array position is the order ultimately preserved by `PageRenderer`.

The same module exports `getServiceBySlug`, but the active route uses `ServiceRepository.getBySlug` instead.

The configured Hero image path is `/images/services/eletricista/hero.webp`, while the registered `HeroSection` does not render the image. The CTA link is stored as `https://wa.me/...` and is passed unchanged to the anchor rendered by `CtaSection`.

#### Geographic definitions

``citiesData`` declares Brasília, Águas Claras, Taguatinga, Guará, and Ceilândia. No active symbol imports this array, and ``CityRepository.ts`` is empty.

``serviceAreasData`` declares these relationships:

```text
eletricista / brasilia
eletricista / aguas-claras
hidraulica  / brasilia
pintura     / taguatinga
```

Only `eletricista` exists in `servicesData`. The other two service relationships cannot reach `ServicePage`, because `DynamicPageFactory` resolves the service before checking availability.

#### Build configuration

[`vite.config.ts`](../../vite.config.ts) enables the React and Tailwind Vite plugins. [`tsconfig.app.json`](../../tsconfig.app.json) configures modern JSX and rejects unused locals and parameters. [`eslint.config.js`](../../eslint.config.js) applies the recommended JavaScript, TypeScript, React Hooks, and React Refresh rules. [`package.json`](../../package.json) exposes `dev`, `build`, `lint`, and `preview` scripts.

These files provide the execution and validation environment but are not part of runtime page resolution.

## Repositories

### PageRepository

``PageRepository`` stores a local `pages` array containing only `homePage` and exposes:

- `getAll(): Page[]`;
- `getBySlug(slug): Page | undefined`;
- `getHome(): Page`.

The active Home calls `getHome`. The repository imports its concrete source, `homePage`, directly.

### ServiceRepository

``ServiceRepository`` imports `servicesData` and exposes `getAll()` and `getBySlug(slug)`. `DynamicPageFactory` uses `getBySlug`; `ServicesSection`, outside the registered engine flow, uses `getAll`.

### ServiceAreaRepository

``ServiceAreaRepository`` imports `serviceAreasData` and exposes `getAll()` and `exists(serviceSlug, citySlug)`. `DynamicPageFactory` uses `exists` to permit or reject the URL combination.

The relationship is checked by exact string comparison and is not validated against `citiesData` or `servicesData` by the repository.

## Factory and page model

``PageFactory.fromService`` accepts a `Service` and returns a `Page` by copying `slug`, `title`, `seo`, and `sections`. No current module imports or calls `PageFactory`; the service route sends `Service.sections` directly to the renderer.

``ServicePageModel`` declares the expected sequence and required status of a service page:

| Section | Required | Order |
|---|---:|---:|
| Hero | yes | 1 |
| Benefits | yes | 2 |
| FAQ | no | 3 |
| CTA | yes | 4 |

No repository, factory, page, or renderer imports `ServicePageModel`. It neither validates nor sorts the current section definitions. Runtime order comes only from the `sections` array.

## Complete runtime flows

### Home flow

```text
homePage
src/domain/data/pages/homePage.ts
        │ Page
        ▼
PageRepository.getHome()
src/domain/repositories/PageRepository.ts
        │ Page
        ▼
Home
src/pages/Home.tsx
        │ page.sections
        ▼
PageRenderer
src/components/PageRenderer/index.tsx
        │ each PageSection
        ▼
SectionRenderer
src/components/SectionRenderer/index.tsx
        │ section.type
        ▼
pageSectionRegistry
src/core/registry/pageSectionRegistry.ts
        │ concrete component
        ▼
HeroSection | BenefitsSection | FaqSection | CtaSection
```

The current flow stops producing output at `PageRenderer` because `homePage.sections` is empty. `Navbar` and `WhatsAppButton` are rendered separately by `Home`.

### Dynamic service flow

For `/brasilia/eletricista`:

```text
App route /:citySlug/:serviceSlug
        │ "brasilia", "eletricista"
        ▼
DynamicPageFactory.useParams()
        │ serviceSlug
        ▼
ServiceRepository.getBySlug("eletricista")
        │ Service | undefined
        ▼
ServiceAreaRepository.exists("eletricista", "brasilia")
        │ boolean
        ▼
DynamicPageFactory
        │ Service + citySlug
        ▼
ServicePage
        │ service.sections
        ▼
PageRenderer
        │ each PageSection in array order
        ▼
SectionRenderer
        │ pageSectionRegistry[section.type]
        ▼
HeroSection | BenefitsSection | FaqSection | CtaSection
```

The same path is available for `/aguas-claras/eletricista`. `citySlug` is used by the availability check and passed to `ServicePage`, but does not change the rendered content.

## Dependency map

### Domain dependencies

The entity contracts import only other domain types. They do not import React, React Router, browser APIs, repositories, or concrete data sources.

`Page` and `Service` both depend on `PageSection`, so the domain objects include the engine's visual composition model. `Service` therefore combines service information, SEO, and page structure.

### Application-to-domain dependencies

`Home` depends on `PageRepository` and `PageRenderer`. `DynamicPageFactory` depends on `ServiceRepository`, `ServiceAreaRepository`, React Router, and `ServicePage`. `ServicePage` depends on the `Service` contract through `ServicePageProps` and on `PageRenderer` for output.

### Repository-to-data dependencies

Each implemented repository imports a concrete static module. There are no repository interfaces or alternative adapters in the current code. Data acquisition is synchronous and returns the in-memory objects.

### Presentation-to-domain dependencies

`PageRenderer` and `SectionRenderer` depend on `PageSection`. Each registered section component depends on `PageSection` plus its expected content interface. `ServicesSection` additionally depends directly on `ServiceRepository`.

### Registry dependencies

`pageSectionRegistry` imports `PageSectionType` from the domain and concrete React components from presentation. `SectionRenderer`, located in presentation, imports the registry from `core`. This produces the layer-level relationship:

```text
components/SectionRenderer → core/registry
core/registry → components/service/*
```

There is no direct module cycle because registered section components do not import `SectionRenderer` or the registry.

## Confirmed implementation state

- The Page Engine's active primitives are `PageSection`, `PageSectionType`, `pageSectionRegistry`, `PageRenderer`, `SectionRenderer`, and the four registered section components.
- The dynamic service path uses `Service` directly; it does not use `PageFactory`.
- `ServicePageModel` is descriptive but disconnected from execution.
- Home is connected to `PageRepository` and `PageRenderer`, but its section array is empty.
- Only `eletricista` is present in `servicesData`.
- `citiesData` is currently disconnected and `CityRepository.ts` is empty.
- `ServicesSection`, `ServiceGrid`, and `ServiceCard` are implemented but unregistered.
- The legacy Home components and service-specific placeholder pages are outside the active Page Engine flow.
- SEO data is stored on `Page` and `Service`, but no current page or renderer applies it to the document.
- `PageSection.data` remains `unknown`; component-level assertions provide the only connection to the content interfaces.

## Architectural conclusion

Page Engine v1 is a data-driven React rendering pipeline whose decisive operation is the lookup from `PageSection.type` to a concrete component. Page and service definitions determine content and order; repositories expose those definitions; route-facing application components select an eligible definition; and the two-level renderer delegates each section through the registry.

The engine's active boundary is narrower than the complete set of abstractions present in the repository. `PageFactory`, `ServicePageModel`, city data, service-list components, legacy Home components, and specific service placeholders do not currently participate in the central runtime path. This distinction is essential when describing the implemented v1: the executable engine is the section definition, iteration, registry lookup, and React component rendering chain documented above.
