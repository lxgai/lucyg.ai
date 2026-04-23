# CLAUDE.md

## Project Overview

Personal portfolio site for Lucy — an archival / document-style personal site cataloging travel, projects, writing, and favorites. Individual travel pages keep a scrapbook collage aesthetic; everything else uses a warm-paper, newsprint-style "Direction A" design.

## Tech Stack

- **Framework**: Next.js 15 (App Router) with React 19, TypeScript (strict)
- **UI**: Material-UI v7 (`@mui/material`) — primary component library
- **Styling**: MUI `sx` prop (primary), Tailwind CSS v4 (utility), CSS variables for fonts
- **Maps**: Leaflet + react-leaflet (travel pages, when used)
- **Data**: Static TS/JSON (no database, no backend API). Shared content lives in `src/data/content.ts`; trip collage layouts in `src/data/travels/*.json`.
- **Fonts**:
  - **Newsreader** (Google, serif) — primary body + display, used as `var(--font-newsreader)`
  - **JetBrains Mono** (Google) — all uppercase UI / meta / labels, used as `var(--font-jetbrains-mono)`
  - **Cooper Light** (local, serif) — legacy, still used inside the scrapbook trip pages
  - **VT323** (Google, retro mono) — legacy, still used inside the scrapbook trip pages
  - **Roboto Mono** (local) — available but no longer the primary UI font

## Commands

```bash
npm run dev       # Dev server on localhost:3000
npm run build     # Production build
npm run lint      # ESLint (Next.js + TypeScript rules)
```

No test framework is configured.

## Project Structure

```
src/
  app/                      # Next.js App Router pages (file-based routing)
    travels/<trip-id>/      # Individual trip pages (scrapbook collage — keep aesthetic as-is)
  components/
    design/                 # Direction-A primitives (Nav, PageShell, VinylPlayer, tokens, primitives)
    Header.tsx              # Thin re-export of design/Nav for legacy imports
    CollageLayout.tsx,
    CollageCanvas.tsx,
    PhotoGallery.tsx,
    TravelMap.tsx           # Scrapbook/collage primitives (trip pages)
  styles/                   # globals.css (Tailwind, CSS vars, paper texture, keyframes)
  types/                    # TypeScript interfaces (collage.ts, photo.ts)
  data/
    content.ts              # POSTS, PROJECTS, ALBUMS, TRACKLISTS, MOVIES, TRIPS
    travels/*.json          # Per-trip collage layouts (drive the scrapbook pages)
public/
  fonts/                    # Local font files (Cooper, Roboto)
  images/                   # Static images organized by page (home/, about/, favorites/, travels/)
```

## Design System (Direction A)

The site uses an "archival document" aesthetic: warm paper background, serif-italic for display, uppercase monospace for labels / meta / nav, and a navy accent.

- **Tokens**: `src/components/design/tokens.ts` — single source of truth for colors + font stacks.
  - `paper: #f1e9df`, `paperDeep: #e6dccb`, `paperCard: #fbf6ee`
  - `ink: #1f1a16`, `ink60`, `ink40`, `ink20`
  - `hair` / `hairStrong` — horizontal rules
  - `accent: oklch(0.38 0.08 250)` (navy)
  - `serif: var(--font-newsreader)`, `mono: var(--font-jetbrains-mono)`
- **CSS vars** (globals.css): `--paper`, `--ink`, `--accent`, plus `--font-newsreader` / `--font-jetbrains-mono` from `next/font/google` in `src/app/layout.tsx`.
- **Utility classes**: `.paper-a` (radial-gradient paper texture), `.page-fade` (enter animation).

## Shared Components

