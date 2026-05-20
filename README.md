# lucyg.ai

Personal site and archive for Lucy Gai: a portfolio, travel log, writing index, favorites shelf, and link directory collected in one place.

The site is designed as a quiet personal archive, closer to a library card catalog than a traditional portfolio. It uses archival metadata, editorial typography, and photo-forward layouts to make projects, trips, essays, and references feel cataloged rather than broadcast.

## What You Can Find

- **Home** - a current snapshot of Lucy's work, interests, and recent updates.
- **Projects** - a portfolio archive with selected software, design, and creative work.
- **Blog** - writing imported from Substack when configured, with local fallback entries.
- **Travels** - visual travel pages with collage layouts, maps, and detailed trip archives.
- **Favorites** - albums, films, and other saved references.
- **About** - background, current notes, and contact information.
- **Links** - a small directory of places to find Lucy elsewhere.

## Design

The current visual direction is called **Memory Archive**. It combines the structure of a catalog system with the warmth of personal photographs and collected notes:

- warm paper backgrounds
- serif display type for titles and names
- mono metadata labels for dates, file IDs, and taxonomy
- hairline borders and archival strips
- restrained rust accents
- photo mounts, stamps, and collage details on travel pages

## Technology

This site is built with:

- Next.js 15 App Router
- React 19
- TypeScript
- MUI and Joy UI
- Tailwind CSS for the development-only admin editor
- Static JSON data for local content and layout definitions

Personal home and travel images are not committed to this repository. Public pages load those assets from external storage in Supabase.

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

The project also includes development-only editors for maintaining collage and travel-detail layouts. These admin routes are disabled in production.

## License

Code is licensed under the MIT License.

Unless otherwise noted, photographs, images, writing, personal data, branding, and design assets are copyright Lucy Gai. They are not licensed for reuse, redistribution, or derivative works.
