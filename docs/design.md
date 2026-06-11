# Design System — Personal Site

## Aesthetic Direction: Memory Archive

The site reads like a personal **library card catalog** — an archival room where each section is a cataloged collection. Quiet, structured, scrapbook-adjacent but never cluttered.

**References:** stationery shops, archival exhibits, library taxonomy, faded film photography.

---

# Palette

* **Paper** `#f1e9df` — primary background
* **Paper deep** `#e6dccb` — secondary surface
* **Paper card** `#fbf6ee` — cards & lifted surfaces
* **Ink** `#1f1a16` — primary text
* **Ink 60%** `#5a4e43` — secondary text / labels
* **Ink 40%** `#8a7e70` — tertiary / metadata
* **Hairline** `rgba(31, 26, 22, 0.2)` — dividers
* **Strong hairline** `rgba(31, 26, 22, 0.55)` — section breaks
* **Accent — Rose** `rgb(163, 91, 115)` — used sparingly for active states, taxonomy labels, “now playing”, call-to-action

> Alternate accents available as tweaks: forest, navy, rust. Default is rose.

---

# Typography

* **Display serif: Newsreader**

  * Used for headlines, page titles, place names, post titles, and all “human” content
  * Italic variant used for editorial emphasis
  * The italicized word at the end of a title is a recurring move
  * Tight letter-spacing on display sizes (`−2` to `−3`)

* **Mono: JetBrains Mono**

  * Used for everything systemic:

    * section labels
    * metadata
    * dates
    * catalog numbers
    * taxonomy
  * Always small (`8–11px`)
  * Letter-spaced (`1.4–2`)
  * Often uppercase

* **Only these two typefaces**

  * No other fonts are part of the system

---

# Layout System

* Wide horizontal containers

  * `56px` side padding on desktop
  * `20px` on mobile

* Generous whitespace

* **Section header strip**

  * Mono-caps metadata row at the top of every section page (no top/bottom rules)
  * Section name sits in a filled accent "tab" (accent background, paper-card text); the rest is plain mono
  * Desktop fields:

    * section name (accent tab)
    * REF label
    * short dotted leader
    * last updated, with tight dots (`UPDATED 04·22·26`)
  * Small screens show only the section tab; the REF label, dotted leader, and updated date are hidden
  * Section tab separators on detail pages follow the pattern `SECTION {letter} · {SERIES} / {ENTRY}`: a middot `·` separates the series prefix and a forward slash `/` precedes the specific entry name (e.g. `SECTION B · TRAVELS / CHINA`, `SECTION A · PROJECTS / {slug}`). Do not use middots all the way through.
  * REF labels:

    * home: `REF. 00`
    * listing/index pages: `REF. {letter}-IDX` (`A=Projects`, `B=Travels`, `C=Favorites`, `D=Blog`, `E=About`)
    * detail pages: `REF. {letter}-{nn}` from archive position

* **Page title**

  * Big serif title (`84px`)
  * One italicized word
  * Optional mono subtitle below

* **Sticky nav**

  * Hairline-bordered
  * Brand left
  * Links right
  * Active link underlined in accent color

---

# Recurring Components

* **Card label**

  * `CAT. X · № 001 · MM · DD · YY`
  * Appears on:

    * archival cards
    * photo mounts
    * contact card
    * contact-index tab

* **Hairline dividers**

  * `1px` hair color
  * Sometimes dashed

* **Photo mounts**

  * Photos sit inside paper-card frames
  * Uses filter:

    ```css
    sepia(0.1-0.15) saturate(0.9)
    ```
  * Caption + catalog label below

* **Tag chips**

  * Mono uppercase
  * Accent border
  * Accent text on transparent background

---

# Section-Specific Treatments

* **Home**

  * Big serif `"Hi, I'm Lucy."` hero
  * `ENTRY 001` mono label
  * `"Lately"` quick-link list with ↗ arrows

* **Projects**

  * Spread-entry archive list:

    * generated thumbnail
    * `Entry nn · year`
    * plain serif project title
    * tech stack under the title
    * kind sentence
  * `● shipping/live` displayed in accent color

  * status plus `open file →`
  * Index title is `Things I've made.` with no italicized word
  * Sort control toggles `newest` / `oldest`; entry numbers stay fixed chronologically, with the oldest project as `Entry 01`
  * Small screens show entry text/info first, then image

