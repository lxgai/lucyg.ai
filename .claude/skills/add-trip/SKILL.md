---
name: add-trip
description: Scaffold a new travel entry end-to-end — list the trip's images from the Supabase bucket and wire them into the travel-detail JSON, the route page, the TRIPS index, and the asset manifest, keeping the slug consistent across all files. Use when the user wants to add a new trip/travel page, e.g. "add a trip", "scaffold travels/<slug>", "set up a new travel entry". Images must already be uploaded to the bucket under travels/<slug>/.
---

# add-trip

Scaffold every file a new trip touches, with the slug kept consistent across all of them, and the image paths wired from the actual Supabase bucket contents (not guessed). This removes the most error-prone manual workflow in the project: keeping one slug in sync across the data files, route, and asset manifest, and hand-listing image paths.

## Hard rules

- **Never write image binaries or touch `public/`.** Trip images live in Supabase; the repo only stores *logical* paths `/images/travels/<slug>/<file>`. `src/lib/images.ts` rewrites those to the bucket URL at render.
- **The slug is the contract.** It must be identical across: the travel-detail JSON filename, the route folder `src/app/travels/<slug>/`, `TRIPS[].id` in `src/data/travels.ts`, and the key in `src/data/travel-assets.ts`. Validate it is kebab-case (`^[a-z0-9]+(?:-[a-z0-9]+)*$`) and not already present in `TRIPS`.
- **Only wire images the bucket actually returns.** Every path written must come from the listing in step 2. Do not invent filenames.

## Inputs to collect

Ask for any not provided:
- `slug` — e.g. `iceland-25` (kebab-case; images already uploaded under `travels/<slug>/`).
- `place` — display name, e.g. `Iceland`.
- `sub` — cities/subtitle, e.g. `Reykjavík · Vík`.
- `date` — `MM / YYYY`.
- `duration` — e.g. `7 days`.
- `cover` — which image is the index cover (offer the listed `.jpg`s; default to the first).

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

### 3. Generate the travel-detail JSON
Create `src/data/travel-details/<slug>.json`. **Read `src/data/travel-details/china-24.json` first** and mirror its schema: `fileNo`, `section`, `metadata` (`place`, `dateRange`, `duration`), `hero` (per-breakpoint title/intro/image layouts), and `sections[]` (each with per-breakpoint `canvas`, `blocks`, and `decorations`). Fill metadata from the inputs and distribute the listed images across hero + section blocks as placeholders. Do **not** add editable section-width controls; section widths stay as in the template (see CLAUDE.md travel-detail rules). Keep the JSON structured and formatted; do not hand-concatenate strings.

### 4. Register the trip
- Add a `TRIPS` entry in `src/data/travels.ts` with `id`/`place`/`sub`/`date`/`duration`/`cover`. Use the chosen `cover` logical path.
- Add a `TRAVEL_ASSETS["<slug>"]` array in `src/data/travel-assets.ts` containing **all** listed paths, sorted, matching the existing formatting.

### 5. Create the route page
Create `src/app/travels/<slug>/page.tsx`. **Read `src/app/travels/china-24/page.tsx` first** and mirror it exactly — a server component that imports the travel-detail JSON and renders `<TravelDetailPage data={... as TravelDetailData} />`. Then register the route in `scripts/generate-page-updated.mjs` by adding a `ROUTES` entry: `{ route: "/travels/<slug>", sources: ["src/app/travels/<slug>/page.tsx", "src/components/travel/TravelDetailPage.tsx", "src/data/travel-details/<slug>.json"] }`.

### 6. Verify
- Confirm every image path written into the travel-detail JSON and the asset manifest appears in the step-2 listing (no typos, no missing uploads).
- Confirm the slug is identical across the travel-detail JSON filename, the route folder, `TRIPS[].id`, the `TRAVEL_ASSETS` key, and the `generate-page-updated.mjs` route entry.
- Confirm `cover` is one of the listed paths.
Report any mismatch instead of silently fixing a wrong slug.

### 7. Gate
Run the project's verification gate from CLAUDE.md:
```
npx tsc --noEmit
npm run lint
```
Then summarize what was created and tell the user the layout is a scaffold — positions should be refined in `/admin/travel-detail-editor`.

## Prerequisite (one-time)

Listing the bucket needs a Supabase API key beyond the public image base URL. Add to `.env.local`:
```
SUPABASE_PUBLISHABLE_KEY=...   # or SUPABASE_SECRET_KEY / SUPABASE_SERVICE_ROLE_KEY to bypass RLS
```
A publishable/anon key only lists if a Storage RLS `select` policy allows it on the `travels/` prefix; a secret/service-role key bypasses RLS. The script derives the project URL and bucket name from the existing `NEXT_PUBLIC_SITE_IMAGE_BASE_URL`. If that URL isn't the standard `.../storage/v1/object/public/<bucket>` form, also set `SUPABASE_URL` and `SUPABASE_BUCKET`.
