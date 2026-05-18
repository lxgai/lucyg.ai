import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const picksPath = path.join(root, "src/data/favorite-albums.json");
const favoritesPath = path.join(root, "src/data/favorites.ts");
const envPath = path.join(root, ".env.local");
const spotifyApi = "https://api.spotify.com/v1";

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

async function maybeLoadEnv() {
  try {
    loadLocalEnv(await readFile(envPath, "utf8"));
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

function normalize(value) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, " ")
    .trim();
}

function formatDuration(durationMs) {
  const totalSeconds = Math.round(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function tsString(value) {
  return JSON.stringify(value);
}

async function getAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET. Add them to .env.local.",
    );
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  if (!response.ok) {
    throw new Error(`Spotify token request failed: ${response.status} ${await response.text()}`);
  }

  const body = await response.json();
  return body.access_token;
}

async function spotifyGet(token, endpoint, params = {}) {
  const url = new URL(`${spotifyApi}${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, value);
  }

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Spotify request failed for ${url.pathname}: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

function chooseAlbum(albums, pick) {
  const wantedTitle = normalize(pick.title);
  const wantedArtist = normalize(pick.artist);

  const exact = albums.find((album) => {
    const albumTitle = normalize(album.name);
    const albumArtists = album.artists.map((artist) => normalize(artist.name));
    return albumTitle === wantedTitle && albumArtists.includes(wantedArtist);
  });

  return exact ?? albums[0];
}

async function findAlbum(token, pick) {
  if (pick.spotifyAlbumId) {
    return spotifyGet(token, `/albums/${pick.spotifyAlbumId}`, {
      market: process.env.SPOTIFY_MARKET ?? "US",
    });
  }

  const query = `album:${pick.title} artist:${pick.artist}`;
  const search = await spotifyGet(token, "/search", {
    q: query,
    type: "album",
    limit: "5",
    market: process.env.SPOTIFY_MARKET ?? "US",
  });

  const album = chooseAlbum(search.albums?.items ?? [], pick);
  if (!album) {
    throw new Error(`No Spotify album found for "${pick.title}" by ${pick.artist}.`);
  }

  return album;
}

async function getAlbumTracks(token, albumId) {
  const tracks = [];
  let offset = 0;

  while (true) {
    const page = await spotifyGet(token, `/albums/${albumId}/tracks`, {
      limit: "50",
      offset: String(offset),
      market: process.env.SPOTIFY_MARKET ?? "US",
    });

    tracks.push(...page.items);
    if (!page.next) break;
    offset += page.limit;
  }

  return tracks;
}

function buildTracklist(pick, spotifyTracks) {
  const favoriteNames = new Set((pick.favoriteTracks ?? []).map(normalize));
  const favoriteNumbers = new Set(pick.favoriteTrackNumbers ?? []);
  const featuredName = pick.featuredTrack ? normalize(pick.featuredTrack) : "";
  const featuredNumber = pick.featuredTrackNumber ?? null;
  const matchedFavorites = new Set();
  const matchedFavoriteNumbers = new Set();
  let matchedFeatured = false;

  const tracks = spotifyTracks.map((track) => {
    const normalizedName = normalize(track.name);
    const isFavorite =
      favoriteNames.has(normalizedName) || favoriteNumbers.has(track.track_number);
    const isFeatured =
      (Boolean(featuredName) && normalizedName === featuredName) ||
      featuredNumber === track.track_number;
    if (isFavorite) matchedFavorites.add(normalizedName);
    if (favoriteNumbers.has(track.track_number)) {
      matchedFavoriteNumbers.add(track.track_number);
    }
    if (isFeatured) matchedFeatured = true;

    return {
      n: track.track_number,
      name: track.name,
      time: formatDuration(track.duration_ms),
      fav: isFavorite,
      featured: isFeatured,
    };
  });

  const missingFavorites = (pick.favoriteTracks ?? []).filter(
    (name) => !matchedFavorites.has(normalize(name)),
  );
  const missingFavoriteNumbers = (pick.favoriteTrackNumbers ?? []).filter(
    (n) => !matchedFavoriteNumbers.has(n),
  );
  const missingFeatured =
    (featuredName || featuredNumber !== null) && !matchedFeatured
      ? pick.featuredTrack ?? `track ${featuredNumber}`
      : "";

  return { tracks, missingFavorites, missingFavoriteNumbers, missingFeatured };
}

function renderTrack(track) {
  const fav = track.fav ? ", fav: true" : "";
  const featured = track.featured ? ", featured: true" : "";
  return `    { n: ${track.n}, name: ${tsString(track.name)}, time: ${tsString(track.time)}${fav}${featured} },`;
}

function renderTracklists(tracklists) {
  const lines = [
    "// Generated by scripts/sync-spotify-albums.mjs. Featured and favorite picks live in src/data/favorite-albums.json.",
    "export const TRACKLISTS: Record<string, Track[]> = {",
  ];

  for (const { title, tracks } of tracklists) {
    lines.push(`  ${tsString(title)}: [`);
    lines.push(...tracks.map(renderTrack));
    lines.push("  ],");
  }

  lines.push("};");
  return lines.join("\n");
}

function replaceTracklists(content, rendered) {
  const start = content.indexOf("export const TRACKLISTS: Record<string, Track[]> = {");
  const defaultStart = content.indexOf("\nexport const DEFAULT_TRACKLIST", start);

  if (start === -1 || defaultStart === -1) {
    throw new Error("Could not find TRACKLISTS block in src/data/favorites.ts.");
  }

  const commentStart = content.lastIndexOf(
    "// Generated by scripts/sync-spotify-albums.mjs.",
    start,
  );
  const replaceStart = commentStart === -1 ? start : commentStart;

  return `${content.slice(0, replaceStart)}${rendered}\n${content.slice(defaultStart)}`;
}

async function main() {
  await maybeLoadEnv();

  const picks = JSON.parse(await readFile(picksPath, "utf8"));
  const token = await getAccessToken();
  const generated = [];

  for (const pick of picks) {
    const album = await findAlbum(token, pick);
    const tracks = await getAlbumTracks(token, album.id);
    const {
      tracks: tracklist,
      missingFavorites,
      missingFavoriteNumbers,
      missingFeatured,
    } = buildTracklist(pick, tracks);

    generated.push({ title: pick.title, tracks: tracklist });
    console.log(`Synced ${pick.title} - ${album.name} (${tracklist.length} tracks)`);

    for (const favorite of missingFavorites) {
      console.warn(`  Favorite not matched: ${favorite}`);
    }
    for (const favorite of missingFavoriteNumbers) {
      console.warn(`  Favorite track number not matched: ${favorite}`);
    }
    if (missingFeatured) {
      console.warn(`  Featured track not matched: ${missingFeatured}`);
    }
  }

  const content = await readFile(favoritesPath, "utf8");
  const nextContent = replaceTracklists(content, renderTracklists(generated));
  await writeFile(favoritesPath, nextContent);
  console.log("Updated src/data/favorites.ts");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
