# Repository Guidelines

## Project Structure & Module Organization

This repository is a React 19, TypeScript, and Vite application. Application entry points are `src/main.tsx` and `src/App.tsx`. Reusable UI lives in `src/components/`; route-level screens belong in `src/pages/`, including service-specific pages under `src/pages/servicos/`. Business concepts, static content, repositories, and factories are grouped in `src/domain/`. Page-section registration and other application infrastructure belong in `src/core/`. Keep imported images in `src/assets/` and files that must be served unchanged in `public/`. Build output is generated in `dist/` and must not be committed.

## Build, Test, and Development Commands

- `npm install` installs the exact dependency versions recorded in `package-lock.json`.
- `npm run dev` starts the Vite development server with hot module replacement.
- `npm run build` runs the TypeScript project build, then creates the production bundle in `dist/`.
- `npm run lint` checks all TypeScript and React files with ESLint.
- `npm run preview` serves the production build locally for final verification.

Run `npm run lint && npm run build` before opening a pull request.

## Coding Style & Naming Conventions

Follow the existing TypeScript/TSX style: two-space indentation, single quotes, and no semicolons. Use PascalCase for React components, entities, and their files (`ServiceCard`, `PageFactory.ts`); use camelCase for functions, variables, and data modules (`servicesData.ts`). Keep component-specific files together in a named directory with an `index.tsx` when following the existing component pattern. Prefer typed domain models over unstructured objects. ESLint enforces recommended TypeScript, React Hooks, and Vite refresh rules; TypeScript also rejects unused locals and parameters.

## Testing Guidelines

No automated test framework or coverage threshold is configured yet. Until one is added, treat `npm run lint` and `npm run build` as required checks, and manually exercise affected routes with `npm run dev`. If adding tests, colocate them with the feature using `*.test.ts` or `*.test.tsx`, add an `npm test` script, and document the selected framework in the pull request.

## Commit & Pull Request Guidelines

Recent history follows Conventional Commit-style subjects, often with scopes: `feat(home): ...`, `refactor(services): ...`. Use an imperative, focused subject and an appropriate type such as `feat`, `fix`, `refactor`, or `docs`. Pull requests should explain the user-visible change, list validation performed, and link related issues. Include before/after screenshots for visual changes and call out new dependencies, routes, or configuration changes.
