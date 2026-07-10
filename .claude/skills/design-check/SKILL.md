---
name: design-check
description: Review code against the Memory Archive design system (colors, typography, metadata strip, layout/scroll rules, components, copy voice). Use before handing off UI changes, when the user asks to "design check", "check the design", "review against the design system", or to audit a page/component for drift toward legacy scrapbook styling. Defaults to the current git diff; accepts file/dir paths.
---

# design-check

Audit code against the **Memory Archive** design system for this site. This skill does **not** hunt for logic bugs. It checks one thing: does the UI follow the documented design system, or has it drifted?

## Sources of truth

Read these first, every run:

1. `src/components/design/tokens.ts` - actual token values in code.
2. `docs/design.md` - current visual and copy source of truth.
3. `AGENTS.md` - implementation rules for Codex, especially scroll, metadata, Substack, and verification.
4. `.claude/CLAUDE.md` - still useful Claude-side implementation notes; treat `docs/design.md` and `AGENTS.md` as newer if they disagree.

If `tokens.ts` and `docs/design.md` disagree on a design token, report a `DESIGN-SYSTEM CONFLICT` finding instead of choosing silently.

The accent is rose `rgb(163, 91, 115)`. Flag raw accent literals in public UI unless there is a deliberate local CSS variable wrapper. Flag reintroduced navy `oklch(0.38 0.08 250)`, retired rust `oklch(0.52 0.13 40)`, or old scrapbook pink styling.

## Scope

- **Default:** current working diff. Run `git status --porcelain` and `git diff --name-only HEAD`; review added/modified `.tsx`, `.ts` files that carry UI, `.css`, and relevant docs.
- **If the user passes a path:** review that file or directory instead.
- Skip `src/app/admin/**` unless asked; admin editors legitimately use Tailwind and dev-only styling.
- Data JSON under `src/data/travels/**` and `src/data/travel-details/**` is layout coordinate data. Only check it for color/copy literals when asked.

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

Severity: **SHOULD-FIX**, or **BLOCKER** for legacy palette colors in public UI.

Raw hex, `rgba()`, or `oklch()` literals that match a token should use the token from `@/components/design/tokens`.

| Literal | Token |
|---|---|
| `#f1e9df` | `tokens.paper` |
| `#e6dccb` | `tokens.paperDeep` |
| `#fbf6ee` | `tokens.paperCard` |
| `#1f1a16` | `tokens.ink` |
| `#5a4e43` | `tokens.ink60` |
| `#8a7e70` | `tokens.ink40` |
| `#c9bfae` | `tokens.ink20` |
| `rgba(31, 26, 22, 0.2)` | `tokens.hair` |
| `rgba(31, 26, 22, 0.55)` | `tokens.hairStrong` |
| rose accent literal | `tokens.accent` |

Do not flag once-off white/black overlays, photo shadows, texture gradients, or photo filter values unless they become a dominant palette.

### 2. Typography

Severity: **SHOULD-FIX**, or **BLOCKER** for non-approved fonts in public UI.

- `fontFamily` should reference `tokens.serif`, `tokens.mono`, or `tokens.hand`, not a raw font stack.
- Newsreader (serif) and JetBrains Mono (mono) are the only typefaces; public UI must not introduce any other font.
- Serif is for headings, page titles, place names, post titles, and editorial prose.
- Mono is for metadata, section labels, dates, catalog numbers, taxonomy, and controls. Mono should usually be small (`8-11px`), letter-spaced (`1.4-2px`), and uppercase.

### 3. Metadata strip

Severity: **SHOULD-FIX**, or **BLOCKER** when a public page reintroduces old `file:` strip text or hairline strip rules.

All listing and detail pages should use the shared `MetadataStrip`/`PageShell` style:

- Left field: section label in an accent-filled tab, with `tokens.paperCard` text.
- Right fields: REF label, short dotted leader, updated date.
- No top or bottom rules on the strip itself.
- Font size stays at normal metadata scale on mobile; do not shrink the strip text just to fit.
- Small screens (`<=768px`) show only the section tab. Hide the REF label, dotted leader, and updated date.

