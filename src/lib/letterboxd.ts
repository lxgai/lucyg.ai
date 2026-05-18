import { XMLParser } from "fast-xml-parser";
import sanitizeHtml from "sanitize-html";
import { MOVIES } from "@/data/content";

const DEFAULT_LETTERBOXD_FEED_URL = "https://letterboxd.com/lucy_gai/rss/";
const REVALIDATE_SECONDS = 60 * 60;

export type LetterboxdMovieEntry = {
  key: string;
  title: string;
  year: string;
  rating?: number;
  date?: string;
  note?: string;
  sourceUrl?: string;
};

type RssItem = {
  title?: unknown;
  link?: unknown;
  guid?: unknown;
  pubDate?: unknown;
  description?: unknown;
  "content:encoded"?: unknown;
  "letterboxd:filmTitle"?: unknown;
  "letterboxd:filmYear"?: unknown;
  "letterboxd:memberRating"?: unknown;
  "letterboxd:watchedDate"?: unknown;
  "letterboxd:rewatch"?: unknown;
};

type RssDocument = {
  rss?: {
    channel?: {
      item?: RssItem | RssItem[];
    };
  };
};

const parser = new XMLParser({
  ignoreAttributes: false,
  trimValues: false,
});

export async function getLetterboxdFavoriteMovieEntries() {
  const feedXml = await getFeedXml();

  if (!feedXml) {
    return [];
  }

  try {
    const entries = parseLetterboxdFeed(feedXml);
    const favoriteKeys = new Set(MOVIES.map((movie) => movieKey(movie.title, movie.year)));
    const latestByKey = new Map<string, LetterboxdMovieEntry>();

    for (const entry of entries) {
      if (favoriteKeys.has(entry.key) && !latestByKey.has(entry.key)) {
        latestByKey.set(entry.key, entry);
      }
    }

    return Array.from(latestByKey.values());
  } catch (error) {
    console.error("Unable to parse Letterboxd RSS feed.", error);
    return [];
  }
}

async function getFeedXml() {
  const feedUrl = normalizeExternalUrl(process.env.LETTERBOXD_FEED_URL) ?? DEFAULT_LETTERBOXD_FEED_URL;

  try {
    const response = await fetch(feedUrl, { next: { revalidate: REVALIDATE_SECONDS } });

    if (!response.ok) {
      throw new Error(`Letterboxd feed returned ${response.status}`);
    }

    return response.text();
  } catch (error) {
    console.error("Unable to fetch Letterboxd RSS feed.", error);
    return undefined;
  }
}

function parseLetterboxdFeed(feedXml: string): LetterboxdMovieEntry[] {
  const parsed = parser.parse(feedXml) as RssDocument;
  const rawItems = parsed.rss?.channel?.item;
  const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];

  return items
    .map((item) => toMovieEntry(item))
    .filter((entry): entry is LetterboxdMovieEntry => Boolean(entry));
}

function toMovieEntry(item: RssItem): LetterboxdMovieEntry | undefined {
  const fallback = parseTitle(nodeText(item.title));
  const title = nodeText(item["letterboxd:filmTitle"]).trim() || fallback?.title;
  const year = nodeText(item["letterboxd:filmYear"]).trim() || fallback?.year;

  if (!title || !year) {
    return undefined;
  }

  const watchedAt = nodeText(item["letterboxd:watchedDate"]) || nodeText(item.pubDate);
  const rawHtml = nodeText(item["content:encoded"]) || nodeText(item.description);

  return {
    key: movieKey(title, year),
    title,
    year,
    rating: parseRating(nodeText(item["letterboxd:memberRating"]) || nodeText(item.title)),
    date: formatDisplayDate(watchedAt),
    note: htmlToText(rawHtml),
    sourceUrl: normalizeExternalUrl(nodeText(item.link) || nodeText(item.guid)),
  };
}

function parseTitle(value: string) {
  const match = value.match(/^(.*?),\s*(\d{4})\b/);

  if (!match) {
    return undefined;
  }

  return {
    title: match[1].trim(),
    year: match[2],
  };
}

function parseRating(value: string) {
  const numeric = Number(value);

  if (Number.isFinite(numeric) && numeric >= 0) {
    return numeric;
  }

  const stars = value.match(/[★½]+/u)?.[0];

  if (!stars) {
    return undefined;
  }

  return [...stars].reduce((total, char) => total + (char === "½" ? 0.5 : 1), 0);
}

function formatDisplayDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const year = String(date.getUTCFullYear()).slice(-2);

  return `${month} · ${day} · ${year}`;
}

function htmlToText(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/\s+/g, " ")
    .trim();
}

function nodeText(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (value && typeof value === "object" && "#text" in value) {
    return nodeText((value as { "#text": unknown })["#text"]);
  }

  return "";
}

function normalizeExternalUrl(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString().replace(/\/$/, "") : undefined;
  } catch {
    return undefined;
  }
}

function movieKey(title: string, year: string) {
  return `${slugify(title)}-${year}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
