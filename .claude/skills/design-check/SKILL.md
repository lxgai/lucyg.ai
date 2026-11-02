---
name: design-check
description: Review code against the site's digital-garden design system (CSS-variable tokens, the four font families, SiteShell layout and breakpoints, light/dark theming, shared components, scroll rules, copy voice). Use before handing off UI changes, when the user asks to "design check", "check the design", "review against the design system", or to audit a page/component for drift back toward the old Memory Archive styling. Defaults to the current git diff; accepts file/dir paths.
---

# design-check

Audit code against the site's **digital garden** design system. This skill doesn't hunt for logic bugs. It checks one thing: does the UI follow the documented design system, or has it drifted?

## Sources of truth

Read these first, every run:

1. `src/styles/globals.css` - actual token values (`:root` and `html[data-theme="dark"]`).
2. `docs/design.md` - current visual and copy source of truth.
3. `.claude/CLAUDE.md` - implementation rules: layout, scroll, conventions, verification.

If `globals.css` and `docs/design.md` disagree on a token, report a `DESIGN-SYSTEM CONFLICT` finding instead of choosing silently.

`docs/design-memory-archive.md` describes the retired system. Use it only to recognize drift, never as a rule.

## Scope

- **Default:** current working diff. Run `git status --porcelain` and `git diff --name-only HEAD`; review added/modified `.tsx`, `.ts` files that carry UI, `.css` / `.module.css`, and relevant docs.
- **If the user passes a path:** review that file or directory instead.
- Skip `src/app/admin/**` unless asked; the admin editor legitimately uses Tailwind and dev-only styling.

Announce the scope in one line before reporting.

## Report format

Group findings by severity: **BLOCKER**, **SHOULD-FIX**, **NOTE**.

For each finding include:

- clickable `file:line`
- rule
- current value
- concrete fix, including the exact token or replacement

If clean, say so plainly. End with `N blockers, M should-fix, K notes`.

## Checks

### 1. Color tokens

Severity: **SHOULD-FIX**; **BLOCKER** for legacy Memory Archive colors in public UI.

Components must use CSS variables, never raw color literals.

| Light literal | Dark literal | Token |
|---|---|---|
| `#f8fbf8` | `#181316` | `var(--light)` |
| | `#2b2327` | `var(--lightgray)` |
| `#b5b0b2` | `#6e6468` | `var(--gray)` |
| `#9b2c5c` | `#e38db2` | `var(--darkgray)` |
| `#6e1d42` | `#f4c9da` | `var(--dark)` |
| `#2f8f6b` | `#4fbf93` | `var(--underline)` |

- Muted text must be `color: var(--darkgray); opacity: .6`. Flag any separate gray for muted text.
- Tints of a token use `color-mix(in srgb, var(--underline) 12%, transparent)` style, not a literal.
- **BLOCKER:** legacy tokens or values in public UI: `var(--paper)`, `var(--ink…)`, a `tokens` object, `#f1e9df`, `#1f1a16`, the rose accent `rgb(163, 91, 115)`.
- Don't flag photo filters or one-off overlays inside images.

### 2. Theming

Severity: **BLOCKER**.

- Every new style must work in both themes. A color that only reads in light mode (a hard-coded white/black background, text on an image without a token) is a blocker.
- Theme switching is `data-theme` on `<html>`. Flag `@media (prefers-color-scheme)` rules in components; only the pre-paint script in `src/app/layout.tsx` reads the system preference.

### 3. Typography

Severity: **SHOULD-FIX**; **BLOCKER** for a non-approved family in public UI.

- `font-family` must reference `var(--font-heading)`, `var(--font-body)`, `var(--font-hand)` or `var(--font-code)`, never a raw stack.
- Only DM Serif Display, Bricolage Grotesque, Nothing You Could Do and JetBrains Mono. Newsreader and Caveat belong to the retired design; flag them.
- Roles: heading font for headings, titles and sidebar items; body font for prose and UI; hand font for dates, captions, greeting and sign-off; code font for labels, the clock, track numbers and inline code.
- Flag mono uppercase letter-spaced metadata labels; that's the old catalog style.

