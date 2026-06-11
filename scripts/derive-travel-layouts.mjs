#!/usr/bin/env node
/**
 * derive-travel-layouts.mjs
 *
 * Generate the `medium` and `small` layouts of a travel-detail page from the
 * `large` layout you authored by hand. Writes the result back into
 * `src/data/travel-details/<slug>.json`. Review/refine afterward in
 * `/admin/travel-detail-editor`.
 *
 * The coordinate contract (see src/components/travel/TravelDetailPage.tsx and
 * src/components/travel/detailGeometry.ts):
 *   - block.layout[bp].x      = percent of canvas width   (left: `${x}%`)
 *   - block.layout[bp].width  = percent of canvas width   (width: `${width}%`)
 *   - block.layout[bp].y      = absolute pixels           (top: y)
 *   - canvas widths are FIXED per breakpoint (the horizontal coordinate
 *     contract); only heights are free to change.
 *
 * Because x/width are already canvas-relative percentages:
 *   - MEDIUM is a faithful proportional shrink of LARGE: copy x/width/rotation,
 *     scale y by mediumWidth/largeWidth, scale the canvas height to match.
 *   - SMALL is a single-column stack: every block becomes full content width,
 *     rotation flattened, ordered by large reading order (top-to-bottom, then
 *     left-to-right), with each block's height computed from its image aspect
 *     (or estimated from text), stacked with a consistent gutter.
 *
 * Usage:
 *   node scripts/derive-travel-layouts.mjs <slug> [--medium-only] [--dry-run]
 *   npm run derive:travel-layouts -- <slug>
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, "..");

// ---------------------------------------------------------------------------
// Tunable constants. These shape the auto-draft; refine output in the editor.
// ---------------------------------------------------------------------------
const SMALL = {
  contentX: 6, // left gutter, percent of canvas width
  contentWidth: 88, // body width, percent of canvas width
  topMargin: 24, // px before the first stacked block
  bottomMargin: 32, // px of canvas below the last block
  gap: 28, // px between stacked blocks
  flattenRotation: true, // zero out rotation for a clean column
  textLineHeightRatio: 1.5, // px line height = fontSize * this (matches public BlockView)
  textCharWidthRatio: 0.52, // avg glyph advance = fontSize * this (for wrap estimate)
  textPadding: 12, // px padding added to each estimated text block
  imageChromePx: 46, // px the framed PhotoFrame adds below the image (padding + border + caption row)
  imageCutoutChromePx: 24, // px a cutout image adds below the image (caption only)
  heroCopyHeight: 300, // px reserved for hero title + intro + metadata
};

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const slug = args.find((a) => !a.startsWith("--"));
const MEDIUM_ONLY = flags.has("--medium-only");
const DRY_RUN = flags.has("--dry-run");

if (!slug) {
  console.error("Usage: node scripts/derive-travel-layouts.mjs <slug> [--medium-only] [--dry-run]");
  process.exit(1);
}

const filePath = join(PROJECT_ROOT, "src", "data", "travel-details", `${slug}.json`);
if (!existsSync(filePath)) {
  console.error(`No travel-detail file at ${filePath}`);
  process.exit(1);
}

const data = JSON.parse(readFileSync(filePath, "utf8"));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Parse an aspect string like "4032 / 2683" into width/height ratio (w/h). */
function aspectRatio(aspect) {
  if (!aspect || typeof aspect !== "string") return 1;
  const [w, h] = aspect.split("/").map((n) => parseFloat(n.trim()));
  if (!w || !h) return 1;
  return w / h;
}

/** Rendered pixel height of an image given its width% on a canvas of canvasWidth. */
function imageHeightPx(widthPercent, canvasWidth, aspect) {
  const renderedWidthPx = (widthPercent / 100) * canvasWidth;
  return renderedWidthPx / aspectRatio(aspect);
}

