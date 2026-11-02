import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";
import sanitizeHtml from "sanitize-html";
import { BLOG_TAGS_BY_SLUG } from "@/data/blog-tags";
import { POSTS } from "@/data/blog";
import type { BlogEntry } from "@/types/blog";

const SAMPLE_FEED_PATH = path.join(process.cwd(), "src/data/substack/sample-feed.xml");
const REVALIDATE_SECONDS = 60 * 60;

type RssItem = {
  title?: unknown;
  link?: unknown;
  guid?: unknown;
  pubDate?: unknown;
  category?: unknown;
  description?: unknown;
  "content:encoded"?: unknown;
};

type RssDocument = {
  rss?: {
    channel?: {
      item?: RssItem | RssItem[];
      link?: unknown;
    };
  };
};

const parser = new XMLParser({
  ignoreAttributes: false,
  trimValues: false,
});

export async function getBlogEntries(): Promise<BlogEntry[]> {
  const feedXml = await getFeedXml();

  if (!feedXml) {
    return getLocalEntries();
  }

  try {
    const entries = parseSubstackFeed(feedXml);
    if (entries.length === 0) return getLocalEntries();

    const postTags = await getPostTags();
    return entries.map((entry) => ({
      ...entry,
      tags: mergeTags(entry.tags, postTags.get(entry.slug) ?? []),
    }));
  } catch (error) {
    console.error("Unable to parse Substack RSS feed.", error);
    return getLocalEntries();
  }
}

export function getSubstackLinks() {
  const embedUrl = normalizeExternalUrl(process.env.SUBSTACK_EMBED_URL);
  const publicationUrl = getPublicationUrl();

  return {
    embedUrl,
    publicationUrl,
    subscribeUrl: publicationUrl ? `${publicationUrl}/subscribe` : undefined,
  };
}

async function getFeedXml() {
  if (process.env.SUBSTACK_USE_SAMPLE_FEED === "1") {
    return readFile(SAMPLE_FEED_PATH, "utf8");
  }

  const feedUrl = normalizeExternalUrl(process.env.SUBSTACK_FEED_URL);

  if (!feedUrl) {
    return undefined;
  }

  try {
    const response = await fetch(feedUrl, { next: { revalidate: REVALIDATE_SECONDS } });

    if (!response.ok) {
      throw new Error(`Substack feed returned ${response.status}`);
    }

    return response.text();
  } catch (error) {
    console.error("Unable to fetch Substack RSS feed.", error);
    return undefined;
  }
}

const ARCHIVE_PAGE_SIZE = 50;

type ArchivePost = {
  slug?: unknown;
  postTags?: { name?: unknown }[];
};

// The RSS feed omits post tags, so read them from the public archive API.
async function getPostTags() {
  const tagsBySlug = new Map<string, string[]>();
  const publicationUrl = getPublicationUrl();

  if (!publicationUrl || process.env.SUBSTACK_USE_SAMPLE_FEED === "1") {
    return tagsBySlug;
  }

  try {
    for (let offset = 0; ; offset += ARCHIVE_PAGE_SIZE) {
      const response = await fetch(
        `${publicationUrl}/api/v1/archive?sort=new&limit=${ARCHIVE_PAGE_SIZE}&offset=${offset}`,
        { next: { revalidate: REVALIDATE_SECONDS } },
      );

      if (!response.ok) {
        throw new Error(`Substack archive returned ${response.status}`);
      }

      const posts = (await response.json()) as ArchivePost[];

      for (const post of posts) {
        if (typeof post.slug !== "string") continue;
        const names = (post.postTags ?? [])
          .map((tag) => (typeof tag.name === "string" ? tag.name : ""))
          .filter(Boolean);
        tagsBySlug.set(slugify(post.slug), names);
      }

      if (posts.length < ARCHIVE_PAGE_SIZE) break;
    }
  } catch (error) {
    console.error("Unable to fetch Substack post tags.", error);
  }

  return tagsBySlug;
}

function parseSubstackFeed(feedXml: string): BlogEntry[] {
  const parsed = parser.parse(feedXml) as RssDocument;
  const rawItems = parsed.rss?.channel?.item;
  const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];

  return items
    .map((item) => toBlogEntry(item))
    .filter((entry): entry is BlogEntry => Boolean(entry))
    .sort((a, b) => {
      const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0;
      const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0;
      return bTime - aTime;
    });
}

function toBlogEntry(item: RssItem): BlogEntry | undefined {
  const title = nodeText(item.title).trim();
  const sourceUrl = normalizeExternalUrl(nodeText(item.link) || nodeText(item.guid));

  if (!title || !sourceUrl) {
    return undefined;
  }

  const rawHtml = nodeText(item["content:encoded"]) || nodeText(item.description);
  const html = sanitizeArticleHtml(rawHtml);
  const text = htmlToText(html);
  const excerpt = truncate(htmlToText(sanitizeArticleHtml(nodeText(item.description))) || text, 190);
  const publishedAt = nodeText(item.pubDate);
  const slug = slugFromUrl(sourceUrl) ?? slugify(title);

  return {
    slug,
    date: formatDisplayDate(publishedAt),
    title,
    tags: mergeTags(categories(item.category), BLOG_TAGS_BY_SLUG[slug] ?? []),
    excerpt,
    source: "substack",
    sourceUrl,
    publishedAt,
    wordCount: countWords(text),
    html,
    text,
  };
}