Section tab separators (BLOCKER on detail pages when wrong):

- Detail pages use the pattern `SECTION {letter} · {SERIES} / {ENTRY}`: a middot `·` separates the series prefix, and a forward slash `/` separates the specific entry name. Example: `SECTION B · TRAVELS / CHINA`, `SECTION A · PROJECTS / {slug}`.
- Do not use middots all the way through (e.g. `SECTION A · PROJECTS · {slug}` is wrong). The final separator before the entry name must be a slash, following the travel detail convention.

REF labels:

- Home: `REF. 00`
- Listing/index pages: `REF. {letter}-IDX`, with `A=Projects`, `B=Travels`, `C=Favorites`, `D=Blog`, `E=About`.
- Detail pages: `REF. {letter}-{nn}` from archive position, for example China is `REF. B-01`.
- Placeholder/secondary pages may use a clear REF variant, but never `file:`.

Dates:

- Strip dates come from `src/data/page-updated.ts` via `scripts/generate-page-updated.mjs`.
- Render tight dots: `UPDATED 04·22·26`, with no spaces around the dots.

Detail pages:

- Strip sits below nav as normal site chrome.
- Back link (`← Projects`, `← Travels`, `← Blog`) sits directly below the strip and above content.
- Use actual arrow glyphs (`←`, `→`, `↗`) in public UI. Never use ASCII substitutes such as `<-`, `->`, or `=>` for visible arrows.
- Travel detail scaled surfaces must start after the strip/back link; nav and metadata must not be inside the scaled surface.
- China detail's tab has no leading arrow.

Blog detail exception:

- `Also on Substack ↗` must not be in the strip.
- It belongs in the top utility row beside the `← Blog` back link, right-aligned.
- Style it as uppercase mono text in `tokens.accent`, underlined, with the external-link arrow glyph.

### 4. Layout and scroll

Severity: **BLOCKER**.

Root page wrappers:

- Use `minHeight: "100svh"`.
- Use `width: "100%"`, not `width: "100vw"`.
- Use `overflow: "clip"` when clipping is needed.
- Do not use `overflowX: "hidden"` on root boxes.
- Do not set `overscroll-behavior` or `touch-action` on `html` or `body`.
- The document should remain the only vertical scroll container.

Gutters are **SHOULD-FIX**: desktop side padding about `56px`; mobile about `20px`.

### 5. Component conventions

Severity: **SHOULD-FIX**.

- New section pages should use `PageShell` and shared design primitives instead of recreating nav, strip, hairlines, labels, or pills.
- Page titles should be large serif with one italicized word where appropriate.
- Photo mounts should use paper-card frames, subtle sepia/saturation treatment, captions, and catalog labels.
- Tag chips should be mono uppercase, transparent background, accent border, and accent text.
- Public UI should be responsive at `<=768px`; multi-column layouts collapse or otherwise adapt cleanly.

About page:

- Intro splits into a 48px serif headline and a smaller body paragraph; on small screens the headline is about 28px and the body about 19px.
- The contact card image fills the card width with equal padding, and the card column hugs the image instead of stretching wide.
- The contact card label is `REF. E-001 LIKENESS.PNG`, all uppercase mono black text.
- Contact links are minimal rows with logo/icon plus uppercase mono network name; do not show text handles or boxed tiles.
- Small-screen order is intro, contact card, then Currently.

### 6. Travel index

Severity: **SHOULD-FIX** for drift on `/travels`.

- Sort label reads `newest first` or `oldest first`, not `filed by date · newest first`.
- Sort label is clickable and toggles the trip order.
- Carousel arrows are `36x26`; disabled arrows must not retain accent hover styling.
- Travel cards should stretch to equal height with the footer pinned to the bottom so footer dividers align.
- Travel titles use `white-space: nowrap`.
- On very narrow phones (`<430px`), title size may reduce from `52px` to about `40px`.
- Column count should be dynamic `3 / 2 / 1` based on measured title/container width, not hardcoded viewport breakpoints.

