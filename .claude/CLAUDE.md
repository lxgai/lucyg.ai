# CLAUDE.md

## Project Overview

Personal portfolio site for Lucy — a design-focused, scrapbook-aesthetic website showcasing travel, projects, and interests.

## Tech Stack

- **Framework**: Next.js 15 (App Router) with React 19, TypeScript (strict)
- **UI**: Material-UI v7 (`@mui/material`) — primary component library
- **Styling**: MUI `sx` prop (primary), Tailwind CSS v4 (utility), CSS variables for fonts
- **Maps**: Leaflet + react-leaflet (travel pages)
- **Data**: Static JSON files (no database, no backend API)
- **Fonts**: VT323 (Google, retro mono), Cooper Light (local, serif headings), Roboto Mono (local, mono)

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
  app/            # Next.js App Router pages (file-based routing)
  components/     # Reusable React components (Header, PhotoGallery, TravelMap, Collage*)
  styles/         # globals.css (Tailwind imports, CSS vars, base styles)
  types/          # TypeScript interfaces (collage.ts, photo.ts)
  data/           # Static JSON data (travel collage layouts)
public/
  fonts/          # Local font files (Cooper, Roboto)
  images/         # Static images organized by page (home/, about/, travels/)
```

## Coding Conventions

- **All page components** use `"use client"` (interactivity required throughout)
- **Styling**: Use MUI `sx` prop with responsive object notation — `{ xs: ..., md: ..., lg: ... }`. Do not use CSS modules or styled-components.
- **Responsive breakpoints**: `xs` (mobile-first), `sm`, `md` (768+), `lg` (1024+), `xl` (1280+)
- **Page layout pattern**: Wrap in `<Box>` with `minHeight: "100svh"`, `width: "100%"`, `backgroundColor: "#f5ede6"`, `position: "relative"`, `overflow: "clip"`, and include `<Header />`. **Do not** use `width: "100vw"` or `overflowX: "hidden"` on root Boxes — see Scroll Gotchas below.
- **Images**: Always use `next/image` with explicit `width`/`height` or `fill`+`sizes`. Use `priority` for above-the-fold images.
- **Fonts via CSS vars**: `var(--font-cooper-light)` for headings, `var(--font-vt323)` for retro/mono, `var(--font-roboto-mono)` for header logo
- **Path alias**: `@/*` maps to `./src/*`
- **Naming**: PascalCase for types/components, camelCase for variables, kebab-case for route folders

## Key Patterns

- **Collage system** (travel pages): `CollageLayout` selects responsive variant (`large`/`medium`/`small`) from JSON data, passes to `CollageCanvas` which renders absolutely-positioned items (text/images) as % of canvas dimensions
- **Color palette**: Beige background (`#f5ede6`), dark brown text (`#2a2521`), pink accents (`#d877ab`)
- **Navigation**: `Header.tsx` — desktop horizontal nav + mobile hamburger drawer. Active route styled with pink + italic.
- **No state management library** — local React state only

## Scroll Gotchas

`<html>` must be the only vertical scroll container on the page. Two subtle rules cause extra/stuck scrollbars if violated:

1. **Never use `width: "100vw"` on root Boxes.** On Windows/Linux, `100vw` includes the vertical scrollbar width, so the Box ends up ~17px wider than the usable viewport. That creates a tiny horizontal overflow; on wheel events the browser hit-tests a nonexistent x-axis scroll and the rubber-band negotiation briefly stalls vertical scrolling. Use `width: "100%"` (sizes to the parent's content box, which already excludes the scrollbar).

2. **Never use `overflowX: "hidden"` on root Boxes — use `overflow: "clip"` instead.** Per the CSS spec, when one overflow axis is `hidden`/`scroll`/`auto` and the other is `visible`, the `visible` axis is computed to `auto`. So `overflowX: "hidden"` silently turns the Box into a vertical scroll container, and if its content is taller than the Box (common on the `small` collage breakpoint, where aspect ratio is 400%), you get a second scrollbar that eats wheel events before the page scrolls. `overflow: "clip"` clips both axes without establishing a scroll container.

3. **Do not set `overscroll-behavior` or `touch-action` on `<html>`/`<body>`.** The native bounce at scroll extremities is desired. Earlier `overscroll-behavior-y: none` + `touch-action: pan-y` were added as workarounds for the `100vw`/`overflowX: hidden` stall described above; once rules (1) and (2) are in place the stall is gone and the browser defaults should be left alone.

## Admin / Dev Tools

- **Collage Editor** (`/admin/collage-editor`): Visual editor for the JSON layout files that drive travel collage pages. Dev-only — guarded with `notFound()` in production.
  - Loads/saves JSON files in `src/data/travels/` via API routes under `/api/admin/collage/*`
  - Interactive canvas with drag-to-move, resize, rotate, and a properties sidebar
  - All `/api/admin/*` routes and the editor page return 404 in production — this guard must be the first line of every handler
