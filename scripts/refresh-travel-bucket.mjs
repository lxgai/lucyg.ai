import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { listTripImages } from "./lib/travel-bucket.mjs";

// Re-syncs a trip with the Supabase storage bucket: detects images added to or
// deleted from travels/<slug>/, then updates TRAVEL_ASSETS and the trip's
// article to match.
//
// - TRAVEL_ASSETS[slug] is rewritten to the full sorted bucket listing, so new
//   images show up in the editor's image library.
// - Deleted images: image blocks and canvas items that use them are removed
//   from src/data/travel-articles/<slug>.json.
//
// Usage: node scripts/refresh-travel-bucket.mjs <slug> [--dry-run] [--allow-empty]

const root = process.cwd();
const ASSETS_PATH = path.join(root, "src/data/travel-assets.ts");
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function articlePath(slug) {
  return path.join(root, "src/data/travel-articles", `${slug}.json`);
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

// --- Article edits -----------------------------------------------------------

// Drops image blocks and canvas image items whose file was deleted.
function removeDeletedImages(article, deletedSet) {
  let removed = 0;
  article.blocks = article.blocks.filter((block) => {
    if (block.type === "image" && deletedSet.has(block.src)) {
      removed += 1;
      return false;
    }
    if (block.type === "canvas") {
      const before = block.items.length;
      block.items = block.items.filter((item) => !(item.kind === "image" && deletedSet.has(item.src)));
      removed += before - block.items.length;
    }
    return true;
  });
  return removed;
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

  // Read and edit the article.
  const file = articlePath(slug);
  let raw;
  try {
    raw = await readFile(file, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") {
      throw new Error(`No travel article at ${path.relative(root, file)}.`);
    }
    throw error;
  }
  const article = JSON.parse(raw);
  const removedCount = removeDeletedImages(article, new Set(deleted));

  const newAssets = rewriteAssetPaths(assetsSource, slug, bucket);
  const newArticle = `${JSON.stringify(article, null, 2)}\n`;

  if (removedCount > 0) console.log(`  article: removed ${removedCount} image(s) that were deleted`);
  if (added.length > 0) {
    console.log(`  article: ${added.length} new image(s) are in the editor's image library, ready to place`);
  }

  if (dryRun) {
    console.log("\n(dry run — no files written)");
    return;
  }

  await writeFile(ASSETS_PATH, newAssets);
  if (removedCount > 0) await writeFile(file, newArticle);
  console.log(
    `\nUpdated src/data/travel-assets.ts${removedCount > 0 ? ` and ${path.relative(root, file)}` : ""}.\n` +
      "Run `npx tsc --noEmit` and `npm run lint`, then place any new images in /admin/travel-detail-editor.",
  );
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exitCode = 1;
});
