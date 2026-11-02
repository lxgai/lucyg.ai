# Design System — lucyg.ai

The site is a quiet, text-first, three-column "digital garden" in the spirit of the Markdown site-generator Quartz. There are no cards, shadows, divider lines or decorative icons. Muted text is the body color at reduced opacity, never a separate gray. Each page gets at most one playful element (the handwritten greeting, the asterisk divider, the album player, stickers on travel entries).

The source prototypes live in the Claude Design project "Lucy Gai's site redesign". The previous Memory Archive system is kept for reference in `docs/design-memory-archive.md`; don't apply it to new work.

---

## Tokens

Defined as CSS custom properties in `src/styles/globals.css`: light values on `:root`, dark values under `html[data-theme="dark"]`.

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--light` | `#f8fbf8` (mint white) | `#181316` (plum black) | page background |
| `--lightgray` | `color-mix(in oklch, #f8fbf8 90%, #8a8580)` | `#2b2327` | inline-code background, image placeholders, table rules |
| `--gray` | `#b5b0b2` | `#6e6468` | idle TOC links |
| `--darkgray` | `#9b2c5c` (magenta) | `#e38db2` | body text, links, greeting, sign-off |
| `--dark` | `color-mix(in oklch, #9b2c5c 72%, black)` ≈ `#6e1d42` | `#f4c9da` | headings, site title, sidebar item titles |
| `--underline` | `#2f8f6b` (jade) | `#4fbf93` | link underlines, tags, asterisks, stars, footer arrows |
| `--highlight` | `color-mix(in srgb, #9b2c5c 10%, transparent)` | `rgba(227,141,178,.12)` | reserved |
| `--textHighlight` | `color-mix(in srgb, #2f8f6b 25%, transparent)` | `rgba(79,191,147,.3)` | `::selection` |

**Muted text** (dates, "See all", footer, labels): `color: var(--darkgray); opacity: .6`.

### Theme

- `data-theme` on `<html>` is set before paint by the inline script in `src/app/layout.tsx`: the saved `localStorage.theme`, otherwise `prefers-color-scheme`.
- `ThemeToggle` flips the attribute and saves the choice. It shows Phosphor `Moon` in light mode and `Sun` in dark mode (both rendered, switched with CSS).

### Fonts

Loaded with `next/font/google` in `src/app/layout.tsx` and exposed as CSS variables.

| Role | Family | Variable |
|---|---|---|
| Headings, site title, sidebar item titles, article and list titles | DM Serif Display 400 | `--font-heading` |
| Body, UI, tags, project/favorites row titles | Bricolage Grotesque (variable, opsz) | `--font-body` |
| Handwritten: greeting, dates, captions, sign-off, sidebar meta. Outside the sidebar it is thickened with `-webkit-text-stroke: var(--font-hand-stroke) currentColor` (the font has one weight) | Nothing You Could Do | `--font-hand` |
| Mono: "Currently" labels, clock, track numbers and durations, inline code | JetBrains Mono 400/500 | `--font-code` |

---

## Shared styles

- **Inline body link** (`linkClass`): underline in `var(--underline)`, thickness 1.5px, offset 2px, weight 600.
- **Tag / chip** (`Tag`, `TagRow`): `padding: .15rem .4rem`, Bricolage 600 12px (13px on the Travel Log and Blog lists), `color: var(--underline)` on a 12% tint of it, no radius, no wrap. Blog tags are prefixed with `#`. Rows use `gap: .4rem`.
- **Asterisk divider** (`Asterisks`): centered `* * *` in `var(--underline)`, 1.1em, line-height 1, `aria-hidden`. Used above the footer on every page, between Favorites sections, and inside articles wherever the source had `✧ ✦ ✧`.
- **Page title** (`pageTitleClass`): DM Serif 2.25rem / 1.15, `var(--dark)`.

These live in `src/components/site/ui.tsx` and `ui.module.css`.

---

## Global layout

Every redesigned page renders inside `SiteShell` (`src/components/site/SiteShell.tsx`), a server component.

