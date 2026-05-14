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
* **Accent — Rust** `oklch(0.52 0.13 40)` — used sparingly for active states, taxonomy labels, “now playing”, call-to-action

> Alternate accents available as tweaks: forest, navy, plum. Default is rust.

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

* **No pixel font, no Cooper Light**

  * The original VT323 / Cooper combo is retired

---

# Layout System

* Wide horizontal containers

  * `56px` side padding on desktop
  * `20px` on mobile

* Generous whitespace

* **Section header strip**

  * Horizontal hairline-bordered band at the top of every section page
  * Contains 3 columns of mono metadata:

    * section name
    * file id
    * last updated

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

* **Stamps**

  * Dashed-border rectangular postage stamps for trips
  * Country code in italic serif
  * `"POSTED"` + date in mono

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

* **Blog**

  * Filterable tag pills
  * 3-column rows:

    * `№ / date`
    * `title + excerpt`
    * `tags`

* **Projects**

  * Spreadsheet-style table:

    * year
    * title / role
    * kind
    * stack
    * status
  * `● shipping/live` displayed in accent color

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

* **Travels**

  * Postcard grid
  * 3 cards
  * Slight rotation
  * Hover flattens + lifts
  * Photo with sepia filter + corner stamp

* **Travel detail pages**

  * Public metadata strip remains normal site chrome, matching the scale of other section pages
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

  * Big serif intro
  * `"Currently"` metadata grid
  * Contact Index card on the right
  * Tab label hangs off the top-left border

---

# Voice & Copy

* Quiet and considered, not chatty
* `"Cataloged"` not `"shown"`
* `"Filed"` not `"sorted"`
* `"Entry"` not `"post"`
* Mono labels lean taxonomic:

  * `"SERIES C · TRAVELS"`
  * `"FILE: HOME.IDX"`
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
* Stamp moves below trip title
* Tweaks panel becomes full-width along the bottom
