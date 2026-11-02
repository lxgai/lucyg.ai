# Project Brief — lucyg.ai


## Summary


**lucyg.ai** is Lucy Gai's personal website, built as a quiet, text-first "digital garden" in
the spirit of the Markdown site-generator Quartz. It collects projects, travels, writing and favorites in a
three-column layout: a sidebar with recent travels and writing, a single reading column, and a
table of contents. The site is built on Next.js 15 (App Router) and React 19 with TypeScript in
strict mode. Content lives in typed static data and Markdown (no database), and a few external
sources feed in: a Substack blog feed, Spotify album data and Letterboxd reviews.

The site replaced an earlier design, "Memory Archive", styled after a library card catalog. That
system is documented in `docs/design-memory-archive.md` and still powers the trip detail pages
and their development-only visual editor until those are redesigned.


## Tech stack


| Area | Choice |
| --- | --- |
| Framework | Next.js `15.5` (App Router) |
| UI runtime | React `19.2` |
| Language | TypeScript `5`, `strict: true`, `@/*` → `src/*` path alias |
| Styling | CSS modules + CSS custom properties for public pages; Tailwind CSS `4` for the admin editor |
| Fonts | `next/font/google`: DM Serif Display, Bricolage Grotesque, Nothing You Could Do, JetBrains Mono |
| Content parsing | `fast-xml-parser` (Substack and Letterboxd RSS) + `sanitize-html` (untrusted feed HTML) |
| Markdown | `react-markdown` + `remark-gfm` for project write-ups |
| Images | `next/image`, with home, project and travel photos in a Supabase storage bucket |
| Data | Static TypeScript/JSON under `src/data/`, Markdown under `src/content/` — no database |
| Tooling | ESLint `9` (`next/core-web-vitals` + `next/typescript`), Node `.mjs` scripts |


A few stack notes worth calling out:


- **No database and no CMS.** Content lives in version control as typed data files. The
  trade-off — editing means committing code — is deliberate for a single-author site.
- **No UI library on public pages.** The redesign dropped MUI in favour of plain React, CSS
  modules and a handful of CSS variables. Icons are inline SVG paths, not an icon package.
- **External services are reached over the network, not via SDKs.** There's no Supabase,
  Spotify or Letterboxd client library in `package.json`. Images resolve to the bucket's public
  URL; the integrations run through server-side fetches and Node scripts.


## Architecture


**App Router with server-first rendering.** Pages live under `src/app/`, with dynamic routes
for `projects/[slug]` and `blog/[slug]` and one folder per trip under `travels/`. Pages are React
Server Components by default. Only the genuinely interactive pieces opt into `"use client"`: the
theme toggle, the collapsible table of contents, the live footer clock and the Favorites
accordions with their audio player.


**One shared shell.** Every public page renders inside `SiteShell`
(`src/components/site/SiteShell.tsx`), a server-only component that lays out the sidebar, main
column, optional table of contents and footer. Because it fetches the Substack feed for the
sidebar's "Selected Writing", it can't be imported by client components; client pages are split
into a server `page.tsx` that renders the shell around a client child.


**Responsive through CSS, not JavaScript.** The three columns are a wrapping flex row. At
`≥1240px` the table of contents gets its own column; below that it moves into the sidebar; below
`~904px` the sidebar wraps above the content. Both TOC placements are rendered and switched with
media queries, so there's no layout measurement or hydration flash.


**Theming before first paint.** Colors are eight CSS variables on `:root`, redefined under
`html[data-theme="dark"]`. A tiny inline script in `<head>` sets `data-theme` from the saved
choice or the system preference before the page paints, so dark-mode visitors never see a
light flash.


**Static data as a content model.** `src/data/` holds the source of truth: `travels.ts`
(`TRIPS`), `projects.ts` (`PROJECTS`), `favorites.ts` (albums, tracklists, audio clips, films),
`blog-tags.ts`, and one article per trip in `src/data/travel-articles/*.json`. Project write-ups
are Markdown in `src/content/projects/`; their headings become the page's table of contents.


