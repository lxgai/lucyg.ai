---
name: design-check
description: Review code against the Memory Archive design system (colors, typography, layout/scroll rules, components, copy voice). Use before handing off UI changes, when the user asks to "design check", "check the design", "review against the design system", or to audit a page/component for drift toward legacy scrapbook/VT323/Cooper/pink styling. Defaults to the current git diff; accepts file/dir paths.
---

# design-check

Audit code against the **Memory Archive** design system for this site. This skill does **not** hunt for logic bugs (use `/code-review` for that). It checks one thing: does the UI follow the documented design system, or has it drifted?

## Sources of truth (read these first, every run)

The rules below are a summary. The live sources win if they disagree — read them at the start of each run so the skill never goes stale:

1. `src/components/design/tokens.ts` — the actual token values in code.
2. `docs/design.md` — the design system spec and section-by-section treatments.
3. `.claude/CLAUDE.md` — the "Design Direction", "Page Layout And Scroll Rules", and copy rules.

If `tokens.ts` and `docs/design.md` disagree on a value, **do not pick one silently** — report it as a `DESIGN-SYSTEM CONFLICT` finding so Lucy can resolve it.

The accent is **rose** `rgb(163, 91, 115)` — aligned across `tokens.ts`, `docs/design.md`, and `CLAUDE.md`. Flag any raw accent literal that isn't `tokens.accent` (or `var(--accent)` in CSS), and flag any reintroduced navy `oklch(0.38 0.08 250)` or retired rust `oklch(0.52 0.13 40)`.

## Scope

- **Default:** the current working diff. Run `git status --porcelain` and `git diff --name-only HEAD` to get changed files; review added/modified `.tsx`, `.ts` (style-bearing), and `.css` files. Skip `src/app/admin/**` unless asked — those editors legitimately use Tailwind and dev-only styling.
- **If the user passes a path** (file or directory), review that instead of the diff.
- **Data JSON** (`src/data/travels/**`, `src/data/travel-details/**`) is layout coordinate data, not styled UI — only check it for color/copy literals if asked.

Announce the scope you settled on in one line before reporting.

## What to check

Group every finding by severity: **BLOCKER** → **SHOULD-FIX** → **NOTE**. For each, give `file:line` (clickable markdown link), the rule, the current value, and the concrete fix (the exact token or replacement).

### 1. Color → must use tokens (SHOULD-FIX; BLOCKER if it's a legacy palette color)

Raw hex / `rgba()` / `oklch()` literals that match a token must use the token instead. Import from `@/components/design/tokens`.

| Literal | Token |
|---|---|
| `#f1e9df` | `tokens.paper` |
| `#e6dccb` | `tokens.paperDeep` |
| `#fbf6ee` | `tokens.paperCard` |
| `#1f1a16` | `tokens.ink` |
| `#5a4e43` | `tokens.ink60` |
| `#8a7e70` | `tokens.ink40` |
| `#c9bfae` | `tokens.ink20` |
| `rgba(31, 26, 22, 0.2)` (any spacing) | `tokens.hair` |
| `rgba(31, 26, 22, 0.55)` | `tokens.hairStrong` |
| accent literal / navy `oklch(0.38 0.08 250)` / rust `oklch(0.52 0.13 40)` | `tokens.accent` (rose) |

**Legitimate one-offs — do NOT flag** (note at most once): white/black overlays and shadows over photos/gradients (`rgba(255,255,255,…)`, `rgba(0,0,0,…)`), texture gradients, and the photo-mount filter values. These aren't part of the paper/ink palette.

**Legacy palette = BLOCKER:** any pink accent or other retired scrapbook color in new public UI.

### 2. Typography (SHOULD-FIX; legacy fonts = BLOCKER)

- `fontFamily` must reference `tokens.serif` / `tokens.mono` / `tokens.hand` — never a raw font stack string.
- **Legacy fonts are a BLOCKER in public UI:** `VT323`, `Cooper`, `ChunkFive`. These are retired (`docs/design.md` line 49). Allowed only if the task explicitly says to preserve legacy styling.
- **Serif vs mono role check** (SHOULD-FIX where confident):
  - **Serif (`tokens.serif`)** → headings, page titles, place names, post titles, human/editorial prose. Italic for places/titles and the one-italicized-word title move.
  - **Mono (`tokens.mono`)** → section labels, metadata, dates, catalog numbers, taxonomy. Should be small (`8–11px`), letter-spaced (`1.4–2`), often uppercase. Flag mono used at large display sizes, or a metadata label rendered in serif.

### 3. Layout & scroll rules (BLOCKER — these are hard rules in CLAUDE.md)

On root page wrappers:
- Must use `minHeight: "100svh"`, `width: "100%"`, and `overflow: "clip"` when clipping is needed.
- **`width: "100vw"` anywhere → BLOCKER.**
- **`overflowX: "hidden"` on a root box → BLOCKER.**
- **`overscroll-behavior` or `touch-action` set on `html`/`body` → BLOCKER.**
- The document must remain the only vertical scroll container — flag nested scroll containers created on page roots.

Gutters (SHOULD-FIX): desktop side padding ≈ `56px`, mobile ≈ `20px`. Flag obviously off values on section page containers.

### 4. Component conventions (SHOULD-FIX)

- **Section pages** should open with the shared metadata strip — section name in a filled accent "tab" (accent background, paper-card text), file id and last updated as plain mono, no top/bottom rules. Check new section pages use the shared `MetadataStrip` / `PageShell` rather than rolling their own.
- **Page titles**: large serif, one italicized word.
- **Photo mounts**: paper-card frame + filter `sepia(0.1–0.15) saturate(0.9)` + caption + catalog label.
- **Tag chips**: mono uppercase, accent border, accent text on transparent.
- Prefer existing primitives in `src/components/design/` (`Nav`, `PageShell`, `primitives`, `layout`) over re-implementing hairlines/labels/pills.

### 5. Mobile (SHOULD-FIX)

Multi-column grids must collapse to a single column at `≤768px`. Flag responsive `sx` that keeps multiple columns at `xs`. Confirm display titles scale down on mobile.

### 6. Copy & voice (NOTE)

Only when the diff touches user-facing copy:
- Prefer archival words: "Cataloged" not "shown", "Filed" not "sorted", "Entry" not "post".
- Mono labels lean taxonomic (`SERIES C · TRAVELS`, `FILE: HOME.IDX`).
- Italics for places and titles, never for generic emphasis.
- Quiet and considered, not chatty.

## Process

1. Read the three sources of truth.
2. Resolve scope (diff vs. passed path); state it.
3. Scan with `Grep` for the literal patterns (`#[0-9a-fA-F]{3,6}`, `rgba?\(`, `oklch\(`, `fontFamily`, `VT323|Cooper|ChunkFive`, `100vw`, `overflowX`, `overscroll-behavior`, `touch-action`), then `Read` around each hit to judge intent — never flag from a grep line alone.
4. Report findings grouped by severity, each with `file:line`, rule, and fix. If clean, say so plainly.
5. End with a one-line summary: `N blockers, M should-fix, K notes`.

## Fixing

Report-only by default. If the user passes `--fix` (or asks you to apply), make the **safe, mechanical** fixes only — swap color literals for tokens, replace raw font stacks with `tokens.*`, add the `tokens` import if missing. Do **not** auto-resolve the accent CONFLICT, change layout/scroll architecture, or rewrite copy without confirming. After fixing, run the verification gate from CLAUDE.md: `npx tsc --noEmit` then `npm run lint`.
