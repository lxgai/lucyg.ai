import type { TocItem } from "./Toc";

// The TOC on Home and the index pages (Projects, Travels, Blog) is the site
// navigation.
export const SITE_NAV: TocItem[] = [
  { href: "/projects", label: "Projects" },
  { href: "/travels", label: "Travels" },
  { href: "/favorites", label: "Favorites" },
  { href: "/blog", label: "Blog" },
];

// Individual pages: the site nav, with the page's contents nested under the
// link for its section.
export function siteNavWith(href: string, children: TocItem[]): TocItem[] {
  return SITE_NAV.map((item) => (item.href === href ? { ...item, children } : item));
}
