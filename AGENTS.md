# AGENTS.md — Coding Agent Guidelines

This file provides instructions for AI coding agents working in this repository.

---

## Project Overview

A personal blog/portfolio site built with [Astro](https://astro.build/), deployed as a static site to Cloudflare Pages.
Content is authored in MDX. Styling uses plain CSS with CSS custom properties; Tailwind is listed as a dependency but
not actively used in source. TypeScript is used throughout in strict mode.

Key technologies:

- **Astro 4** (static output, `output: "static"`)
- **TypeScript 5** (strict, `astro/tsconfigs/strict`)
- **MDX** (`@astrojs/mdx`) for blog posts
- **astro-icon** for SVG icons
- **Prettier** with `prettier-plugin-astro` for formatting
- **Cloudflare Pages** / Wrangler for deployment

---

## Repository Layout

```
src/
  components/     # Reusable Astro components (BaseHead, Header, Footer, …)
  content/        # Content collections
    blog/         # MDX blog posts
    config.ts     # Zod schema for collections
  layouts/        # Page layouts (BaseLayout, BlogPostLayout)
  pages/          # File-based routing
    index.astro
    about.astro
    blog/[...slug].astro
  styles/         # Global CSS
  consts.ts       # Site-wide constants and data (SITE_TITLE, SOCIAL_LINKS, cv)
  env.d.ts        # Ambient type declarations
public/           # Static assets served as-is
astro.config.mjs  # Astro configuration
tsconfig.json     # TypeScript configuration
.prettierrc.mjs   # Prettier configuration
wrangler.toml     # Cloudflare Workers/Pages config
```

---

## Commands

### Development

```bash
npm run dev          # Start Astro dev server (hot-reload)
npm run start        # Alias for dev
```

### Build & Type-check

```bash
npm run build        # astro check (type-check) + astro build
```

Always run `npm run build` before committing to catch TypeScript and Astro type errors. The `astro check` step is
part of the build command; there is no separate lint step.

### Preview

```bash
npm run preview      # Build then serve locally via Wrangler (Cloudflare Pages emulation)
```

### Deploy

```bash
npm run deploy       # Build + deploy to Cloudflare Pages via Wrangler
```

### Cloudflare type generation

```bash
npm run cf-typegen   # Regenerate Cloudflare Workers types (wrangler types)
```

### Testing

There is currently **no test suite** in this project. When tests are added, update this section. Until then, the
primary validation is:

1. `npm run build` — type-checks and builds successfully
2. `npm run preview` — manually verify pages render correctly

---

## Code Style

### Formatter — Prettier

Configuration is in `.prettierrc.mjs`. Always run Prettier before committing.

```
printWidth:    120
tabWidth:      2 (spaces)
semi:          false   ← no semicolons
trailingComma: "es5"   ← trailing commas where valid in ES5
plugins:       prettier-plugin-astro
```

Astro files use the `astro` parser override automatically. Run:

```bash
npx prettier --write "src/**/*.{ts,astro,mdx,css}"
```

### TypeScript

- Extends `astro/tsconfigs/strict` with `strictNullChecks: true`.
- Prefer explicit types on function parameters and return values.
- Use `type` imports where the value is only needed at the type level:
  ```ts
  import type { CollectionEntry } from "astro:content"
  ```
- Avoid `any`; prefer `unknown` and narrow.
- No enums — use `const` objects or union string types instead.

### Imports

- Use ES module `import`/`export` syntax (package is `"type": "module"`).
- Order imports: external packages first, then internal paths (relative).
- Use relative paths for intra-`src` imports (e.g., `"../layouts/BaseLayout.astro"`).
- Use Astro virtual imports (`astro:content`, `astro:assets`) for framework APIs.
- No default exports for data/constants — use named exports (see `consts.ts`).

### Naming Conventions

| Entity             | Convention                         | Example                                        |
| ------------------ | ---------------------------------- | ---------------------------------------------- |
| Files/Components   | PascalCase `.astro`                | `BaseLayout.astro`                             |
| TypeScript files   | camelCase `.ts`                    | `consts.ts`, `config.ts`                       |
| Exported constants | SCREAMING_SNAKE_CASE               | `SITE_TITLE`, `SOCIAL_LINKS`                   |
| CSS classes        | snake_case or kebab-case           | `.primary_variant`, `.dates`                   |
| Props types        | `Props` (local alias in each file) | `type Props = CollectionEntry<"blog">["data"]` |
| Collection names   | lowercase singular                 | `"blog"`                                       |

### Astro Components

- Frontmatter (the `---` fence) contains all TypeScript/imports.
- Props are typed by declaring `type Props = ...` and destructuring from `Astro.props`.
- Scoped `<style>` blocks are preferred for component-local styles.
- Use `<slot />` for content injection in layouts.
- Inline `<script>` blocks are allowed for minimal client-side JS; avoid heavy client-side logic.

### CSS / Styling

- Global styles live in `src/styles/global.css`, imported once via `BaseHead.astro`.
- `normalize.css` is imported globally in `BaseHead.astro`.
- Use CSS custom properties (`var(--token-name)`) for theme values.
- Scoped `<style>` blocks inside `.astro` files are preferred over utility classes.
- Tailwind is available but not currently used — do not introduce it without discussion.

### Content Collections

- Blog post frontmatter must satisfy the Zod schema in `src/content/config.ts`:
  - `title: string` (required)
  - `description: string` (required)
  - `pubDate: date` (required, coerced from string)
  - `updatedDate?: date` (optional)
  - `tags: string[]` (required)
- Blog posts live in `src/content/blog/` as `.mdx` files.

### Error Handling

- Prefer returning `undefined` / optional types over throwing in data-fetching helpers.
- Let Astro surface build errors at `astro check` time via TypeScript.
- For async page data, use `await` at the top of the frontmatter block; errors will abort
  the build with a clear message.

### Constants and Site Data

- All global/site-wide constants belong in `src/consts.ts` and are named exports.
- Do not scatter magic strings across components — import from `consts.ts`.

---

## Adding New Content

### New blog post

Create `src/content/blog/my-post-title.mdx` with frontmatter:

```mdx
---
title: "My Post Title"
description: "A short description."
pubDate: 2026-02-26
tags: ["tag1", "tag2"]
---

Post body in MDX.
```

### New page

Add `src/pages/my-page.astro`. Use `BaseLayout` as the root layout.

### New component

Add `src/components/MyComponent.astro`. Export nothing from layout/page components;
export named types/utilities from `.ts` files.

---

## Git / Workflow Notes

- Node version is pinned in `.nvmrc` and `.tool-versions` — use the specified version.
- Run `npm run build` before every commit to ensure no type errors and a clean build.
- Cloudflare adapter is present in `package.json` but commented out in `astro.config.mjs`;
  the site is currently fully static. Do not enable the adapter without updating both files.
