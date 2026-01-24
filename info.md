## Development Commands

### Essential Commands
- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build the production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with Next.js configuration

### Dependency Management
- `npm install` - Install all dependencies from package.json

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15.5.x with App Router
- **UI Libraries**: Material UI (MUI) v7, Joy UI (installed)
- **Styling**: MUI `sx` props + Tailwind CSS v4 (available globally)
- **Language**: TypeScript (strict mode)
- **Maps**: Leaflet + react-leaflet
- **Fonts**: VT323 (Google) + Cooper Light (local in `public/fonts`)

### Project Structure
```
src/
  app/
    layout.tsx        # Root layout, fonts, global styles
    page.tsx          # Home (scrapbook canvas)
    about/page.tsx
    blog/page.tsx
    contact/page.tsx
    favorites/page.tsx
    links/page.tsx
    portfolio/page.tsx
    projects/page.tsx
    travels/page.tsx
    travels/china-24/page.tsx
  components/
    Header.tsx        # Nav + mobile drawer
    PhotoGallery.tsx  # Polaroid grid + location filters
    TravelMap.tsx     # Leaflet map + markers
  styles/
    globals.css       # Tailwind import + base body styles
  types/
    photo.ts
public/
  fonts/Cooper/
  images/
```

### Key Patterns
- **Scrapbook canvas**: Home page (`src/app/page.tsx`) uses fixed canvas sizes with CSS scale variables to keep absolute positioning stable across breakpoints. Mobile and desktop canvases have separate sizes (`MOBILE_CANVAS_*` and `CANVAS_*`).
- **Absolute positioning**: Decorations and hero text are placed with absolute `%` positions; update those values to move elements.
- **Responsive scaling**: Canvas scale is `min(100vw / canvasWidth, 1)` per breakpoint; vertical overflow scrolls.
- **Header behavior**: Mobile hamburger uses a `Portal` so it stays fixed to the viewport; Drawer paper is forced flush left.
- **Maps**: `TravelMap.tsx` includes Leaflet marker asset overrides and a size fix hook.

### Styling Notes
- Global styles live in `src/styles/globals.css`.
- `body` margin is reset to `0` and uses `100svh` on key containers for stable mobile sizing.
- Fonts are applied via CSS variables: `--font-vt323` and `--font-cooper-light`.

### Current State / Gaps
- No test framework configured yet.
- ESLint uses Next.js recommended rules.