```
max-width 1440, centered; padding 80px clamp(24px, 6vw, 96px) 0
flex, wrap, justify-content center, gap 56px, align-items flex-start

[sidebar 260px, sticky top 80]  [main flex 1 1 480px, max 720]  [TOC 200px, sticky]
[footer: full-width row reusing the same column widths]
```

- Base text: Bricolage 18px / 1.65.
- **Main** has `min-height: calc(100svh - 80px - 56px - 88px)` so the footer sits near the bottom of short pages. After the content come a 64px spacer, the asterisks and a `flex: 1 0 56px` spacer.
- **TOC column** only renders at ≥1240px. Below 1240px the TOC moves into the sidebar under the title row. Every page has one.
- **Below ~904px** the sidebar wraps above main, matches main's width and stops being sticky. It keeps only the title row and TOC; Recent Travels and Selected Writing move under the asterisks at the end of main, and the footer moves its socials 20px above the meta row, wrapping onto as many rows as the width needs.

### Sidebar

1. Title row: "Lucy Gai" (DM Serif 28px, `var(--dark)`, links to `/`) and the theme toggle.
2. TOC, below 1240px.
3. **Recent Travels**: the two most recent trips. Title DM Serif 18px `var(--dark)`, date handwritten 14px muted, then "See all travels →".
4. **Selected Writing**: the two most recent Substack posts, same pattern, then "See all writing →".

"See all" links: Bricolage 14px, muted, 1px underline at offset 2px, hover `opacity: .85`.

### Table of contents

- Header button: "Table of Contents" in DM Serif 16px with a chevron. Open by default; collapsing rotates the chevron −90°.
- Links: 15px / 1.35, `var(--gray)`, weight 600, hover `var(--darkgray)`. Nested lists indent 14px.
- Home and the index pages (Projects, Travels, Blog): the TOC is the site nav (Projects, Travels, Favorites, Blog).
- Individual pages (Favorites, trips, projects, posts): the same site nav, with the page's contents indented under its section's link. Articles nest the page title with its headings under it; Favorites nests Albums and Films. The current section's nav link is `--darkgray` (the hover color) on its own page and every page under it. In-page, the heading in view (the last one past 120px from the top) and the entries containing it (the page title, an h3's h2) are `--darkgray` too.
- Motion: the list and each link's nested contents are a grid-rows accordion (240ms). On navigation the old page's contents slide closed under their link while the new page's slide open under theirs; a link whose contents don't change stays still. None with reduced motion.
- Articles: the page title (`#top`) with h2s under it and h3s one level deeper.

### Footer

A full-width flex row: "Lucy Gai", "© year" and a live `HH:MM:SS` clock (JetBrains Mono 13px) on the left. On the right are Instagram, Letterboxd, Spotify, GitHub and Mail, each a 16px Phosphor regular-weight logo (a matching hand-drawn Letterboxd mark, since Phosphor has none) before a Bricolage 600 label, centered with the icon nudged up 1px. Bricolage 14px, muted. Other external links end in a bold Phosphor `ArrowSquareOut` in `var(--underline)`. The right block widens to 976px when the TOC column shows.

---

## Pages

### Home `/`
Banner image (`/images/home/home_image.png`, dithered, rendered unoptimized and pixel-sharp), handwritten greeting, three intro paragraphs with inline links, "Some places you may want to visit", a **Currently** grid (JetBrains Mono labels), and the handwritten sign-off. `/about` redirects here (301 in `next.config.ts`).

### List rows (Travel Log, Blog)
`grid-template-columns: 96px minmax(0,1fr) max-content; column-gap: 12px`. Date handwritten 14px muted; title DM Serif 1.12rem `var(--dark)`; tags right-aligned at the main column's right edge. Styles in `src/components/site/list.module.css`.

- **Travel Log `/travels`**: title is the country; tags are the first city plus a `+N` chip. Hovering the tags (or tapping `+N`, which toggles) slides all the cities open leftward over the row (260ms clip reveal and fade, none with reduced motion), right-aligned and on top of the title if they need the room (`ExpandableTags`).
- **Blog `/blog`**: "Also on Substack." under the title, then rows with stacked `#tag` chips.

