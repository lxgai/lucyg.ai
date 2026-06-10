import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { listTripImages } from "./lib/travel-bucket.mjs";

// Re-syncs a trip with the Supabase storage bucket: detects images added to or
// deleted from travels/<slug>/, then updates TRAVEL_ASSETS and the trip's
// travel-detail layout to match.
//
// - TRAVEL_ASSETS[slug] is rewritten to the full sorted bucket listing.
// - Deleted images: their blocks are removed from the layout (and the hero is
//   reassigned if its image was deleted).
// - Newly-added images (in the bucket but not previously in TRAVEL_ASSETS) are
//   appended to the last section as placeholder blocks to position in the editor.
//
// Usage: node scripts/refresh-travel-bucket.mjs <slug> [--dry-run] [--allow-empty]

const root = process.cwd();
const ASSETS_PATH = path.join(root, "src/data/travel-assets.ts");
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function detailPath(slug) {
  return path.join(root, "src/data/travel-details", `${slug}.json`);
}

// --- TRAVEL_ASSETS (TypeScript source) read/rewrite -------------------------

function assetArrayRegex(slug) {
  return new RegExp(`("${slug}"\\s*:\\s*\\[)[\\s\\S]*?(\\n[ \\t]*\\])`);
}

function readAssetPaths(source, slug) {
  const m = source.match(assetArrayRegex(slug));
  if (!m) return null;
  return [...m[0].matchAll(/"([^"]+)"/g)].map((x) => x[1]).filter((p) => p !== slug);
}

function rewriteAssetPaths(source, slug, paths) {
  const items = paths.map((p) => `    "${p}",`).join("\n");
  return source.replace(assetArrayRegex(slug), (_full, open) => `${open}\n${items}\n  ]`);
}

// --- Travel-detail layout edits ---------------------------------------------

function collectIds(data) {
  const ids = new Set();
  if (data.hero?.image?.id) ids.add(data.hero.image.id);
  for (const dec of data.hero?.decorations ?? []) ids.add(dec.id);
  for (const section of data.sections ?? []) {
    for (const block of section.blocks ?? []) ids.add(block.id);
    for (const dec of section.decorations ?? []) ids.add(dec.id);
  }
  return ids;
}

function uniqueId(srcPath, used) {
  const file = srcPath.split("/").pop() ?? "image";
  const stem =
    file
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "image";
  let id = `auto-${stem}`;
  let n = 2;
  while (used.has(id)) id = `auto-${stem}-${n++}`;
  used.add(id);
  return id;
}

function makeImageBlock(srcPath, id, index) {
  const z = 30 + index;
  return {
    id,
    type: "image",
    src: srcPath,
    alt: "",
    caption: "",
    aspect: "1 / 1",
    cutout: true,
    layout: {
      large: { x: 4, y: 40 + index * 360, width: 26, rotation: 0, zIndex: z, visible: true },
      medium: { x: 4, y: 40 + index * 360, width: 32, rotation: 0, zIndex: z, visible: true },
      small: { x: 6, y: 40 + index * 520, width: 60, rotation: 0, zIndex: z, visible: true },
    },
  };
}

function removeDeletedBlocks(data, deletedSet) {
  let removed = 0;
  for (const section of data.sections ?? []) {
    const before = section.blocks.length;
    section.blocks = section.blocks.filter(
      (b) => !(b.type === "image" && deletedSet.has(b.src)),
    );
    removed += before - section.blocks.length;
  }
  return removed;
}

function reassignHeroIfDeleted(data, deletedSet, bucket) {
  const hero = data.hero?.image;
  if (!hero || !deletedSet.has(hero.src)) return null;
  const replacement = bucket.find((p) => /\.jpe?g$/i.test(p)) ?? bucket[0] ?? null;
  const note = { old: hero.src, replacement };
  if (replacement) {
    hero.src = replacement;
    hero.alt = "";
    hero.caption = "";
  }
  return note;
}

