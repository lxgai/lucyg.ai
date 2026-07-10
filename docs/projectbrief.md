# Project Brief — Memory Archive (lucyg.ai)


## Summary


**lucyg.ai** is a design-focused personal website for Lucy Gai, built as a "Memory Archive":
a quiet personal site styled after a library card catalog rather than a conventional portfolio
or feed. It collects writing, travel journals, projects, and favorites into structured,
editorial layouts unified by a single design system. The site is built on Next.js 15 (App
Router) and React 19 with TypeScript in strict mode, stores its content as typed static JSON
(no database), and pulls in a few external sources — a Substack blog feed, Spotify album data,
and Letterboxd films. A custom, development-only visual editor lets the author lay out
freeform "scrapbook" travel pages, and a set of project-specific Claude Code skills automates
the repetitive content work.


## Tech stack


| Area | Choice |
| --- | --- |
| Framework | Next.js `15.5.7` (App Router) |
| UI runtime | React `19.2.3` |
| Language | TypeScript `5`, `strict: true`, target ES2017, `@/*` → `src/*` path alias |
| Styling | MUI Material `7` (`sx` props) for public UI; Tailwind CSS `4` (dev dependency) for the admin editor; Emotion as MUI's styling engine |
| Content parsing | `fast-xml-parser` (Substack RSS) + `sanitize-html` (untrusted feed HTML) |
| Markdown | `react-markdown` |
| Images | `next/image` with remote patterns pointing at an external image bucket |
| Data | Static JSON / TypeScript modules under `src/data/` — no database |
| Tooling | ESLint `9` (`next/core-web-vitals` + `next/typescript`), Node `.mjs` scripts |


A few stack notes worth calling out:


- **No database and no CMS.** Content lives in version control as typed data files. The
  trade-off — editing means committing code — is deliberate for a single-author site.
- **Two styling systems on purpose.** Public pages use MUI's `sx` responsive object notation;
  the admin editor uses Tailwind. They're kept in separate areas rather than mixed.
- **External services are reached over the network, not via SDKs.** There's no Supabase,
  Spotify, or Letterboxd client library in `package.json`. Images resolve to a configured
  remote host via `next/image`; integrations run through Node scripts and a couple of API
  routes.


## Architecture


**App Router with server-first rendering.** Pages live under `src/app/` as folders, with
dynamic routes for `projects/[slug]`, `travels/[id]`, and `blog/[slug]`. Pages are React
Server Components by default; components that need hooks, browser APIs, or interactivity
(`Nav`, `TravelDetailPage`, `VinylPlayer`, `PhotoGallery`, `TravelMap`) opt in with
`"use client"`.


**Static data as a content model.** `src/data/` holds the source of truth: `travels.ts`
(`TRIPS`), `projects.ts` (`PROJECTS`), `favorites.ts` (albums, tracklists, films), and
per-trip layout files in `src/data/travel-details/*.json`. Shared TypeScript types in
`src/types/` describe these shapes so the data and the components that render it stay in sync.


**Image pipeline.** `src/lib/images.ts` normalizes local-looking paths (e.g.
`/images/travels/...`) and resolves them to an external image bucket. `next.config.ts` reads
`NEXT_PUBLIC_SITE_IMAGE_BASE_URL` and registers it as an allowed `remotePatterns` host so
`next/image` can optimize remote assets (quality tiers 75/85/100).


**Content pipeline with graceful fallback.** `src/lib/substack.ts` (a `server-only` module)
fetches the configured Substack RSS feed, parses it with `fast-xml-parser`, and sanitizes each
post's HTML with an explicit tag/attribute allowlist before rendering. Network results are
cached with Next.js ISR at a one-hour revalidation window (`REVALIDATE_SECONDS = 60 * 60`). If
the feed is missing, returns a non-OK status, or fails to parse, the code falls back to local
posts — the blog never hard-fails on an external dependency.


**Build hook for freshness.** `predev` and `prebuild` run `scripts/generate-page-updated.mjs`,
which regenerates the "last updated" timestamps shown in each page's metadata strip, so the
catalog dates stay current without manual edits.


