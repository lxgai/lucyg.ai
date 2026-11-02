---
name: add-trip
description: Scaffold a new travel entry end-to-end — list the trip's images from the Supabase bucket and wire up the travel article JSON, the route page, the TRIPS index, TRAVEL_ARTICLES, and the asset manifest, keeping the slug consistent across all files. Use when the user wants to add a new trip/travel page, e.g. "add a trip", "scaffold travels/&lt;slug&gt;", "set up a new travel entry". Images must already be uploaded to the bucket under travels/&lt;slug&gt;/.
---

# add-trip

Scaffold every file a new trip touches, with the slug kept consistent across all of them, and the image paths wired from the actual Supabase bucket contents (not guessed). The result is a bare article Lucy fills in `/admin/travel-detail-editor`. The editor only saves articles that already exist, so this skill is how a trip gets its first file.

## Hard rules

- **Never write image binaries or touch `public/`.** Trip images live in Supabase; the repo only stores *logical* paths `/images/travels/<slug>/<file>`. `src/lib/images.ts` rewrites those to the bucket URL at render.
- **The slug is the contract.** It must be identical across: the article filename `src/data/travel-articles/<slug>.json` and its `slug` field, the route folder `src/app/travels/<slug>/`, `TRIPS[].id` in `src/data/travels.ts`, the `TRAVEL_ARTICLES` key in `src/data/travelEntries.ts`, and the key in `src/data/travel-assets.ts`. Validate it is kebab-case (`^[a-z0-9]+(?:-[a-z0-9]+)*$`) and not already present in `TRIPS`.
- **Only wire images the bucket actually returns.** Every path written must come from the listing in step 2. Do not invent filenames.
- **Use the existing model.** The article must match `TravelArticle` in `src/types/travelArticle.ts`; read `src/data/travel-articles/china-25.json` as the worked example.

## Inputs to collect

Ask for any not provided:
- `slug` — e.g. `iceland-25` (kebab-case; images already uploaded under `travels/<slug>/`).
- `place` — the Travel Log name, e.g. `Iceland`.
- `title` — the page title, e.g. `Iceland, winter '25`.
- `startDate` and `endDate` — `MM / DD / YYYY`.
- `cities` — in order, e.g. `Reykjavík, Vík`. Each becomes a city tag and an h2 section.
- Optional: an opening image and intro sentence.

## Steps

### 1. Validate the slug
Read `src/data/travels.ts`; confirm the slug is well-formed and not already in `TRIPS`. Stop and report if it collides.

### 2. List the bucket
Run:
```
npm run list:travel-bucket -- <slug>
```
This prints the logical paths (`/images/travels/<slug>/<file>`) for every image under `travels/<slug>/`.
- If it errors about a missing key, tell the user to add the variable to `.env.local` (see **Prerequisite** below) and stop — do not fall back to guessing filenames.
- If it returns zero images, the upload hasn't happened yet — stop and tell the user to upload to `travels/<slug>/` first.

### 3. Write the article
Create `src/data/travel-articles/<slug>.json` (2-space indent, native names unescaped):

- `slug`, `place`, `title`, `startDate`, `endDate`, and `tags` set to the cities.
- `blocks`: the opening hero `canvas` block (`"background": "dots"`, `height` about 480, holding the hero image as one item at roughly `x: 24, y: 0, width: 672`, `rotation: 0`, `zIndex: 1`, with a real alt text) and intro `text` block if given, then one `section` block per city: `{ "id": "<slugged city>", "type": "section", "level": 2, "title": "<city>" }`. Ids are unique across the article.

Don't place the rest of the photos; they appear in the editor's image library from `TRAVEL_ASSETS`.

### 4. Register the trip
- Add `{ id: "<slug>" }` to `TRIPS` in `src/data/travels.ts`. Don't add `place`/`sub`/`date`/`duration`; the article is the source of truth for those.
- Import the JSON in `src/data/travelEntries.ts` and add `"<slug>": <name> as TravelArticle` to `TRAVEL_ARTICLES`.
- Add a `TRAVEL_ASSETS["<slug>"]` array in `src/data/travel-assets.ts` containing **all** listed paths, sorted, matching the existing formatting.

### 5. Create the route page
Create `src/app/travels/<slug>/page.tsx` as a copy of `src/app/travels/china-25/page.tsx`, pointed at the new JSON with a matching component name.

### 6. Verify
- Every image path in the article and the asset manifest appears in the step-2 listing.
- The slug is identical across every file listed under **Hard rules**.

Report any mismatch instead of silently fixing a wrong slug.

### 7. Gate
Run the project's verification gate from CLAUDE.md:
```
npx tsc --noEmit
npm run lint
```
Then summarize what was created and tell the user to build out the page in `/admin/travel-detail-editor`.

## Prerequisite (one-time)

Listing the bucket needs a Supabase API key beyond the public image base URL. Add to `.env.local`:
```
SUPABASE_PUBLISHABLE_KEY=...   # or SUPABASE_SECRET_KEY / SUPABASE_SERVICE_ROLE_KEY to bypass RLS
```
A publishable/anon key only lists if a Storage RLS `select` policy allows it on the `travels/` prefix; a secret/service-role key bypasses RLS. The script derives the project URL and bucket name from the existing `NEXT_PUBLIC_SITE_IMAGE_BASE_URL`. If that URL isn't the standard `.../storage/v1/object/public/<bucket>` form, also set `SUPABASE_URL` and `SUPABASE_BUCKET`.
