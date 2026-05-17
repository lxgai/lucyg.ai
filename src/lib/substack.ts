import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";
import sanitizeHtml from "sanitize-html";
import { BLOG_TAGS_BY_SLUG } from "@/data/blog-tags";
import { POSTS } from "@/data/content";
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
    return entries.length > 0 ? entries : getLocalEntries();
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

function sanitizeArticleHtml(html: string) {
  return sanitizeHtml(html, {
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
      img: ["src", "alt", "title", "width", "height", "loading"],
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

function formatDisplayDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "undated";
  }

  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const year = String(date.getUTCFullYear()).slice(-2);

  return `${month}/${day}/${year}`;
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
