# Changelog

All notable changes to the Logos Page Engine are documented in this file.

The format follows the principles of
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and adheres to Semantic Versioning whenever applicable.

---

# [Unreleased]

## Added

### Engine

- Added domain contracts for page metadata and robots directives.
- Added browser rendering for title, canonical, search, Open Graph and Twitter
  metadata.
- Added framework-independent route and navigation contracts.
- Added pure navigation ordering, visibility, hierarchy, breadcrumb and
  configuration diagnostics.
- Added startup diagnostics for duplicate navigation paths, invalid route
  definitions and navigation paths without matching routes.
- Added a repository-backed `/architecture` page as a multipage proof.
- Added an application menu and derived breadcrumbs.

## Changed

### Engine

- Consolidated `Page` and `PageSection` as domain contracts.
- Updated page rendering to consume `page.metadata` and clear stale optional
  tags after navigation.
- Routed configured URLs through page slugs and `PageRepository`.
- Added a GitHub Pages SPA fallback for direct access to nested routes.
- Made internal route links and the favicon respect the configured Vite base.

### Documentation

- Added RFC-001 documenting the Metadata System and its architectural
  boundaries.
- Added RFC-002 documenting the Route & Navigation Model.
- Updated the architecture and roadmap for the implemented routing flow.

---

# [0.1.0] - 2026-07-25

## Added

### Engine

- Introduced the first public version of the Logos Page Engine.
- Implemented a domain-oriented Page abstraction.
- Introduced the PageSection abstraction.
- Added a generic Page Renderer.
- Added a generic Section Renderer.
- Implemented the Section Registry.
- Established the rendering pipeline.

### Website

- Published the first public version of the Instituto Logos website.
- Deployed automatically through GitHub Actions.
- Hosted on GitHub Pages.

### Documentation

- Added professional project README.
- Added Architecture Guide.
- Added public Roadmap.
- Added Contribution Guidelines.
- Added MIT License.
- Established project documentation standards.

---

# Future Releases

Future versions will be documented using the following categories:

## Added

New capabilities.

---

## Changed

Changes to existing behavior.

---

## Deprecated

Features scheduled for removal.

---

## Removed

Removed capabilities.

---

## Fixed

Bug fixes.

---

## Security

Security-related improvements.

---

> Every meaningful architectural evolution should be reflected in this document.
