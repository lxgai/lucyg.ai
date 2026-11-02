# CLAUDE.md

## Project

Personal site for Lucy Gai: a text-first Next.js "digital garden" with home, projects, travels, favorites, blog, and a development-only travel-detail editor.

Use `docs/design.md` as the visual source of truth. The previous Memory Archive system is archived in `docs/design-memory-archive.md` for reference only.

## Stack

- Next.js 15 App Router
- React 19
- TypeScript with `strict: true`
- Public pages: plain React + CSS modules + CSS custom properties (no MUI)
- No MUI or other UI component library; don't add one
- Tailwind CSS v4 is configured and used in the admin editor
- Static data under `src/data/`, project write-ups in `src/content/projects/`, blog posts from the Substack RSS feed; no database

## Commands

```bash
npm run dev
npm run build
npm run lint
```

There is no test framework configured.

Note: `npm run lint` currently maps to `next lint`; verify it still works with the installed Next version before relying on it.

## Important Paths

- `src/app/` - App Router pages and API routes
- `src/components/site/` - redesigned site chrome and shared UI: `SiteShell`, `Toc`, `ThemeToggle`, `Clock`, `Article`, `Tag`/`TagRow`/`ExpandableTags`/`Asterisks`
- `src/components/travel/` - `TravelArticle` and canvas helpers
- `src/data/travel-articles/` - travel articles, edited in the dev editor
- `src/lib/` - Substack and Letterboxd feeds, date and slug helpers, article HTML prep
- `src/styles/globals.css` - design tokens, theme, global resets
- `docs/design.md` - current design system

## Design Direction

Quiet, three-column, text-first (modelled on the Markdown site-generator Quartz). No cards, shadows, divider lines or decorative icons. One playful element per page at most.

Tokens are CSS variables in `src/styles/globals.css`; never hard-code colors in components.

- `--light` background, `--darkgray` body text and links, `--dark` headings, `--underline` (jade) for link underlines, tags, asterisks and arrows, `--gray` idle TOC links, `--lightgray` code backgrounds, placeholders and table rules.
- Muted text is `color: var(--darkgray); opacity: .6`, never a separate gray.
- Light/dark is `data-theme` on `<html>`; every new style must work in both.

Typography (the only four families; don't add others in new UI):

- DM Serif Display (`--font-heading`): headings, titles, sidebar items.
- Bricolage Grotesque (`--font-body`): body and UI.
- Nothing You Could Do (`--font-hand`): dates, captions, greeting, sign-off.
- JetBrains Mono (`--font-code`): labels, clock, track numbers, inline code.

Layout:

- Every public page renders inside `SiteShell`, and every page passes `toc`: `SITE_NAV` (`src/components/site/siteNav.ts`) on Home and the index pages (Projects, Travels, Blog); on Favorites and article pages, `siteNavWith(sectionHref, contents)`, which nests the page's contents under its section's link.
- Main column max 720px. TOC column appears at ≥1240px, otherwise the TOC sits in the sidebar.
- The sidebar wraps above main below ~904px. Multi-column rows inside main stack below 560px where they'd get too narrow.
- Use real arrow glyphs (`→`, `←`) in visible UI, never ASCII substitutes.
- Removed patterns that must not come back: the metadata strip, `SECTION X · REF.` labels, catalog numbers, the About, Links and Portfolio pages, the subscribe form.

## Coding Conventions

- Prefer server components. Use `"use client"` only for interactive pieces (theme toggle, TOC collapse, clock, accordions, audio).
- `SiteShell` is server-only (it reads the Substack feed). Client pages must be split into a server `page.tsx` that renders `SiteShell` around a client component.
- Style with a CSS module next to the component. Reuse `ui.module.css` and `article.module.css` before adding new rules.
- When two modules style the same element, don't rely on CSS load order. Add a variant to the owning component instead.
- Use the `@/*` alias for imports from `src`.
- Use `next/image`. For images of unknown size use `width={0} height={0}` with `sizes` and CSS `width: 100%; height: auto`.
- Use `priority` only for above-the-fold images.
- Keep route folders kebab-case and components/types PascalCase.
- Preserve TypeScript strictness and avoid `any`.

## Page Layout And Scroll Rules

For root page wrappers:

- Use `min-height: 100svh`.
- Use `width: 100%`, not `100vw`.
- Use `overflow: clip` when clipping is needed; don't use `overflow-x: hidden` on root boxes.
- Don't set `overscroll-behavior` or `touch-action` on `html` or `body`.

The document should remain the only vertical scroll container.

## Travel Articles

Trip pages are single-column articles. Each trip lives in `src/data/travel-articles/<slug>.json` (`TravelArticle` in `src/types/travelArticle.ts`), is registered in `TRAVEL_ARTICLES` in `src/data/travelEntries.ts`, and renders with `TravelArticle` inside `SiteShell`.

- An article is a title, place, start/end dates, city tags and a flat list of blocks: `image` (full column width, optional caption), `text` (a blank line starts a new paragraph), `section` (h2 or h3 with optional alt. title and subtitle) and `canvas`.
- When the first block is a canvas it is the hero and renders above the title (`splitHero` in `TravelArticle.tsx`, shared with the editor). Every trip opens with one.
- The TOC is the site nav with the trip nested under Travels, built from the blocks: the page title, h2 sections under it, h3 sections under the h2 before them.
- A canvas is exactly the column's width with an editable height, and clips its content. Item coordinates are px in a 720px design space (`CANVAS_WIDTH`); the public page scales the whole canvas, text included, to the column width. Backgrounds are limited to the six cutout treatments in `BACKGROUNDS` (`src/components/travel/travelCanvas.ts`).
- Keep `TravelBlock` a discriminated union rendered with an exhaustive `switch`.

New trips are scaffolded with the `add-trip` skill. `npm run refresh:travel-bucket -- <slug>` re-syncs a trip's image list with the bucket.

## Admin Travel Editor

The editor at `/admin/travel-detail-editor` is development-only.

- It must call `notFound()` in production, and all `/api/admin/*` routes must return 404 in production before doing any file or request work.
- Be careful when touching save/load path handling; don't broaden write access. The travel article routes (`/api/admin/travel-article/*`) only read and write existing files in `src/data/travel-articles/`, via `src/lib/travelArticleFiles.ts`.
- It edits travel articles only, and renders the same block components as the public page with the column at its real 720px width, so canvas coordinates are 1:1.

## Implementation Notes

- The working tree may contain user edits. Don't revert unrelated changes.
- Keep changes scoped to the requested feature or fix.
- Don't introduce new UI libraries unless the task requires it.

## Verification

For code changes, stop once TypeScript and lint pass:

```bash
npx tsc --noEmit
npm run lint
```

Lucy runs dependency installation, production builds and dev servers herself. Don't run these unless she explicitly asks in that turn:

```bash
npm install
npm run build
npm run dev
```

When visual changes are involved, describe what to check at desktop (≥1240px), tablet (~900px) and mobile (~375px) widths, in both light and dark mode.
