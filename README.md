# lucyg.ai

Personal site for Lucy Gai: projects, travels, writing and favorites, collected in one place.

The site is a quiet, text-first "digital garden": a sidebar of recent travels and writing, a single reading column, and a table of contents, in light and dark themes.

## What You Can Find

- **Home** - an introduction and what Lucy is currently reading, building and planning.
- **Projects** - things Lucy has built, each with a long-form write-up.
- **Travels** - a travel log with detailed pages for individual trips.
- **Blog** - writing from Lucy's Substack.
- **Favorites** - albums, with a featured track and tracklist, and films, with Letterboxd reviews.

## Design

The visual system is documented in [`docs/design.md`](docs/design.md):

- mint and plum backgrounds with magenta text and jade accents, in light and dark themes
- DM Serif Display for headings, Bricolage Grotesque for body text, a handwritten face for dates and captions, and JetBrains Mono for labels
- no cards, shadows or dividers; one playful element per page at most

Trip detail pages still use the site's previous "Memory Archive" design ([`docs/design-memory-archive.md`](docs/design-memory-archive.md)) until they're redesigned.

## Technology

- Next.js 15 App Router
- React 19
- TypeScript
- CSS modules and CSS custom properties
- Tailwind CSS for the development-only admin editors
- Static data and Markdown for content; Substack, Spotify and Letterboxd for feeds and track data

Home, project and travel images are not committed to this repository. Public pages load them from Supabase storage.

## Local Development

Install dependencies, then run the development server:

```bash
npm install
npm run dev
```

Useful checks:

```bash
npx tsc --noEmit
npm run lint
```

Set `NEXT_PUBLIC_SITE_IMAGE_BASE_URL` and `SUBSTACK_FEED_URL` in `.env.local` to load images and blog posts. See [`docs/customization-manual.md`](docs/customization-manual.md) for how to edit each page's content.

The project also includes development-only editors for travel layouts. These admin routes are disabled in production.

## License

Code is licensed under the MIT License.

Unless otherwise noted, photographs, images, writing, personal data, branding, and design assets are copyright Lucy Gai. They are not licensed for reuse, redistribution, or derivative works.