### 4. Layout

Severity: **BLOCKER** for structure, **SHOULD-FIX** for sizes.

- Every public page renders inside `SiteShell`. Flag pages that build their own nav/footer or still use `PageShell`.
- `toc` is passed on Home (site nav) and article pages only. Flag a TOC on list pages.
- Main column max 720px. Breakpoints: `1240px` (TOC column), `904px` (sidebar wraps), `560px` (multi-column rows inside main stack). Flag new arbitrary breakpoints for the same purpose.
- List rows (Travel Log, Blog) use the shared `list.module.css` grid and stay on one line at every width.
- `SiteShell` is server-only; a `"use client"` file importing it is a **BLOCKER**.

### 5. Scroll rules

Severity: **BLOCKER**.

- Root wrappers use `min-height: 100svh` and `width: 100%`, never `100vw`.
- Use `overflow: clip`, not `overflow-x: hidden`, on root boxes.
- Don't set `overscroll-behavior` or `touch-action` on `html` or `body`.
- The document stays the only vertical scroll container.

### 6. Components and patterns

Severity: **SHOULD-FIX**; **BLOCKER** for removed patterns.

- Reuse `linkClass`, `mutedClass`, `pageTitleClass`, `Tag`, `TagRow` and `Asterisks` from `@/components/site/ui`, and `Article` / `proseClass` from `@/components/site/Article`, before adding new rules.
- When two modules style the same element, the owning component should expose a variant. Flag fixes that depend on CSS load order.
- No cards, box shadows, border-radius on containers, divider lines or decorative icons. Section breaks use `Asterisks`. Only inline code and code blocks have a radius (5px).
- At most one playful element per page.
- **BLOCKER (removed patterns):** metadata strip / `MetadataStrip`, `SECTION X · …` tabs, `REF.` labels, catalog or entry numbers, `UPDATED` labels on redesigned pages, the About / Links / Portfolio pages, the subscribe form, MUI imports (`@mui/*`) in public UI.
- Images use `next/image`; unknown sizes use `width={0} height={0}` with `sizes` and CSS `width: 100%; height: auto`. `priority` only above the fold.
- Accordions are `<button aria-expanded>` with closed panels `inert`; decorative glyphs are `aria-hidden`.

### 7. Copy and voice

Severity: **NOTE**, unless a removed pattern comes back.

- Warm, first-person and lowercase-friendly in personal moments (greeting, sign-off); plain everywhere else.
- Flag archival/catalog vocabulary ("Cataloged", "Filed", "Entry 01", "open file →").
- Use real arrow glyphs (`→`, `←`, `↗`) in visible UI. Never `->`, `<-` or `=>`.

## Process

1. Read the sources of truth.
2. Resolve scope and state it.
3. Search with `rg` for likely drift:
   - colors: `#[0-9a-fA-F]{3,8}\b|rgba?\(|oklch\(|hsl\(`
   - legacy tokens: `--paper|--ink|tokens\.`
   - fonts: `font-family|fontFamily|Newsreader|Caveat`
   - theming: `prefers-color-scheme|data-theme`
   - removed patterns: `MetadataStrip|PageShell|catNo|REF\.|SECTION [A-Z]|UPDATED|@mui/`
   - decoration: `box-shadow|border-radius|border-(top|bottom)`
   - scroll: `100vw|overflow-x|overscroll-behavior|touch-action`
   - ASCII arrows: `<-|->|&lt;-|-&gt;`
4. Read context around each hit. Never flag from grep alone.
5. Report findings grouped by severity.

## Fixing

Report-only by default. If the user passes `--fix` or asks you to apply fixes, make only safe mechanical fixes:

- swap token-equivalent color literals for `var(--…)`
- replace raw font stacks with the matching `var(--font-…)`
- replace a separate muted gray with `color: var(--darkgray); opacity: .6`
- replace ASCII arrows with glyphs

Don't auto-resolve design-system conflicts, rewrite layout architecture, or rewrite copy without confirming.

After fixes, run the project verification gate:

```bash
npx tsc --noEmit
npm run lint
```