const GALLERY_EMBED = /<div class="image-gallery-embed" data-attrs="([^"]*)"[^>]*>\s*<\/div>/g;
const GALLERY_IMAGE_WIDTH = 848;

type GalleryAttrs = {
  gallery?: {
    images?: { src?: unknown }[];
    caption?: unknown;
    alt?: unknown;
  };
};

function decodeEntities(value: string) {
  return value
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Substack image grids arrive as an empty div whose data-attrs JSON holds the
// images; expand them into a figure before sanitizing strips the div.
function expandImageGalleries(html: string) {
  return html.replace(GALLERY_EMBED, (match, attrs: string) => {
    let gallery: GalleryAttrs["gallery"];
    try {
      gallery = (JSON.parse(decodeEntities(attrs)) as GalleryAttrs).gallery;
    } catch {
      return match;
    }

    const sources = (gallery?.images ?? [])
      .map((image) => (typeof image.src === "string" ? normalizeExternalUrl(image.src) : undefined))
      .filter((src): src is string => Boolean(src));
    if (sources.length === 0) return match;

    const alt = typeof gallery?.alt === "string" ? escapeHtml(gallery.alt) : "";
    const caption = typeof gallery?.caption === "string" ? gallery.caption.trim() : "";
    const images = sources
      .map(
        (src) =>
          `<img src="https://substackcdn.com/image/fetch/w_${GALLERY_IMAGE_WIDTH},c_limit,f_auto,q_auto:good,fl_progressive:steep/${encodeURIComponent(src)}" alt="${alt}">`,
      )
      .join("");
    const columns = Math.min(sources.length, 3);

    return `<figure class="image-gallery image-gallery-${columns}">${images}${
      caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ""
    }</figure>`;
  });
}

function sanitizeArticleHtml(html: string) {
  return sanitizeHtml(expandImageGalleries(html), {
    allowedTags: [
      "a",
      "b",
      "blockquote",
      "br",
      "code",
      "em",
      "figcaption",
      "figure",
      "h1",
      "h2",
      "h3",
      "h4",
      "hr",
      "i",
      "img",
      "li",
      "ol",
      "p",
      "pre",
      "span",
      "strong",
      "ul",
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      figure: ["class"],
      img: ["src", "alt", "title", "width", "height", "loading"],
    },
    allowedClasses: {
      figure: ["image-gallery", "image-gallery-1", "image-gallery-2", "image-gallery-3"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      img: ["http", "https"],
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        target: "_blank",
        rel: "noopener noreferrer",
      }),
      img: sanitizeHtml.simpleTransform("img", {
        loading: "lazy",
      }),
    },
  });
}

function getLocalEntries(): BlogEntry[] {
  return POSTS.map((post) => ({
    ...post,
    source: "local" as const,
    text: post.body
      .filter((block): block is Extract<(typeof post.body)[number], { text: string }> => "text" in block)
      .map((block) => block.text)
      .join(" "),
  }));
}

function getPublicationUrl() {
  const explicitUrl = normalizeExternalUrl(process.env.SUBSTACK_PUBLICATION_URL);

  if (explicitUrl) {
    return explicitUrl.replace(/\/$/, "");
  }

  const feedUrl = normalizeExternalUrl(process.env.SUBSTACK_FEED_URL);

  if (feedUrl) {
    return feedUrl.replace(/\/feed\/?$/, "");
  }

  if (process.env.SUBSTACK_USE_SAMPLE_FEED === "1") {
    return "https://example.substack.com";
  }

  return undefined;
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

function categories(value: unknown) {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  const tags = values.map((category) => nodeText(category).trim().toLowerCase()).filter(Boolean);
  return Array.from(new Set(tags));
}

function mergeTags(...tagLists: string[][]) {
  const tags = tagLists
    .flat()
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  return Array.from(new Set(tags));
}

function slugFromUrl(url: string) {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean);
    const postIndex = parts.indexOf("p");
    const slug = postIndex >= 0 ? parts[postIndex + 1] : parts.at(-1);
    return slug ? slugify(decodeURIComponent(slug)) : undefined;
  } catch {
    return undefined;
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Substack pubDate is UTC; render it in local time
const DISPLAY_TIME_ZONE = "America/Phoenix";

const displayDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: DISPLAY_TIME_ZONE,
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
});

function formatDisplayDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "undated";
  }

  const parts = displayDateFormatter.formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  return `${part("month")}/${part("day")}/${part("year")}`;
}

function htmlToText(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).replace(/\s+\S*$/, "")}...`;
}

function countWords(value: string) {
  return value.split(/\s+/).filter(Boolean).length;
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