## Features


- **Home** — an editorial landing page with a "Lately" block surfacing the latest blog post,
  recent music, current trip, and active project as quick links.
- **Blog** — an index plus per-post detail pages backed by the Substack feed (with the local
  fallback above), including related-post links and an "Also on Substack ↗" out-link.
- **Travels** — an index with a sortable card carousel, and rich per-trip detail "journals"
  (see below) featuring freeform image/text layouts, and a photo lightbox.
- **Projects** — an index "spread list" and detail pages with a specs grid (stack, status,
  dates) and optional by-the-numbers metrics.
- **Favorites** — a music view with a custom vinyl-player UI, an album grid, and tracklists
  synced from Spotify; plus a films view backed by Letterboxd.
- **About / Links** — a two-column about page with a contact index, and a minimal links page.


## What makes it technically interesting


### The fixed-canvas travel-detail system


The travel journals are the centerpiece. Instead of a flowing responsive layout, each trip is
authored on **fixed design canvases per breakpoint** — large `1440px`, medium `1120px`, small
`470px`. Every element (image, text, tape decoration) stores a per-breakpoint layout with a
deliberate **coordinate contract**:


- horizontal position and width are expressed as **percentages of the canvas width**;
- vertical position is expressed in **absolute pixels**;
- plus rotation, z-index, and a visibility flag.


On the public page the entire canvas is rendered and then **scaled to fit the available width**
with a CSS transform, measured live via a `ResizeObserver`, with a `0.94` multiplier for
breathing room. Because positions are percentages of the canvas, scaling the container down
keeps every element in the right relative place — no per-element recomputation. The admin
editor renders the same components at **scale `1`** so drag and resize math operates on stable,
unscaled design coordinates. This separation — *edit in design space, display in scaled space*
— is what keeps the whole system simple.


### Automated responsive derivation


Authoring three breakpoints by hand would be tedious, so only the `large` layout is authored
manually. `scripts/derive-travel-layouts.mjs` derives the other two: **medium** is a faithful
proportional shrink (percentages carry over, pixel offsets scale by the width ratio, rotation
preserved), and **small** is an auto-generated single-column stack (full-width blocks, rotation
flattened, ordered by reading order, heights estimated from image aspect ratios). The script
only changes vertical/height values — it never touches canvas widths, preserving the
coordinate contract.


### The Memory Archive design system


The aesthetic is enforced by a small, strict system rather than ad-hoc styling:


- **Two typefaces only** — Newsreader (serif) for editorial/human content, JetBrains Mono for
  metadata, labels, and catalog numbers.
- **A tight palette** defined as tokens (`src/components/design/tokens.ts`): warm "paper"
  backgrounds, layered "ink" text shades, hairline borders, and one rose accent used sparingly.
- **A shared metadata strip** with an archival taxonomy: a filled accent section "tab", a
  `REF.` catalog number (`REF. 00` for home, `REF. B-IDX` for the travels index, `REF. B-01`
  for the first trip), a dotted leader, and tight-dot dates like `UPDATED 04·22·26`.
- **A quiet, archival copy voice** — "Cataloged", "Filed", "Entry" — documented in
  `docs/design.md` as the visual and editorial source of truth.


### A development-only editor, contained safely


The travel-detail editor lives at `/admin/travel-detail-editor` and is never exposed in
production: the page calls `notFound()` when `NODE_ENV === "production"`, and every
`/api/admin/*` route returns 404 before doing any file work. The save/load routes validate the
trip slug against a strict regex and resolve paths defensively so writes can only land inside
`src/data/travel-details/` — guarding against path traversal even on a personal project.


### Custom Claude Code skills as project tooling


The repository ships its own automation as Claude Code skills under `.claude/skills/`, turning
repetitive, error-prone content chores into repeatable, verified workflows:


- **`add-trip`** — scaffolds a new travel entry end-to-end (JSON, route page, index entries,
  asset manifest) while keeping the slug identical across every file.
- **`derive-travel-layouts`** — runs the responsive derivation described above.
- **`design-check`** — audits changes against the design system (tokens, type, metadata strip,
  scroll rules, copy voice).
