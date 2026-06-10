import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

// Shared helpers for listing a trip's images from the Supabase storage bucket.
// Used by list-travel-bucket.mjs and refresh-travel-bucket.mjs.
//
// Env (.env.local): NEXT_PUBLIC_SITE_IMAGE_BASE_URL (already set for the site)
// plus a Supabase API key — SUPABASE_PUBLISHABLE_KEY (or the legacy anon key),
// or a SUPABASE_SECRET_KEY / SUPABASE_SERVICE_ROLE_KEY to bypass RLS.

const root = process.cwd();
const envPath = path.join(root, ".env.local");
const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;

function loadLocalEnv(text) {
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] ??= value;
  }
}

export async function maybeLoadEnv() {
  try {
    loadLocalEnv(await readFile(envPath, "utf8"));
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

// Derive the project origin + bucket from the public object base URL, e.g.
// https://abcd.supabase.co/storage/v1/object/public/site-images
export function resolveStorageTarget() {
  const explicitUrl = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const explicitBucket = process.env.SUPABASE_BUCKET;
  if (explicitUrl && explicitBucket) {
    return { origin: explicitUrl, bucket: explicitBucket };
  }

  const base = process.env.NEXT_PUBLIC_SITE_IMAGE_BASE_URL?.replace(/\/+$/, "");
  if (!base) {
    throw new Error(
      "Missing NEXT_PUBLIC_SITE_IMAGE_BASE_URL (or set SUPABASE_URL + SUPABASE_BUCKET) in .env.local.",
    );
  }

  const marker = "/storage/v1/object/public/";
  const idx = base.indexOf(marker);
  if (idx === -1) {
    throw new Error(
      `Could not parse NEXT_PUBLIC_SITE_IMAGE_BASE_URL ("${base}"). ` +
        "Expected .../storage/v1/object/public/<bucket>, or set SUPABASE_URL + SUPABASE_BUCKET explicitly.",
    );
  }

  return {
    origin: base.slice(0, idx),
    bucket: base.slice(idx + marker.length).replace(/\/+$/, ""),
  };
}

export function resolveKey() {
  // Any Supabase API key authenticates the Storage list call. Secret /
  // service_role keys bypass RLS so they always work; publishable / anon keys
  // respect RLS and only list if a select policy on storage.objects allows it.
  const key =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error(
      "Missing a Supabase API key in .env.local — set SUPABASE_PUBLISHABLE_KEY " +
        "(or SUPABASE_SECRET_KEY / SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ANON_KEY) to list the bucket.",
    );
  }
  return key;
}

// Returns the sorted logical site paths (/images/travels/<tripId>/<file>) for
// every image under travels/<tripId>/ in the bucket.
export async function listTripImages(tripId) {
  await maybeLoadEnv();
  const { origin, bucket } = resolveStorageTarget();
  const key = resolveKey();
  const prefix = `travels/${tripId}/`;

  const response = await fetch(`${origin}/storage/v1/object/list/${bucket}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prefix,
      limit: 1000,
      sortBy: { column: "name", order: "asc" },
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Supabase list failed (${response.status}) for "${prefix}". ${detail}`.trim(),
    );
  }

  const entries = await response.json();
  return entries
    .filter((entry) => entry?.id && IMAGE_EXT.test(entry.name)) // id === null ⇒ folder
    .map((entry) => `/images/travels/${tripId}/${entry.name}`)
    .sort();
}