/** Rough rendered pixel height of a text block at a given font size and width. */
function textHeightPx(text, fontSize, widthPercent, canvasWidth) {
  const renderedWidthPx = (widthPercent / 100) * canvasWidth;
  const charsPerLine = Math.max(1, Math.floor(renderedWidthPx / (fontSize * SMALL.textCharWidthRatio)));
  const lines = Math.max(1, Math.ceil((text?.length ?? 0) / charsPerLine));
  return lines * fontSize * SMALL.textLineHeightRatio + SMALL.textPadding;
}

function round(n) {
  return Math.round(n * 1000) / 1000;
}

/** Build a freeform layout object, preserving zIndex/visible from a source. */
function layout(x, y, width, rotation, source) {
  return {
    x: round(x),
    y: round(y),
    width: round(width),
    rotation: round(rotation),
    zIndex: source?.zIndex ?? 1,
    visible: source?.visible ?? true,
  };
}

// ---------------------------------------------------------------------------
// MEDIUM: proportional shrink of LARGE.
// x/width copied (already %); y scaled by the width ratio so vertical rhythm
// tracks the horizontal shrink. Canvas height scaled to match.
//
// GUARANTEE: medium keeps the EXACT rotation, zIndex, and visible of large —
// it is the same composition at a different width, so tilt and stacking order
// must not drift. Only x/y/width differ.
// ---------------------------------------------------------------------------
function deriveMediumLayout(large, ratio) {
  return {
    x: round(large.x),
    y: round(large.y * ratio),
    width: round(large.width),
    rotation: large.rotation, // identical to large
    zIndex: large.zIndex, // identical to large
    visible: large.visible, // identical to large
  };
}

// ---------------------------------------------------------------------------
// SMALL: single-column stack in large reading order.
// ---------------------------------------------------------------------------
function readingOrder(blocks) {
  // Sort by large y, then large x. Stable for ties.
  return blocks
    .map((b, i) => ({ b, i }))
    .sort((p, q) => {
      const ay = p.b.layout.large.y;
      const by = q.b.layout.large.y;
      if (Math.abs(ay - by) > 1) return ay - by;
      const ax = p.b.layout.large.x;
      const bx = q.b.layout.large.x;
      if (Math.abs(ax - bx) > 0.5) return ax - bx;
      return p.i - q.i;
    })
    .map((p) => p.b);
}

function smallBlockHeight(block, canvasWidth) {
  if (block.type === "image") {
    const chrome = block.cutout ? SMALL.imageCutoutChromePx : SMALL.imageChromePx;
    return imageHeightPx(SMALL.contentWidth, canvasWidth, block.aspect) + chrome;
  }
  if (block.type === "text") {
    const fs = block.fontSize?.small ?? 17;
    return textHeightPx(block.text, fs, SMALL.contentWidth, canvasWidth);
  }
  return 80; // fallback
}

/**
 * Stack the given content blocks into a single column. Decorations are NOT
 * stacked — they keep their existing small layout (hand-tuned accents) or fall
 * back to a proportional placement, and never drive canvas height.
 * Returns the final stack bottom (px) for sizing the canvas.
 */
function stackSmall(blocks, canvasWidth, startY) {
  const ordered = readingOrder(blocks);
  let y = startY;
  for (const block of ordered) {
    const src = block.layout.large;
    const h = smallBlockHeight(block, canvasWidth);
    block.layout.small = layout(
      SMALL.contentX,
      y,
      SMALL.contentWidth,
      SMALL.flattenRotation ? 0 : src.rotation,
      src,
    );
    y += h + SMALL.gap;
  }
  return y - SMALL.gap; // last block bottom
}

/** Decorations: keep proportional x/width, scale y like medium, clamp rotation. */
function deriveDecorationSmall(decoration, ratio) {
  const large = decoration.layout.large;
  decoration.layout.small = layout(large.x, large.y * ratio, large.width, large.rotation, large);
}

// ---------------------------------------------------------------------------
// Process sections
// ---------------------------------------------------------------------------
const report = [];