- **`design/Nav.tsx`** — sticky top nav. Serif-italic "Lucy Gai" + "EST. 2024", uppercase mono links, navy underline on active, mobile drawer on right. Use this (or the `Header` re-export) on every page; do not hand-roll navigation.
- **`design/PageShell.tsx`** — standard page frame. Renders Nav + optional section strip (`section` / `catNo` / updated-date) + optional hero title/subtitle + padded content. Use on every Direction-A page; the home page is the only intentional exception (custom hero layout).
- **`design/primitives.tsx`** — `Hair` (horizontal rule, solid or dashed), `CardLabel` (`CAT. X · № 001 · date`), `Pill` (uppercase mono tag).
- **`design/VinylPlayer.tsx`** — animated record used on Favorites/music.

## Coding Conventions

- **Client components**: Most pages use `"use client"` (interactivity throughout). PageShell is a client component, so any page using it is already client-side.
- **Page frame**:
  - For Direction-A pages, use `<PageShell>` and put content as children. Pass `section`, `catNo`, `title`, `subtitle` as needed.
  - Home (`src/app/page.tsx`) renders `<Nav />` directly and builds its own layout.
  - Scrapbook trip pages render `<Header />` (which is `<Nav />`) and then the collage — keep this pattern; don't force PageShell there.
- **Gutters**: Horizontal padding is standardized across Nav and PageShell as `px: { xs: 4, md: 10, lg: 13 }`. If you add a page that doesn't use PageShell, match these values.
- **Styling**: MUI `sx` prop with responsive object notation — `{ xs: ..., md: ..., lg: ... }`. No CSS modules, no styled-components.
- **Responsive breakpoints**: `xs` (mobile-first), `sm`, `md` (768+), `lg` (1024+), `xl` (1280+).
- **Typography rules**:
  - Display / titles → `fontFamily: tokens.serif`, often with `fontStyle: "italic"` for emphasis.
  - Meta / nav / labels / CAT·№ / tags → `fontFamily: tokens.mono`, `textTransform: "uppercase"`, `letterSpacing: ~1.4–1.6px`, `fontSize: 9–11`, `color: tokens.ink60` or `tokens.accent`.
  - Body → `tokens.serif`, `fontSize: 15–19`, `lineHeight ~1.5`.
- **Colors**: Pull from `tokens.*` — never hard-code hexes except in files that already define the tokens.
- **Images**: Always `next/image` with explicit `width`/`height` or `fill`+`sizes`. Use `priority` for above-the-fold.
- **Path alias**: `@/*` maps to `./src/*`.
- **Naming**: PascalCase for types/components, camelCase for variables, kebab-case for route folders.

## Key Patterns

- **Content data lives in `src/data/content.ts`** — pages import `POSTS`, `PROJECTS`, `ALBUMS`, `TRACKLISTS`, `MOVIES`, `TRIPS`. Add entries here; don't inline arrays in page files.
- **Trip pages are two layers**:
  1. `src/data/content.ts` `TRIPS[]` — card data for the `/travels` index (place, date, duration, cover, stamp).
  2. `src/app/travels/<trip-id>/page.tsx` — the scrapbook page itself. If a trip has a JSON layout in `src/data/travels/`, wire it with `CollageLayout`. If not, use `PageShell` with a "not filed yet" message (see `japan-24`, `netherlands-25`).
- **Scrapbook collage** (trip pages only): `CollageLayout` selects a responsive variant (`large`/`medium`/`small`) from JSON, passes it to `CollageCanvas` which renders absolutely-positioned items (text/images) as % of canvas dimensions. Keep the scrapbook aesthetic; these pages deliberately don't follow Direction A.
- **No state management library** — local React state only.

## Admin / Dev Tools

- **Collage Editor** (`/admin/collage-editor`): Visual editor for the JSON layout files that drive travel collage pages. Dev-only — guarded with `notFound()` in production.
  - Loads/saves JSON files in `src/data/travels/` via API routes under `/api/admin/collage/*`
  - Interactive canvas with drag-to-move, resize, rotate, and a properties sidebar
  - All `/api/admin/*` routes and the editor page return 404 in production — this guard must be the first line of every handler
