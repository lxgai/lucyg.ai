# Customization Manual

How to change the content on each page. For how things should look, see `docs/design.md`.

## Images

Home, project and travel images live in the Supabase bucket, not the repo. In code and Markdown you write a logical path, and `src/lib/images.ts` rewrites it to the bucket URL:

| Logical path | Bucket object |
|---|---|
| `/images/home/<file>` | `home/<file>` |
| `/images/projects/<slug>/<file>` | `projects/<slug>/<file>` |
| `/images/travels/<slug>/<file>` | `travels/<slug>/<file>` |

The result is `{NEXT_PUBLIC_SITE_IMAGE_BASE_URL}/<bucket object>`. That variable must be set in `.env.local` (and in the host's environment for production), and the filename must match the uploaded file exactly, including case and extension. Restart the dev server after changing `.env.local`.

Favorites covers (`public/images/favorites/`) and audio clips (`public/audio/favorites/`) stay local.

## Home

The Home page is `src/app/page.tsx`. Edit it directly:

- The banner is `/images/home/home_image.png`. It's dithered, so it's served unoptimized and pixel-sharp; replace the file in the bucket to change it.
- The greeting, the three intro paragraphs and the sign-off are plain JSX.
- The **Currently** list is the `CURRENTLY` array at the top of the file. Each row is a `label` and a `value`.
- The table of contents on Home is the site nav, `SITE_NAV`.

## Projects

Project metadata lives in `src/data/projects.ts`; the write-up lives in `src/content/projects/<slug>.md`.

```ts
export const PROJECTS: Project[] = [
  {
    year: "2026",
    slug: "memory-archive",
    name: "Memory Archive",
    kind: "Personal site",
    status: "live",
    stack: ["next.js", "mui", "tailwind"],
    color: "#c94b62",
    image: "/images/projects/memory-archive/homepage.png",
    first_published: "July · 10 · 2026",
    links: [["live", "lucyg.ai"], ["source", "https://github.com/lxgai/lucyg.ai"]],
  },
];
```

The `/projects` list shows, per row:

- `image` as the 280×190 thumbnail
- `name`
- `kind` and `stack` as "Personal site. next.js · mui · tailwind"
- `first_published` as a date such as "Jul 10, 2026"

Rows appear in array order.

The detail page `/projects/<slug>` uses:

- `name` as the title, with a trailing period
- `first_published` as the handwritten date line
- `stack` plus `status` as the tag row
- `image` as the hero, full width
- `links` for the closing line, e.g. "Live at lucyg.ai · source on GitHub". `live` and `source` get those prefixes; other kinds render as `kind:`. Remove `links` to drop the line.

`year`, `color` and `updated` aren't shown on the redesigned pages.

Dates accept `"MM / DD / YYYY"`, `"MM/DD/YY"` or `"July · 10 · 2026"`.

### Writing the project page

The Markdown file name must match the `slug`. Use normal Markdown:

```md
# Overview

I wanted somewhere with rooms.

## The editor

The travel-detail editor started as a small internal tool.

### Dragging

...

![The admin editor with draggable image frames.](/images/projects/memory-archive/editor-view.jpg)
```

- A leading `# Overview` section becomes the italic lede under the title. It isn't repeated in the body.
- `##` and `###` headings become the table of contents, with `###` nested under the `##` above it.
- An image on its own line becomes a full-width figure; its alt text is the handwritten caption.
- A line of only `✧ ✦ ✧` becomes the `* * *` divider.
- External links open in a new tab. Tables scroll sideways on narrow screens.

### Adding a project

1. Copy an object in `PROJECTS` and place it where it should appear.
2. Give it a unique kebab-case `slug`; the URL becomes `/projects/<slug>`.
3. Upload its images to the bucket under `projects/<slug>/` and set `image`.
4. Create `src/content/projects/<slug>.md`.

Changing a slug changes the URL; update anything that linked to the old one.

## Travels

Trips are listed in `src/data/travels.ts` (`TRIPS`). A trip with a detail page takes its country, cities and date from `src/data/travel-details/<id>.json`; a trip without one uses the optional `place`, `sub` and `date` fields.

- `/travels` (the Travel Log) shows each trip's date, country and city tags, newest first. The first city is a tag; the rest collapse into a `+N` tag whose tooltip lists them.
- The country links to `/travels/<id>` only when a detail page exists.
- The sidebar's **Recent Travels** shows the two newest trips.

Detail pages and the editor at `/admin/travel-detail-editor` still use the old fixed-canvas layout until the travel redesign. Use the `add-trip` skill to scaffold a new trip, and `derive-travel-layouts` for its medium and small layouts.

## Blog

Posts come from the Substack RSS feed (`SUBSTACK_FEED_URL` in `.env.local`).

- Tags: Substack's feed usually has none. Add them by post slug in `src/data/blog-tags.ts`:

  ```ts
  export const BLOG_TAGS_BY_SLUG: Record<string, string[]> = {
    "sample-post": ["sesame", "foodie"],
  };
  ```

  They render with a `#` prefix. Posts without tags show no chips.
- `##` and `###` headings in the post become the table of contents.
- A paragraph of only `✧ ✦ ✧` becomes the `* * *` divider.
- The "Also on Substack." link on `/blog` comes from `SUBSTACK_PUBLICATION_URL`, or is derived from the feed URL.
- The sidebar's **Selected Writing** shows the two newest posts.
- Set `SUBSTACK_USE_SAMPLE_FEED=1` to use the fixture feed at `src/data/substack/sample-feed.xml`. With no feed configured, the blog falls back to `POSTS` in `src/data/blog.ts`.

## Favorites

All favorites data lives in `src/data/favorites.ts`, plus track picks in `src/data/favorite-albums.json`. Use the `manage-albums` skill to add, remove or reorder albums; it keeps every file in sync.

### Albums

Each `ALBUMS` entry is a cover, title, artist, year and `customorder`:

```ts
{ src: "/images/favorites/albums/album-worlds.jpg", title: "Worlds", artist: "Porter Robinson", year: "2014", customorder: 11 },
```

- Albums are listed by `customorder`, highest first. Keep the numbers contiguous.
- Each row shows the title with the artist and year as tags. Opening it shows the cover, the featured track's play button, and the tracklist with `★` on favorite tracks.
- Covers are local files under `public/images/favorites/albums/`.

### Featured track and audio clip

The play button plays a local clip of the featured track. Clips live in `public/audio/favorites/` and are mapped by album title and track number in `FEATURED_TRACK_AUDIO`:

```ts
export const FEATURED_TRACK_AUDIO = {
  "nolimit,": { 14: "/audio/favorites/feel-u-luv-me.mp3" },
};
```

The album title must match `ALBUMS` exactly. An album with no clip shows a link that searches Spotify for the featured track instead. An album with no tracklist shows "Listen on Spotify".

### Marking favorite tracks

Edit `featuredTrackNumber` and `favoriteTrackNumbers` for each album in `src/data/favorite-albums.json`:

```json
{
  "title": "Worlds",
  "artist": "Porter Robinson",
  "featuredTrackNumber": 1,
  "favoriteTrackNumbers": [1, 2, 3, 10, 12]
}
```

Then rerun the Spotify sync (below). It writes `featured: true` and `fav: true` into `TRACKLISTS` in `src/data/favorites.ts`.

Title-based fields work as an escape hatch for unusual releases:

```json
{
  "featuredTrack": "Knock Yourself Out XD",
  "favoriteTracks": ["Knock Yourself Out XD"]
}
```

For an album Spotify search gets wrong, pin its ID; the script then fetches it directly:

```json
{
  "title": "EUSEXUA",
  "artist": "FKA twigs",
  "spotifyAlbumId": "3o1TOhMkU5FFMSJMDhXfdF",
  "featuredTrackNumber": 3,
  "favoriteTrackNumbers": [2, 3, 4, 6, 8, 9, 10]
}
```

If no featured track matches, the album has no play button or Spotify search link; the sync script warns about it.

### Spotify sync

`scripts/sync-spotify-albums.mjs` reads `favorite-albums.json`, looks each album up on Spotify, and rewrites the `TRACKLISTS` block in `src/data/favorites.ts` with track numbers, names, `m:ss` durations and the featured/favorite flags. It doesn't touch covers.

Add credentials to `.env.local`:

```bash
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
SPOTIFY_MARKET=US
```

Then run:

```bash
npm run sync:spotify-albums
```

Run it only after changing `favorite-albums.json` or to refresh track data. The site never calls Spotify at runtime.

If a pick doesn't match, the script warns:

```text
Favorite not matched: Track Name
Favorite track number not matched: 4
Featured track not matched: Track Name
```

Fix the title or number in `favorite-albums.json` to match Spotify and rerun.

### Films

Each `MOVIES` entry is a poster, title, year, director, rating, date and note:

```ts
{ src: "/images/favorites/movies/movie-anora.jpg", title: "Anora", year: "2024", director: "Sean Baker", rating: 4.5, date: "11 · 02 · 24", note: "Sprints without ever tiring." },
```

- Each row shows the title with the director and year as tags. Opening it shows the poster, a description and "Read review".
- The page reads the Letterboxd RSS feed (`LETTERBOXD_FEED_URL`, defaulting to `lucy_gai`'s feed) at most once an hour and matches films by title and year. When a match has a review, its text replaces `note` and "Read review" links to it. Otherwise the local `note` shows and the link goes to `letterboxd.com/lucy_gai/film/<title-slug>/`.
- Posters are local files under `public/images/favorites/movies/`.

## Footer and sidebar

- Footer social links are in `src/components/site/SiteShell.tsx`.
- The sidebar's Recent Travels and Selected Writing update on their own from the travel data and the Substack feed.