- **`manage-albums`** — adds/removes/reorders favorites albums, keeping titles consistent across
  data files and re-syncing tracklists.


## What you could learn building this (new to web dev / frontend)


This project is an unusually complete tour of modern frontend concepts. For someone newer to
web development — especially building alongside a tool like Claude Code — here's what's
genuinely learnable from it, and where each idea shows up.


**The React + Next.js mental model.** The whole site is composition: small components taking
`props` and returning UI. The App Router teaches **file-based routing** (a folder under
`src/app/` becomes a URL) and **dynamic routes** (`[slug]`, `[id]`). The most important modern
distinction is **Server Components vs. Client Components** — most pages render on the server for
free, and you only reach for `"use client"` when you need state, effects, or browser APIs. The
blog and travel pages are a clean example of the split.


**Styling systems beat ad-hoc CSS.** The site demonstrates *why* you constrain yourself: a
fixed palette and exactly two fonts, expressed as **design tokens**, produce a coherent look
with far less effort than free-styling each page. You'll also see **responsive breakpoints**
in practice (MUI's `sx` object notation), and the real-world reality that a codebase can host
**more than one styling approach** (MUI for public UI, Tailwind for the editor) as long as
they're kept in their own lanes.


**Data without a database.** Not every site needs Postgres. Here, content is **typed static
JSON/TS modules**, which makes the data self-documenting and impossible to mis-shape (the
compiler checks it). The lesson is judgment: this works because there's one author and content
changes ship with deploys — and you'll learn to recognize when that *stops* being enough.


**Fetching external data safely.** The Substack integration is a compact masterclass:
parse an external format (RSS/XML), **sanitize untrusted HTML** before rendering it (never
trust a third party's markup), **cache** results with ISR so you're not re-fetching on every
request, and **fall back gracefully** when the network fails. Those four habits transfer to
almost any API integration.


**How images actually work on the web.** `next/image` introduces the concepts that matter for
performance: serving optimized formats and sizes, hosting assets on a **remote bucket/CDN** and
allow-listing that host, using `fill` + `sizes` for responsive images, and marking only
above-the-fold images as `priority` (this is the **LCP** — largest contentful paint — that web
performance scores care about).


**TypeScript as a guardrail, not bureaucracy.** Strict mode forces you to handle the cases you'd
otherwise forget (null/undefined). The travel layout types are a great teaching example of
**discriminated unions** — modeling "a block is either an image or text" so that invalid
combinations literally can't be written. Good types make a whole class of bugs unrepresentable.


**Coordinate systems and responsive math.** The fixed-canvas system teaches a transferable
idea: separate your **logical coordinate space** from how it's **displayed**. Author in stable
units, then scale the presentation. The same pattern recurs in games, canvas/SVG work, and any
zoomable UI.


**Security basics apply even to "just a personal site."** Env-gating admin tooling so it can't
ship to production, and validating file paths to prevent traversal, are habits worth forming
early — the admin routes here show both.


**Working effectively *with* an AI coding tool.** Perhaps the most portable lesson. This repo is
set up so the tool produces consistent work: conventions are written down where the tool reads
them (`.claude/CLAUDE.md`, `docs/design.md`), repeatable tasks are captured as **skills** rather
than re-explained each time, and there are **verification gates** (`npx tsc --noEmit`,
`npm run lint`, the `design-check` skill) that catch drift. The meta-skill is treating generated
code as a draft you review and own — reading it, understanding it, and holding it to the same
standards you would your own.


## Verification & workflow


The project has **no test framework**; quality is enforced by static checks and conventions:


```bash
npx tsc --noEmit   # type-check (strict)
npm run lint       # ESLint (next/core-web-vitals + next/typescript)
```


For UI changes, the `design-check` skill audits diffs against the Memory Archive system, and
visual review is done at desktop and mobile widths with attention to text overflow and scroll
behavior. Builds, installs, and dev servers are run by the author, not automatically.


---


*See `src/content/projects/memory-archive.md` for the author's personal, first-person account
of why the site was built. This brief is the complementary technical view.*