### Projects `/projects`
Rows of `280px minmax(0,1fr)` with a 280×190 cover thumbnail, then name (14px/600 `var(--dark)`), "kind. stack" (12px) and date (12px muted). Below 560px the thumbnail stacks above the text.

### Favorites `/favorites`
**Albums** and **Films** accordions separated by the asterisk divider.

- Each row is a full-width `<button aria-expanded>` with the title (Bricolage 14px/600) and chips on the right. Hover `opacity: .55`. One open row per section; nothing is open by default.
- The panel stays mounted and animates `grid-template-rows: 0fr → 1fr` with opacity.
- Album panel: 180×180 cover, a play button for the featured track (plays the local clip in `public/audio/favorites/`, or links to Spotify search when there's no clip), the full tracklist with `★` favorites, and a legend. Albums without a tracklist show "Listen on Spotify".
- Film panel: 120×180 poster, the Letterboxd review text (or the local note), and "Read review".
- Data: `src/data/favorites.ts` and `src/data/favorite-albums.json`. Album order follows `customorder`.

### Articles (blog post, project)
`Article` (`src/components/site/Article.tsx`) plus `article.module.css`:

- `<h1 id="top">` DM Serif 2.25rem, handwritten meta line (e.g. "Jun 30, 2026, 4 min read"), tag row, optional italic lede.
- Body 16px / 1.7. h2 DM Serif 1.6rem (`margin: 44px 0 16px`, zero top margin right after a divider), h3 1.2rem.
- Figures full width with a handwritten caption. Inline code in JetBrains Mono on `var(--lightgray)` with a 5px radius. Tables full width at 14px with `var(--lightgray)` row rules and DM Serif headers.
- **Blog posts** render the sanitized Substack HTML. `src/lib/articleHtml.ts` adds heading ids for the TOC and turns `✧ ✦ ✧` paragraphs into the divider. The post ends with "Also on Substack, where comments live."
- **Projects** render `src/content/projects/<slug>.md`. The `# Overview` section becomes the lede.

### Travel entries `/travels/<slug>`
Single-column articles (`src/components/travel/TravelArticle.tsx`), modelled on the China '25 design:

- Article header with the trip dates ("Oct 15, 2025 - Oct 29, 2025") and one tag per city.
- **Sections**: h2 (1.6rem, `margin: 44px 0 16px`) or h3 (1.2rem), with an optional alt. title (the city's native name) in a `<span>` at 60% opacity and an optional handwritten subtitle ("days 1 - 4") tight underneath.
- **Images**: full column width, transparent by default (cutouts sit on the page), optional handwritten caption aligned left, center or right. An image can take any of the six background treatments below, with 8px padding, so it frames the image and shows through transparent areas.
- **Text**: 16px / 1.7 paragraphs.
- **Canvases**: column-width boxes with free placement of photos, stickers and text boxes in any of the four fonts (left, center or right aligned), rotated as needed. Canvas images can take a handwritten caption (left, center or right aligned) and a background treatment too, scaled with the canvas. Content is clipped, so stickers sit over photo corners rather than hanging outside. The whole canvas scales with the column. Backgrounds are the six cutout treatments: none, solid panel (`--lightgray`), 4px `--lightgray` border, jade tint (`--underline` 10%), jade dot grid (14px) and magenta tint (`--darkgray` 7%).
- TOC: the site nav, with the page title under Travels, then h2 sections, with h3s nested under their h2.

---

## Responsive

- `1240px`: TOC column shows or hides.
- `~904px`: sidebar wraps above main and its two lists move under the asterisks; footer socials move above the meta row and wrap.
- `560px`: project thumbnails and album covers stack above their text.
- List rows stay on one line at every width.

## Accessibility

- Accordion rows are `<button aria-expanded>`, and closed panels are `inert`.
- Decorative asterisks, footer arrows and icons are `aria-hidden`.
- Text keeps ≥4.5:1 contrast in both themes, except the intentionally muted 60% metadata.

## Voice

Warm, first-person and lowercase-friendly in personal moments (greeting, sign-off), plain everywhere else. No catalog labels, REF numbers or section tabs.
