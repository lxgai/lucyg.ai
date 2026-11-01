# CLAUDE.md

## Project

Personal site for Lucy Gai: a text-first Next.js "digital garden" with home, projects, travels, favorites, blog, and a development-only travel-detail editor.

Use `docs/design.md` as the visual source of truth. The previous Memory Archive system is archived in `docs/design-memory-archive.md` for reference only.

## Stack

- Next.js 15 App Router
- React 19
- TypeScript with `strict: true`
- Public pages: plain React + CSS modules + CSS custom properties (no MUI)
- MUI v7 is still installed for the legacy travel detail pages; don't use it in new public UI
- Tailwind CSS v4 is configured and used in the admin editors
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
- `src/components/site/` - redesigned site chrome and shared UI: `SiteShell`, `Toc`, `ThemeToggle`, `Clock`, `Article`, `Tag`/`TagRow`/`Asterisks`
- `src/components/design/`, `src/components/travel/` - legacy Memory Archive components still used by travel detail pages and the editors
- `src/data/travel-details/` - JSON layouts for fixed-canvas travel detail pages
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

- Every public page renders inside `SiteShell`. Pass `toc` on Home (site nav) and article pages only; list pages have no TOC.
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

## Travel Detail System (legacy, pending redesign)

Trip pages such as `/travels/china-25` still use the fixed-canvas Memory Archive layout from `src/data/travel-details/*.json`, rendered by `TravelDetailPage` with the old `PageShell`. The redesign replaces them with single-column articles (stickers over photo corners, city h2s with the Chinese name, day-range sublines). That work, along with a single-column revamp of the editor, is deferred. Until then:

- Fixed design canvases per breakpoint: `large` 1440px, `medium` 1120px, `small` 470px, scaled to fit with a `0.94` multiplier.
- Drag and resize math uses unscaled design coordinates. Section widths stay in JSON but aren't editable; heights are.
- The legacy tokens (`--paper`, `--ink`, …) and Newsreader/Caveat fonts stay loaded for these pages. Remove them once the travel pages are redesigned.
- `scripts/generate-page-updated.mjs` still feeds the old metadata strip on these pages. Delete it, and `src/data/page-updated.ts`, after the travel redesign.

## Admin Travel Detail Editor

The editor at `/admin/travel-detail-editor` is development-only.

- It must call `notFound()` in production, and all `/api/admin/*` routes must return 404 in production before doing any file or request work.
- Be careful when touching save/load path handling; don't broaden write access beyond the project data files.
- It edits travel detail JSON under `src/data/travel-details/` and renders the same detail components as the public page at scale `1`.

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
