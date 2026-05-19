# Customization Manual

## Projects Index And Detail Pages

Project index metadata lives in `src/data/projects.ts`.

The `PROJECTS` array controls the `/projects` index, the detail page hero, the specs strip, metrics, links, and previous/next navigation. The long-form detail page body lives in a separate Markdown file under `src/content/projects/`.

```ts
export const PROJECTS: Project[] = [
  {
    year: "2026",
    slug: "memory-archive",
    name: "Memory Archive",
    role: "Solo · design + build",
    kind: "Personal site",
    status: "shipping",
    stack: ["next.js", "mui", "tailwind"],
    color: "#c94b62",
    tagline: "A room I keep returning to - built so I have somewhere to put the things I love.",
    started: "Jan · 2026",
    filed: "ongoing",
    metrics: [["entries", "44"]],
    links: [["live", "lucygai.com"]],
  },
];
```

## Updating A Project Entry

To edit an existing project, find its object in `PROJECTS` and update the fields directly.

The `/projects` index uses:

- `year` for the small year label on the thumbnail and entry metadata
- `name` for the project title
- `role` for the mono metadata line under the title
- `kind` for the short description sentence
- `status` for the status dot label
- `stack` for the technology list
- `color` for the generated thumbnail color

The detail page uses the same metadata fields, plus:

- `tagline` for the opening summary under the hero title
- `started`, `filed`, `stack`, and `status` for the specs strip
- `metrics`, when present, for the "By the numbers" section
- `links`, when present, for the "Where to find it" section

The detail page body comes from a Markdown file whose filename matches the project `slug`:

```text
src/content/projects/memory-archive.md
```

The first project shown on `/projects` is simply the first object in the `PROJECTS` array. Move objects up or down in that array to reorder the index and the previous/next links on detail pages.

## Editing A Project Detail Page

Edit the Markdown file under `src/content/projects/`.

For example, `slug: "memory-archive"` loads:

```text
src/content/projects/memory-archive.md
```

Use normal Markdown:

```md
# Overview

I wanted somewhere with rooms.

## The editor

The collage editor started as a small internal tool.

> A useful pull quote can go here.

![The admin editor with draggable image frames.](/images/projects/memory-archive/editor-view.jpg)
```

When a Markdown file starts with `# Overview`, that first section is rendered as the special project lede from the prototype: a small mono `¶ Overview` label followed by larger serif text. Content after the next heading, such as `## The editor`, returns to the normal detail-page section styling.

Images should live in `public/images/projects/<slug>/`:

```text
public/images/projects/memory-archive/editor-view.jpg
```

Reference them from Markdown with a root-relative path:

```md
![The admin editor with draggable image frames.](/images/projects/memory-archive/editor-view.jpg)
```

The image alt text is also rendered as the visible caption. Keep it short and descriptive.

## Creating A New Project

To add a project:

1. Copy an existing object in `src/data/projects.ts`.
2. Paste it into the `PROJECTS` array where it should appear.
3. Change the `slug` to a unique kebab-case value, for example `reading-room`.
4. Update the visible fields: `year`, `name`, `role`, `kind`, `status`, `stack`, `color`, and `tagline`.
5. Create a matching Markdown file, for example `src/content/projects/reading-room.md`.
6. Keep `metrics` and `links` only if the project needs those sections; otherwise remove those properties.

The project URL is generated from `slug`. For example:

```ts
slug: "reading-room"
```

creates:

```text
/projects/reading-room
```

If you change a slug later, the page URL changes too. Update any links that pointed at the old URL.

## Editing The Project Page Design

Use `src/data/projects.ts` for index metadata and detail page chrome. Use `src/content/projects/*.md` for the main detail page writing. Use `src/components/content/ProjectArchive.tsx` only when changing how projects are rendered.

The main pieces are:

- `ProjectsSpreadList` renders the `/projects` index list
- `ProjectThumb` renders the generated color thumbnail
- `StatusDot` renders the status dot and label
- `ProjectDetailReport` renders the detail page
- `ProjectSpecs` renders the detail page specs strip
- `ProjectMarkdown` renders the Markdown body and image captions

The route files are thin wrappers:

- `src/app/projects/page.tsx` renders the projects index
- `src/app/projects/[slug]/page.tsx` finds the project by `slug`, loads the matching Markdown file, and renders the detail page

## Favorite Albums And Tracklists

Album display data lives in `src/data/content.ts`.

The `ALBUMS` array controls the records shown on `/favorites`, including local cover images:

```ts
export const ALBUMS: Album[] = [
  {
    src: "/images/favorites/albums/album-smile-porter.png",
    title: "SMILE! :D",
    artist: "Porter Robinson",
    year: "2024",
  },
];
```

Keep using local images under `public/images/favorites/albums/`. The Spotify sync script only updates track metadata; it does not download or replace album art.

## Marking Favorite Tracks

Featured and favorite track picks live in `src/data/favorite-albums.json`.

Edit `featuredTrackNumber` and `favoriteTrackNumbers` for each album:

```json
{
  "title": "SMILE! :D",
  "artist": "Porter Robinson",
  "featuredTrackNumber": 1,
  "favoriteTrackNumbers": [1, 2, 4]
}
```

The script matches tracks by title and writes `featured: true` and `fav: true` into the generated tracklist in `src/data/content.ts`.

Title-based fields still work as an escape hatch for unusual releases:

```json
{
  "featuredTrack": "Knock Yourself Out XD",
  "favoriteTracks": ["Knock Yourself Out XD"]
}
```

For ambiguous albums, pin the exact Spotify album ID. When `spotifyAlbumId` is present, the sync script skips search and fetches that album directly:

```json
{
  "title": "EUSEXUA",
  "artist": "FKA twigs",
  "spotifyAlbumId": "3o1TOhMkU5FFMSJMDhXfdF",
  "featuredTrackNumber": 1,
  "favoriteTrackNumbers": []
}
```

Each album should have one featured track. If `featuredTrack` is blank or does not match, the Favorites page falls back to the first favorite track, then the first track on the album.

## Spotify Sync

The sync script is `scripts/sync-spotify-albums.mjs`.

It:

- reads `src/data/favorite-albums.json`
- searches Spotify by album title and artist
- fetches track numbers, names, and durations
- converts durations to the site's `m:ss` format
- updates the `TRACKLISTS` block in `src/data/content.ts`
- applies `featured: true` from `featuredTrackNumber` or `featuredTrack`
- applies `fav: true` from `favoriteTrackNumbers` or `favoriteTracks`
- preserves local album image paths

Add Spotify credentials to `.env.local`:

```bash
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
SPOTIFY_MARKET=US
```

Then run:

```bash
npm run sync:spotify-albums
```

You do not need to run this every time the dev server starts. Run it only when you change `src/data/favorite-albums.json` or want to refresh track metadata from Spotify.

Typical workflow:

```bash
# 1. Edit favorite albums or favorite tracks
$EDITOR src/data/favorite-albums.json

# 2. Regenerate local tracklists
npm run sync:spotify-albums

# 3. Run the site normally
npm run dev
```

## Runtime Behavior

The public site does not call Spotify at runtime. It reads the generated local data from `src/data/content.ts`.

That means the site still works without Spotify credentials once the tracklists have been generated.

## Troubleshooting

If a favorite or featured track is misspelled, or Spotify returns a slightly different title, the sync script prints a warning:

```bash
Favorite not matched: Track Name
Favorite track number not matched: 4
Featured track not matched: Track Name
```

Update the title in `src/data/favorite-albums.json` to match Spotify's track name, then rerun:

```bash
npm run sync:spotify-albums
```
