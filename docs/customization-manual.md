# Customization Manual

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

Favorite track picks live in `src/data/favorite-albums.json`.

Edit the `favoriteTracks` array for each album:

```json
{
  "title": "SMILE! :D",
  "artist": "Porter Robinson",
  "favoriteTracks": [
    "Knock Yourself Out XD",
    "Cheerleader",
    "Perfect Pinterest Girl"
  ]
}
```

The script matches favorite tracks by title and writes `fav: true` into the generated tracklist in `src/data/content.ts`.

## Spotify Sync

The sync script is `scripts/sync-spotify-albums.mjs`.

It:

- reads `src/data/favorite-albums.json`
- searches Spotify by album title and artist
- fetches track numbers, names, and durations
- converts durations to the site's `m:ss` format
- updates the `TRACKLISTS` block in `src/data/content.ts`
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

If a favorite track is misspelled or Spotify returns a slightly different title, the sync script prints a warning:

```bash
Favorite not matched: Track Name
```

Update the title in `src/data/favorite-albums.json` to match Spotify's track name, then rerun:

```bash
npm run sync:spotify-albums
```