* **Project detail pages**

  * Header order is back link, hero image, italic serif title, specs strip
  * Back links use real arrow glyphs, for example `← Projects`; never visible ASCII `<-`
  * Do not render a kicker/status row above the title
  * Do not render the project tagline between the title and specs strip
  * Specs strip is minimal: no top/bottom rules, left-aligned, fluid width `min(100%, max(50%, 620px))`
  * Specs labels stack above mono values at all widths
  * Labels are `First published`, `Updated`, `Stack`, and `Status`
  * Dates use tight dots, for example `Feb·03·2026`
  * Desktop specs use small circular dot separators; phone specs reflow into a 2x2 grid with separators hidden
  * Status value includes the accent live/shipping circle
  * "By the numbers" remains horizontal at all widths, with fluid number sizing
  * Detail links are unboxed accent text; no divider sits between links and prev/next nav

* **Travels**

  * Postcard carousel
  * Dynamic 3 / 2 / 1 columns based on measured title width and available container width
  * Sort control toggles `newest first` / `oldest first`
  * Trip titles stay on one line
  * Slight rotation
  * Hover flattens + lifts
  * Photo with sepia filter

* **Favorites — albums**

  * Spinning vinyl with centered album-art label
  * Tonearm lifts on pause
  * Tracklist card below
  * Active track shown in accent color with `♪` marker
  * Record-rack thumbnail grid on the right

* **Favorites — movies**

  * 3 layouts
  * `"cards"` is default
  * Paper card + `84×126` poster
  * Includes:

    * title
    * director
    * rating
    * quote
    * date logged

* **Blog**

  * Filterable tag pills
  * 3-column rows:

    * `№ / date`
    * `title + excerpt`
    * `tags`
  * Blog detail utility row pairs `← Blog` on the left with `Also on Substack ↗` on the right when a source URL exists
  * `Also on Substack ↗` is uppercase mono, underlined, and uses the rose accent

* **Travel detail pages**

  * Public metadata strip remains normal site chrome, matching the scale of other section pages
  * Back link sits directly below the metadata strip and above the scaled detail surface
  * Detail content below the strip is a fixed design canvas per breakpoint:

    * `large` `1440px`
    * `medium` `1120px`
    * `small` `470px`
  * Public detail canvas is centered and scaled to fit the available page width; current scale multiplier is `0.94`
  * Hero, section headers, section canvases, and closing content share the same scaled content block
  * Hero image frame, copy block, tape pieces, and canvas height are editable per breakpoint
  * Editor preview renders the selected breakpoint at exact scale `1`
  * Section canvas widths are part of the horizontal coordinate system and should not be edited in the UI
  * Section canvas heights remain editable per breakpoint to manage vertical space
  * Photo mounts, tape pieces, handwritten-style annotations, and slight rotational offsets provide the scrapbook texture inside the archive layout

* **About**

  * Big serif intro split into a 48px headline and smaller paragraph body; mobile uses about 28px headline and 19px body
  * `"Currently"` metadata grid
  * Contact Index card on the right, sized to hug the image column and centered within that column
  * Contact card label reads `REF. E-001 LIKENESS.PNG` in uppercase mono black
  * Contact links are minimal logo/icon rows with uppercase mono network names, no handles or boxed tiles
  * Mobile order is intro, contact card, then Currently
  * Tab label hangs off the top-left border

---

# Voice & Copy

* Quiet and considered, not chatty
* `"Cataloged"` not `"shown"`
* `"Filed"` not `"sorted"`
* `"Entry"` not `"post"`
* Mono labels lean taxonomic:

  * `"SERIES B · TRAVELS"`
  * `"REF. B-IDX"`
* Italics used for places and titles, never for emphasis

---

# Animations

* `320ms` page fade-in with `6px` translate
* `4s` linear spin on vinyl
* `700ms` cubic tonearm lift
* `180–260ms` hover transitions

  * Cards flatten + lift on hover

---

# Mobile (≤768px)

* All multi-column grids collapse to single column
* Hero/title scales down:

  * `128 → 68`
  * `84 → 46`
  * `48 → 28`
* Section strip wraps to 2 rows
* `56px` side padding → `20px`
* Vinyl scales to ~`78%`
* Tweaks panel becomes full-width along the bottom
