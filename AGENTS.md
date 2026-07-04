# AGENTS.md

## Project

Personal site for Lucy Gai. This is a design-focused Next.js portfolio with sections for home, blog, travels, projects, favorites, about, links, and a development-only travel-detail editor.

Use `docs/design.md` as the visual source of truth for the site's Memory Archive design system.

## Stack

- Next.js 15 App Router
- React 19
- TypeScript with `strict: true`
- MUI v7 / Joy UI available; most UI is currently MUI `sx`
- Tailwind CSS v4 is configured and used in the admin editor
- Static JSON data under `src/data/`; no database

## Commands

```bash
npm run dev
npm run build
npm run lint
```

There is no test framework configured. Before handing off code changes, run `npm run lint` and `npm run build` when practical.

Note: `npm run lint` currently maps to `next lint`; verify it still works with the installed Next version before relying on it.

## Important Paths

- `src/app/` - App Router pages and API routes
- `src/components/` - shared components such as `Header`, `PhotoGallery`
- `src/data/travel-details/` - JSON layouts for fixed-canvas travel detail pages
- `src/data/blog-tags.ts` - local tag mapping for Substack-imported blog entries
- `src/data/substack/sample-feed.xml` - fixture RSS feed for local Substack integration testing
- `src/lib/substack.ts` - server-only Substack RSS importer and sanitizer
- `src/types/` - shared TypeScript types
- `src/styles/globals.css` - global CSS, Tailwind import, font variables
- `docs/design.md` - current design system and copy guidance
- `.claude/CLAUDE.md` - older but still useful implementation notes, especially scroll and admin-editor details

## Design Direction

The intended aesthetic is "Memory Archive": a quiet personal archive / library card catalog with structured, editorial layouts.

Follow these defaults for new or refreshed public-facing UI:

- Background paper: `#f1e9df`
- Secondary paper: `#e6dccb`
- Card paper: `#fbf6ee`
- Primary ink: `#1f1a16`
- Secondary ink: `#5a4e43`
- Metadata ink: `#8a7e70`
- Hairline: `rgba(31, 26, 22, 0.2)`
- Strong hairline: `rgba(31, 26, 22, 0.55)`
- Accent rose: `rgb(163, 91, 115)`, used sparingly

Typography direction:

- Display serif should be Newsreader for headings, page titles, place names, post titles, and other human/editorial content.
- Mono should be JetBrains Mono for metadata, section labels, catalog numbers, dates, and taxonomy.
- Newsreader and JetBrains Mono are the only typefaces; do not introduce others.

Layout direction:

- Desktop page gutters: about `56px`
- Mobile gutters: about `20px`
- Use wide horizontal containers and generous whitespace.
- Section pages should use the shared metadata strip (filled accent "tab" for the section name, no top/bottom rules) with section name, REF label, dotted leader, and tight-dot updated date on desktop. On small screens, show only the tab; hide the REF label, dotted leader, and updated date.
- Page titles should be large serif type with one italicized word where appropriate.
- Navigation should be sticky, hairline-bordered, with active links underlined in the accent color.

Metadata strip dates:

- `UPDATED` labels are generated into `src/data/page-updated.ts` by `scripts/generate-page-updated.mjs`.
- Render dates with tight dots, for example `UPDATED 04·22·26`.
- The generator runs on `predev` and `prebuild`; run `npm run generate:page-updated` manually after date-source changes while a dev server is already running.
- Each route has a source-file list in `scripts/generate-page-updated.mjs`. If any listed source is dirty in Git, that route uses today's date; otherwise it uses the latest committed date for those sources.
- When moving section data, update the route source list so unrelated section edits do not bump each other's metadata dates.

Metadata strip REF labels:

- Home uses `REF. 00`.
- Listing/index pages use `REF. {letter}-IDX` (`A=Projects`, `B=Travels`, `C=Favorites`, `D=Blog`, `E=About`).
- Detail pages use `REF. {letter}-{nn}` from the entry's archive position, such as `REF. B-01` for China.
- Detail page section tabs follow `SECTION {letter} · {SERIES} / {ENTRY}`: middot `·` for the series prefix, forward slash `/` before the specific entry name (e.g. `SECTION B · TRAVELS / CHINA`, `SECTION A · PROJECTS / {slug}`). Do not separate the entry name with a middot.
- Do not use `file:`/`FILE:` text in public metadata strips.
- Detail page back links (`← Projects`, `← Travels`, `← Blog`) sit directly below the strip and above content.
- Use actual arrow glyphs in visible public UI (`←`, `→`, `↗`); never use ASCII substitutes such as `<-` or `->`.
- Blog detail keeps `Also on Substack ↗` out of the strip; place it centered below the post title area near tags.

Copy direction:

- Quiet and considered, not chatty.
- Prefer archival words such as "Cataloged", "Filed", and "Entry".
- Mono labels can be taxonomic, for example `SERIES C · TRAVELS` or `REF. C-IDX`.
- Use italics for places and titles, not generic emphasis.