function appendNewBlocks(data, added) {
  const sections = data.sections ?? [];
  if (sections.length === 0) return { section: null, ids: [] };
  const target = sections[sections.length - 1];
  const used = collectIds(data);
  const ids = [];
  added.forEach((srcPath, i) => {
    const id = uniqueId(srcPath, used);
    target.blocks.push(makeImageBlock(srcPath, id, i));
    ids.push(id);
  });
  // Grow the section canvas so placeholder blocks aren't clipped.
  const lastLarge = 40 + (added.length - 1) * 360 + 360;
  const lastSmall = 40 + (added.length - 1) * 520 + 520;
  target.canvas.largeHeight = Math.max(target.canvas.largeHeight, lastLarge);
  target.canvas.mediumHeight = Math.max(target.canvas.mediumHeight, lastLarge);
  target.canvas.smallHeight = Math.max(target.canvas.smallHeight, lastSmall);
  return { section: target, ids };
}

// --- main -------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const allowEmpty = args.includes("--allow-empty");
  const slug = args.find((a) => !a.startsWith("--"));

  if (!slug || !SLUG_RE.test(slug)) {
    throw new Error(
      "Usage: node scripts/refresh-travel-bucket.mjs <slug> [--dry-run] [--allow-empty]",
    );
  }

  const bucket = await listTripImages(slug);
  if (bucket.length === 0 && !allowEmpty) {
    throw new Error(
      `No images returned for travels/${slug}/ — refusing to wipe assets. ` +
        "Check the slug and bucket policy, or pass --allow-empty if the trip really has no images.",
    );
  }

  // Read the asset manifest and resolve the previously-known image set.
  const assetsSource = await readFile(ASSETS_PATH, "utf8");
  const known = readAssetPaths(assetsSource, slug);
  if (known === null) {
    throw new Error(
      `"${slug}" is not registered in src/data/travel-assets.ts. Run the add-trip skill first.`,
    );
  }

  const bucketSet = new Set(bucket);
  const knownSet = new Set(known);
  const added = bucket.filter((p) => !knownSet.has(p));
  const deleted = known.filter((p) => !bucketSet.has(p));

  if (added.length === 0 && deleted.length === 0) {
    console.log(`✓ ${slug} already in sync — ${bucket.length} image(s), nothing to do.`);
    return;
  }

  console.log(`Refreshing ${slug} (bucket has ${bucket.length} image(s)):`);
  for (const p of added) console.log(`  + ${p}`);
  for (const p of deleted) console.log(`  - ${p}`);

  // Read and edit the travel-detail layout.
  const detailFile = detailPath(slug);
  let detailRaw;
  try {
    detailRaw = await readFile(detailFile, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") {
      throw new Error(`No travel-detail layout at ${path.relative(root, detailFile)}.`);
    }
    throw error;
  }
  const data = JSON.parse(detailRaw);

  const deletedSet = new Set(deleted);
  const removedCount = removeDeletedBlocks(data, deletedSet);
  const heroNote = reassignHeroIfDeleted(data, deletedSet, bucket);
  const { section: newSection, ids: addedIds } = appendNewBlocks(data, added);

  // Build new file contents.
  const newAssets = rewriteAssetPaths(assetsSource, slug, bucket);
  const newDetail = `${JSON.stringify(data, null, 2)}\n`;

  // Report.
  if (removedCount > 0) console.log(`  layout: removed ${removedCount} block(s) for deleted images`);
  if (heroNote) {
    console.log(
      heroNote.replacement
        ? `  layout: hero image was deleted; reassigned to ${heroNote.replacement} (review this)`
        : `  layout: hero image was deleted and no replacement is available (fix manually)`,
    );
  }
  if (added.length > 0) {
    if (newSection) {
      console.log(
        `  layout: appended ${addedIds.length} placeholder block(s) to section "${newSection.name}" — reposition in /admin/travel-detail-editor`,
      );
    } else {
      console.log(
        `  layout: ${added.length} new image(s) not added — the layout has no sections to receive them`,
      );
    }
  }

  if (dryRun) {
    console.log("\n(dry run — no files written)");
    return;
  }

  await writeFile(ASSETS_PATH, newAssets);
  await writeFile(detailFile, newDetail);
  console.log(
    `\nUpdated src/data/travel-assets.ts and ${path.relative(root, detailFile)}.\n` +
      "Run `npx tsc --noEmit` and `npm run lint`, then reposition any new blocks in /admin/travel-detail-editor.",
  );
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exitCode = 1;
});
