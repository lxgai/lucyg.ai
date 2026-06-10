---
name: derive-travel-layouts
description: Generate the medium and small breakpoint layouts of a travel-detail page from the large layout you authored by hand. Medium is a faithful proportional shrink of large; small is an auto single-column stack. Writes back into src/data/travel-details/<slug>.json for review in the admin editor. Use when the user says e.g. "derive the medium/small layouts for <slug>", "I finished the large layout, generate the responsive ones", "reflow <trip> for mobile".
---

# derive-travel-layouts

Turn the **large** layout of a travel-detail page — the one Lucy positions by hand in `/admin/travel-detail-editor` — into draft **medium** and **small** layouts, so she builds one breakpoint instead of three. The output is a starting point to refine in the editor, not a final layout.

## Why this works (the coordinate contract)

From `src/components/travel/TravelDetailPage.tsx` and `detailGeometry.ts`:

- `block.layout[bp].x` and `.width` are **percentages of the canvas width** (`left: ${x}%`, `width: ${width}%`).
- `block.layout[bp].y` is **absolute pixels** (`top: y`).
- Canvas **widths are fixed** per breakpoint (the horizontal coordinate contract — never change them); only **heights** are free.
- Image blocks carry `aspect` (e.g. `"4032 / 2683"`), so rendered height is computable: `(width% × canvasWidth) / (w/h)`.

Because x/width are already canvas-relative percentages:

- **Medium** = a proportional shrink of large: copy `x`/`width`, scale `y` by `mediumWidth/largeWidth`, scale the canvas height to match. The design is preserved, just narrower. **Rotation, zIndex, and visible are kept identical to large** — medium is the same composition at a different width, so tilt and stacking order must not drift; only `x`/`y`/`width` change.
- **Small** = a single-column stack: every block becomes full content width (`x:6, width:88`), rotation flattened, ordered by large **reading order** (top-to-bottom, then left-to-right), with each block's height computed from its image aspect (or estimated from text) and stacked with a consistent gutter. The canvas height grows to fit.

## Hard rules

- **Never change canvas widths** (`largeWidth`/`mediumWidth`/`smallWidth`). They are the horizontal coordinate contract. The script only writes `mediumHeight`/`smallHeight`.
- **This overwrites existing `medium` and `small`** for every block. That's the point — but it means any hand-tuning of those breakpoints is replaced. Confirm with the user if they've already refined medium/small by hand. Git is the safety net.
- **Author large first.** The script derives entirely from each block's `layout.large`; garbage-in/garbage-out. If large is empty or placeholder, say so and stop.
- The output is a **draft**. Always end by pointing the user to `/admin/travel-detail-editor` to review both breakpoints — small especially, since full-width stacking makes tall columns that often want individual images shrunk.

## Steps

### 1. Resolve the slug
Confirm `src/data/travel-details/<slug>.json` exists (e.g. `china-24`, `japan-24`). If the user names a trip rather than a slug, map it via `src/data/travels.ts`.

### 2. (Optional) Preview
Show what will happen without writing:
```
npm run derive:travel-layouts -- <slug> --dry-run
```
This prints the per-section and hero canvas sizes it would produce. Use it if the user wants to sanity-check before overwriting.

### 3. Derive and write
```
npm run derive:travel-layouts -- <slug>
```
Flags:
- `--medium-only` — generate only medium, leave small untouched (use when small was hand-built).
- `--dry-run` — print, don't write.

### 4. Report and hand off
- Summarize what changed: which sections + hero got new medium/small, and the resulting `smallHeight` per section (tall columns are expected and fine).
- Tell the user to open `/admin/travel-detail-editor`, select the trip, and review **medium** then **small**. Call out likely touch-ups:
  - Small images that are too dominant at full width — shrink `width` and re-center.
  - Decorations (tape) — the stack doesn't position these; they keep a proportional placement and usually need a nudge or hiding on small.
  - Text blocks whose estimated height left too much/little gap.
- Do **not** run `npm run build`/`dev` (per CLAUDE.md, Lucy runs those). The script only edits JSON, so no `tsc`/`lint` gate is needed unless the user also changed code.

## Tuning

Layout heuristics (gutter, gap, stack widths, text-height estimate, hero copy reserve) live in the `SMALL` constants at the top of `scripts/derive-travel-layouts.mjs`. Adjust there if the stacks come out consistently too tight or too loose, rather than hand-editing JSON.

## What it does NOT do

- It won't decide that two images should sit **side-by-side** on small — everything stacks one per row. If the user wants a specific pair kept together, do that by hand in the editor afterward (or as a follow-up enhancement to the script).
- It won't lay out text precisely — text heights on small are estimated from character count, so gaps around paragraphs are approximate by design.
