import type { TocItem } from "@/components/site/Toc";
import { slugify } from "@/lib/slug";

const DIVIDER_HTML = '<div class="article-divider" aria-hidden="true">* * *</div>';

// Paragraphs whose only text is a ✧ ✦ ✧ style separator (any mix of those
// glyphs, spaces and inline tags) become the site's asterisk divider.
const DIVIDER_PARAGRAPH = /<p>(?:\s|&nbsp;|<\/?(?:span|strong|em|b|i)>|[✧✦])*[✧✦](?:\s|&nbsp;|<\/?(?:span|strong|em|b|i)>|[✧✦])*<\/p>/g;

const HEADING = /<h([23])>([\s\S]*?)<\/h\1>/g;

function stripTags(html: string) {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .trim();
}

// Prepares sanitized article HTML for rendering: swaps separators for the
// asterisk divider and gives h2/h3 headings ids, returning the TOC entries
// (h3s nested under the preceding h2).
export function prepareArticleHtml(html: string): { html: string; headings: TocItem[] } {
  const headings: TocItem[] = [];
  const used = new Map<string, number>();

  const withDividers = html.replace(DIVIDER_PARAGRAPH, DIVIDER_HTML);

  const withIds = withDividers.replace(HEADING, (match, level: string, inner: string) => {
    const label = stripTags(inner);
    const base = slugify(label);
    if (!base) return match;

    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count + 1}`;

    const item: TocItem = { href: `#${id}`, label };
    const parent = headings.at(-1);
    if (level === "3" && parent) {
      parent.children = [...(parent.children ?? []), item];
    } else {
      headings.push(item);
    }

    return `<h${level} id="${id}">${inner}</h${level}>`;
  });

  return { html: withIds, headings };
}