## Coding Conventions

- Keep page components client-side when they need hooks, browser APIs, MUI interactivity, or match the existing page pattern.
- Use the `@/*` alias for imports from `src`.
- Prefer MUI `sx` responsive object notation for public UI unless working in an area already using Tailwind.
- Use `next/image` for images with explicit `width`/`height`, or `fill` plus `sizes`.
- Use `priority` only for above-the-fold images.
- Keep route folders kebab-case and components/types PascalCase.
- Prefer local React state; no global state library is configured.
- Preserve TypeScript strictness and avoid `any` unless a narrow, documented escape hatch is genuinely needed.

## Page Layout And Scroll Rules

For root page wrappers:

- Use `minHeight: "100svh"`.
- Use `width: "100%"`, not `width: "100vw"`.
- Use `overflow: "clip"` when clipping is needed.
- Do not use `overflowX: "hidden"` on root boxes.
- Do not set `overscroll-behavior` or `touch-action` on `html` or `body`.

The document should remain the only vertical scroll container. Using `100vw` or `overflowX: hidden` on page roots can create horizontal overflow or accidental nested vertical scroll containers, especially on Windows/Linux.

## Blog And Substack

The public blog uses Substack as the primary source when configured.

- `SUBSTACK_FEED_URL` points at the publication RSS feed, usually `https://your-subdomain.substack.com/feed`.
- `SUBSTACK_USE_SAMPLE_FEED=1` forces the committed fixture feed at `src/data/substack/sample-feed.xml`.
- `SUBSTACK_EMBED_URL` optionally enables the official Substack subscribe iframe.
- If no feed is configured or feed parsing fails, the site falls back to local `POSTS` from `src/data/content.ts`.
- Substack RSS often does not expose editor tags. Add personal-site tags by slug in `src/data/blog-tags.ts`.
- Do not add a generic fallback tag such as `entry`; entries with no RSS or local tags should render without tag chips.
- Imported article HTML must remain sanitized in `src/lib/substack.ts`; do not render raw feed HTML directly.
- Keep RSS images rendered through sanitized HTML/CSS instead of `next/image`, unless a deliberate remote image policy is added.

## Travel Detail System

Detailed trip pages, such as `/travels/china-24`, use travel detail JSON from `src/data/travel-details/`.

- Travel detail content uses fixed design canvases per breakpoint: `large` 1440px, `medium` 1120px, and `small` 470px.
- The public page renders the fixed travel detail block centered and scaled to fit the available page width. The current public scale multiplier is `0.94`.
- The site nav and public metadata strip are normal site chrome and must not be inside the scaled travel detail surface.
- The scaled travel detail block starts below the metadata strip and includes hero, section canvases, and closing content.
- The dev editor preview renders the selected breakpoint at exact scale `1` for stable drag and resize coordinates.
- Hero layout is editable through travel detail JSON: image frame, copy block, tape decorations, and per-breakpoint hero canvas height.
- Section canvas widths define the horizontal coordinate system. Do not expose editable section width controls in the editor; only section heights should be editable per breakpoint.
- Drag and resize math should continue to use unscaled design coordinates.

## Admin Travel Detail Editor

The editor at `/admin/travel-detail-editor` is development-only.

- It must call `notFound()` in production, and all `/api/admin/*` routes must return 404 in production before doing any file or request work.
- Be careful when touching save/load path handling; do not broaden write access beyond the project data files.
- It edits travel detail JSON under `src/data/travel-details/`.
- It should render the same detail components as the public page where practical, but in fixed preview mode at scale `1`.
- The hero can be visually edited by selecting and dragging its image frame, copy block, and tape pieces in the preview.
- Keep section width values in JSON/types for compatibility, but do not make them editable in the UI.
- Height controls are allowed because they change vertical canvas space without changing the horizontal coordinate contract.

## Implementation Notes

- The current working tree may contain user edits. Do not revert unrelated changes.
- Keep changes scoped to the requested feature or fix.
- If updating the design system implementation, prefer adding clear shared constants/helpers only when they reduce real duplication.
- Do not introduce new UI libraries unless the task requires it.
- Avoid decorative one-off assets or layouts that conflict with the archive/catalog direction.
- Public pages should be responsive at mobile `<=768px`; multi-column layouts collapse to one column.

## Verification

For code changes, Codex should stop once TypeScript and lint pass:

```bash
npx tsc --noEmit
npm run lint
```

Lucy will run dependency installation, production builds, and dev servers herself. Do not run these unless she explicitly asks in that turn:

```bash
npm install
npm run build
npm run dev
```

When visual changes are involved, describe what should be checked at desktop and mobile widths instead of starting the dev server. Pay special attention to text overflow, scroll behavior, and whether legacy styling was unintentionally preserved where the new Memory Archive design should apply.