**Image pipeline.** `src/lib/images.ts` maps logical paths such as `/images/projects/<slug>/…`
to the Supabase bucket under `NEXT_PUBLIC_SITE_IMAGE_BASE_URL`, and `next.config.ts` registers
that host for `next/image`. Favorites covers and audio clips stay in `public/`.


**Content pipeline with graceful fallback.** `src/lib/substack.ts` (a `server-only` module)
fetches the Substack RSS feed, parses it with `fast-xml-parser`, and sanitizes each post's HTML
with an explicit tag/attribute allowlist. `src/lib/articleHtml.ts` then adds heading ids for the
table of contents and turns `✧ ✦ ✧` lines into the site's asterisk divider. Results are cached
with ISR for an hour. If the feed is missing or fails, the blog falls back to local posts — it
never hard-fails on an external dependency. Favorites reads Letterboxd's RSS the same way to
pull in review text for each film.


## Features


- **Home** — a dithered banner, a handwritten greeting, a short introduction, a "Currently"
  list and a handwritten sign-off. Its table of contents doubles as site navigation.
- **Projects** — a list of thumbnail rows and long-form Markdown write-ups with a lede,
  captioned figures, tables and a generated table of contents.
- **Travels** — a Travel Log of dated rows with city tags, linking to single-column trip
  articles with scrapbook-style canvases (see below).
- **Blog** — a dated list with tags and full posts rendered from Substack, with reading time and
  a generated table of contents.
- **Favorites** — accordions of albums (cover, a featured-track audio clip, a tracklist with
  favorites starred, synced from Spotify) and films (poster and Letterboxd review).
- **Everywhere** — light and dark themes, a sidebar of recent travels and writing, and a footer
  with a live clock and social links.


## What makes it technically interesting


### A small, strict design system


The look is enforced by a handful of rules rather than per-page styling (documented in
`docs/design.md`):

- **Eight color tokens**, each with a light and a dark value: a mint background, magenta body
  text, a deeper magenta for headings and jade for underlines, tags and accents. Muted text is
  the body color at 60% opacity rather than a separate gray.
- **Four typefaces with fixed roles**: DM Serif Display for headings, Bricolage Grotesque for
  body and UI, Nothing You Could Do for handwritten dates and captions, JetBrains Mono for
  labels and the clock.
- **Restraint as a rule**: no cards, shadows, divider lines or decorative icons, and at most one
  playful element per page.

Shared pieces (`Tag`, `TagRow`, `Asterisks`, `Article`, link and title classes) live in
`src/components/site/`, so pages compose them instead of restyling.


### Trip articles with scrapbook canvases


Each trip is one JSON article: a title, dates, city tags and a flat list of typed blocks — a
full-width image, a text block, a section heading (h2 or h3, with an optional native-language
title and subtitle) or a **canvas**. The table of contents is built from the section blocks.

A canvas keeps the scrapbook feel inside a single column. It is exactly the column's width,
and every photo, sticker and text box on it is positioned in a fixed **720px design space**
(x, y, width, rotation, z-index). The public page converts those numbers to percentages and
sizes text in container-query units, so the whole canvas, text included, scales with the
column; content outside it is clipped. The admin editor renders the same components at the
column's real 720px width, so drag, resize and rotate math works 1:1 in design coordinates —
*edit in design space, display in scaled space*.


### A development-only editor, contained safely


The travel editor lives under `/admin/` and is never exposed in production: the pages call
`notFound()` when `NODE_ENV === "production"`, and every `/api/admin/*` route returns 404 before
doing any file work. The save/load routes validate the trip slug against a strict regex and
resolve paths defensively so writes can only replace existing files in `src/data/travel-articles/`.


### Custom Claude Code skills as project tooling