for (const section of data.sections) {
  const { largeWidth, mediumWidth, smallWidth } = section.canvas;
  const mediumRatio = mediumWidth / largeWidth;
  const smallRatio = smallWidth / largeWidth;

  // Medium: proportional shrink.
  for (const block of section.blocks) {
    block.layout.medium = deriveMediumLayout(block.layout.large, mediumRatio);
  }
  for (const deco of section.decorations ?? []) {
    deco.layout.medium = deriveMediumLayout(deco.layout.large, mediumRatio);
  }
  section.canvas.mediumHeight = Math.round(section.canvas.largeHeight * mediumRatio);

  if (!MEDIUM_ONLY) {
    // Small: stacked column.
    const stackBottom = stackSmall(section.blocks, smallWidth, SMALL.topMargin);
    for (const deco of section.decorations ?? []) {
      deriveDecorationSmall(deco, smallRatio);
    }
    section.canvas.smallHeight = Math.round(stackBottom + SMALL.bottomMargin);
  }

  report.push(
    `  section ${section.no} "${section.name}": ${section.blocks.length} blocks → ` +
      `medium ${mediumWidth}×${section.canvas.mediumHeight}` +
      (MEDIUM_ONLY ? "" : `, small ${smallWidth}×${section.canvas.smallHeight}`),
  );
}

// ---------------------------------------------------------------------------
// Process hero
// ---------------------------------------------------------------------------
if (data.hero) {
  const hero = data.hero;
  // Hero uses viewport widths, not a section canvas. Pull from detailGeometry.
  const VIEWPORT = { large: 1440, medium: 1120, small: 470 };
  const mediumRatio = VIEWPORT.medium / VIEWPORT.large;
  const smallRatio = VIEWPORT.small / VIEWPORT.large;

  // Medium: proportional shrink of hero image + copy + decorations + canvas.
  hero.image.layout.medium = deriveMediumLayout(hero.image.layout.large, mediumRatio);
  hero.copyLayout.medium = deriveMediumLayout(hero.copyLayout.large, mediumRatio);
  for (const deco of hero.decorations ?? []) {
    deco.layout.medium = deriveMediumLayout(deco.layout.large, mediumRatio);
  }
  if (hero.canvasHeight) hero.canvasHeight.medium = Math.round(hero.canvasHeight.large * mediumRatio);

  if (!MEDIUM_ONLY) {
    // Small: image full-width on top, copy block beneath it.
    const imgH = imageHeightPx(SMALL.contentWidth, VIEWPORT.small, hero.image.aspect);
    hero.image.layout.small = layout(
      SMALL.contentX,
      SMALL.topMargin,
      SMALL.contentWidth,
      SMALL.flattenRotation ? 0 : hero.image.layout.large.rotation,
      hero.image.layout.large,
    );
    const copyY = SMALL.topMargin + imgH + SMALL.gap;
    hero.copyLayout.small = layout(
      SMALL.contentX,
      copyY,
      SMALL.contentWidth,
      0,
      hero.copyLayout.large,
    );
    for (const deco of hero.decorations ?? []) {
      deriveDecorationSmall(deco, smallRatio);
    }
    if (hero.canvasHeight) {
      hero.canvasHeight.small = Math.round(copyY + SMALL.heroCopyHeight + SMALL.bottomMargin);
    }
  }
  report.unshift(
    `  hero: medium ${VIEWPORT.medium}×${hero.canvasHeight?.medium ?? "?"}` +
      (MEDIUM_ONLY ? "" : `, small ${VIEWPORT.small}×${hero.canvasHeight?.small ?? "?"}`),
  );
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------
const output = JSON.stringify(data, null, 2) + "\n";

console.log(`\nDerived layouts for ${slug}${MEDIUM_ONLY ? " (medium only)" : ""}:`);
console.log(report.join("\n"));

if (DRY_RUN) {
  console.log("\n--dry-run: not writing. Re-run without --dry-run to apply.");
} else {
  writeFileSync(filePath, output, "utf8");
  console.log(`\nWrote ${filePath}`);
  console.log("Review and refine in /admin/travel-detail-editor (medium + small breakpoints).");
}
