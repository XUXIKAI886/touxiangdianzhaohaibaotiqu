# Repository Guidelines

## Project Structure & Module Organization
- `app/` contains App Router entry points; `page.tsx` is the hub, and `app/meituan/page.tsx` plus `app/eleme/page.tsx` deliver provider-specific extraction flows.
- `components/ui/` hosts reusable shadcn-style primitives; extend these before adding new component folders to preserve consistent styling and semantics.
- `lib/utils.ts` holds pure helpers, while `public/` stores static samples; deployment rules live in `.github/`, `next.config.js`, and `vercel.json`.

## Build, Test, and Development Commands
- `npm install` (Node 18+) refreshes dependencies after each pull; rerun whenever the lockfile changes.
- `npm run dev` starts the Next 14 dev server on http://localhost:3000 with Tailwind JIT; `start.bat` mirrors the same workflow for Windows.
- `npm run lint` executes the Next/ESLint bundle—treat warnings as blockers; `npm run build` exports the site to `out/`, which you can preview via `npx serve out`.

## Coding Style & Naming Conventions
- Prefer TypeScript server components and add `"use client"` only when browser APIs are required.
- Use PascalCase for components (`PosterGrid.tsx`), camelCase for helpers, kebab-case for assets, and default to two-space indentation with single quotes.
- Import through the `@/*` alias instead of deep relatives, and compose styles primarily with Tailwind utilities layered layout → color → state.

## Testing Guidelines
- No automated runner is configured yet, so document manual verification across Meituan and Eleme flows with every change.
- When you add tests, wire `vitest` + `@testing-library/react`, expose them through `npm run test`, and co-locate suites in `__tests__/` directories.
- Name test files `*.spec.tsx`, cover both success and failure paths, and target high-risk parsing helpers first.

## Commit & Pull Request Guidelines
- Mirror the short-tag format already in history (`修复:`, `增强:`, `文档:`) and keep subjects imperative and scoped.
- Squash noisy WIP commits; each pushed commit should lint clean and describe a reviewable change.
- PRs need a summary, linked issue when relevant, validation notes, and screenshots or GIFs for UI adjustments.

## Deployment & Configuration Tips
- `next.config.js` is tuned for static export and whitelists remote image domains; update the list when new hosts appear.
- Set `GITHUB_PAGES=true` locally to confirm the basePath/assetPrefix combo before publishing to GitHub Pages.
- Keep `vercel.json`, `.vercelignore`, and the committed `out/` folder aligned so that builds stay lean and deterministic.