The repository ships its own automation as Claude Code skills under `.claude/skills/`:

- **`add-trip`** — scaffolds a new travel entry end-to-end while keeping the slug identical
  across every file.
- **`design-check`** — audits changes against the design system (tokens, fonts, theming,
  layout, scroll rules, removed patterns, copy voice).
- **`manage-albums`** — adds, removes and reorders favorite albums, keeping titles consistent
  across data files and re-syncing tracklists.


## What you could learn building this (new to web dev / frontend)


This project is a compact tour of modern frontend concepts. For someone newer to web development
— especially building alongside a tool like Claude Code — here's what's learnable from it, and
where each idea shows up.


**The React + Next.js mental model.** The site is composition: small components taking `props`
and returning UI. The App Router teaches **file-based routing** (a folder under `src/app/`
becomes a URL) and **dynamic routes** (`[slug]`). The most important modern distinction is
**Server Components vs. Client Components**: most of the site renders on the server, and only
the theme toggle, clock, table of contents and accordions ship JavaScript to the browser.


**CSS can do more than you think.** The redesign removed a component library and lost nothing.
**CSS variables** make theming a matter of swapping eight values; **CSS modules** scope styles
to a component without naming collisions; **media queries** move the table of contents between
columns with no JavaScript; and `grid-template-rows: 0fr → 1fr` animates an accordion to its
natural height. Constraining yourself to a few tokens and fonts produces a more coherent site
with less code.


**Data without a database.** Not every site needs Postgres. Here, content is **typed static
data and Markdown**, which makes it self-documenting and hard to mis-shape (the compiler checks
it). The lesson is judgment: this works because there's one author and content ships with
deploys.


**Fetching external data safely.** The Substack integration is a small masterclass: parse an
external format (RSS/XML), **sanitize untrusted HTML** before rendering it, **cache** results
with ISR so you're not re-fetching on every request, and **fall back gracefully** when the
network fails. Those habits transfer to almost any API integration.


**How images work on the web.** `next/image` introduces the concepts that matter for
performance: serving optimized sizes, hosting assets on a **remote bucket/CDN** and
allow-listing that host, using `sizes` for responsive images, and marking only above-the-fold
images as `priority` (the **LCP** — largest contentful paint — that performance scores care
about).


**TypeScript as a guardrail.** Strict mode forces you to handle the cases you'd otherwise
forget. The travel layout types are a good example of **discriminated unions** — "a block is
either an image or text" — so invalid combinations can't be written.


**Coordinate systems and responsive math.** The travel canvases teach a transferable
idea: separate your **logical coordinate space** from how it's **displayed**. The same pattern
recurs in games, canvas/SVG work and any zoomable UI.


**Security basics apply even to "just a personal site."** Env-gating admin tooling and
validating file paths to prevent traversal are habits worth forming early.


**Working effectively *with* an AI coding tool.** Perhaps the most portable lesson. The repo is
set up so the tool produces consistent work: conventions are written down where the tool reads
them (`.claude/CLAUDE.md`, `AGENTS.md`, `docs/design.md`), repeatable tasks are captured as
**skills**, and **verification gates** (`npx tsc --noEmit`, `npm run lint`, the `design-check`
skill) catch drift. A whole-site redesign became tractable because the target design was
written down first and every page could be checked against it.


## Verification & workflow


The project has **no test framework**; quality is enforced by static checks and conventions:

```bash
npx tsc --noEmit   # type-check (strict)
npm run lint       # ESLint (next/core-web-vitals + next/typescript)
```

For UI changes, the `design-check` skill audits diffs against the design system, and visual
review covers desktop (≥1240px), tablet (~900px) and mobile (~375px) widths in both light and
dark mode. Builds, installs and dev servers are run by the author, not automatically.


---


*See `src/content/projects/memory-archive.md` for the author's personal, first-person account
of why the site was originally built. This brief is the complementary technical view.*