### 7. Projects index and detail

Severity: **SHOULD-FIX** for drift on `/projects` or `/projects/[slug]`.

Projects index:

- Preserve the current spread-entry layout: generated thumbnail plus text block on desktop, text/info first and image second on small screens.
- Title is `Things I've made.` with no italicized word.
- Subtitle is only the entry count, for example `1 entry`; do not append `solo`, `collab`, or view-mode text.
- Each entry's mono line under the title is the tech stack, not role text such as `Solo` or `Co-founder`.
- Do not render a second tech-stack line in the footer row; the footer row keeps status, spacer, and `open file →`.
- Sort controls are `newest` / `oldest` above a full-width hairline divider.
- Entry numbers remain fixed chronologically: oldest project is `Entry 01` even when sorted newest-first.
- Use the normal hairline for the first-entry divider; do not use a strong rule above the first entry.

Project detail:

- Header order is back link, hero image, italic serif title, specs strip. Do not render a kicker/status row above the title.
- Do not render the project `tagline` between the title and specs strip; the prototype detail page intentionally omits it.
- Specs strip is minimal: no top/bottom rules, width `min(100%, max(50%, 620px))`, left-aligned.
- Specs labels stack above values at all widths. Values are JetBrains Mono.
- Field labels are `First published`, `Updated`, `Stack`, `Status`.
- Dates use tight dots with no spaces, for example `Feb·03·2026`.
- Desktop fields are separated by small circular dot separators, not borders or slash marks.
- Phone fields reflow into a 2x2 grid with separators hidden.
- Status value includes a colored circle: `live` renders green `#71a37e`; `shipping` renders the accent rose.
- Links are unboxed accent text with no divider line above them.
- Do **not** render previous/next project navigation at the foot of the page. The detail page ends with the "Where to find it" links row and the right-aligned `Back to top ↑` control; there is no prev/next pager. Flag any reintroduced `← Previous` / `Next →` project nav as **SHOULD-FIX**.

### 8. Copy and voice

Severity: **NOTE**, unless copy conflicts with metadata rules.

- Prefer archival words: "Cataloged", "Filed", "Entry".
- Mono labels should be taxonomic, for example `SERIES B · TRAVELS` or `REF. B-IDX`.
- Avoid `FILE:`/`file:` labels in public metadata.
- Use italics for places and titles, not generic emphasis.
- Keep the voice quiet and considered, not chatty.

## Process

1. Read the sources of truth.
2. Resolve scope and state it.
3. Search with `rg` for likely drift:
   - colors: `#[0-9a-fA-F]{3,6}|rgba?\(|oklch\(`
   - typography: `fontFamily`
   - metadata: `file:|FILE:|MetadataStrip|catNo|updatedLabel|metadataExtra|Also on Substack`
   - scroll: `100vw|overflowX|overscroll-behavior|touch-action`
   - travel index: `newest first|oldest first|whiteSpace|ResizeObserver|TravelsArrow`
   - visible ASCII arrows: `<-|->|&lt;-|-&gt;`
4. Read context around each hit. Never flag from grep alone.
5. Report findings grouped by severity.

## Fixing

Report-only by default. If the user passes `--fix` or asks you to apply fixes, make only safe mechanical fixes:

- swap token-equivalent literals for `tokens.*`
- replace raw font stacks with `tokens.*`
- replace `file:` metadata labels with the correct `REF.` value when the route mapping is obvious
- add missing token imports

Do not auto-resolve design-system conflicts, rewrite layout architecture, or rewrite copy without confirming.

After fixes, run the project verification gate:

```bash
npx tsc --noEmit
npm run lint
```

On Windows PowerShell, use `npx.cmd`/`npm.cmd` if script execution policy blocks `npx` or `npm`.
