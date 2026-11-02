import "server-only";

import Link from "next/link";
import type { ReactNode } from "react";
import { TRAVEL_ENTRIES } from "@/data/travelEntries";
import { cx } from "@/lib/cx";
import { dateSortValue, formatDisplayDate } from "@/lib/dates";
import { getBlogEntries } from "@/lib/substack";
import Clock from "./Clock";
import ThemeToggle from "./ThemeToggle";
import Toc, { type TocItem } from "./Toc";
import { Asterisks } from "./ui";
import styles from "./site.module.css";

const SIDEBAR_ITEM_COUNT = 2;

// Phosphor regular-weight paths (256 grid). Phosphor has no Letterboxd logo,
// so that one is drawn to match: three overlapping circles at the same 16-unit
// stroke the regular weight uses.
const FOOTER_ICONS = {
  instagram: (
    <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z" />
  ),
  letterboxd: (
    <g fill="none" stroke="currentColor" strokeWidth="16">
      <circle cx="76" cy="128" r="44" />
      <circle cx="128" cy="128" r="44" />
      <circle cx="180" cy="128" r="44" />
    </g>
  ),
  spotify: (
    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm31.07-46.26a8,8,0,0,1-10.81,3.33,42.79,42.79,0,0,0-40.52,0,8,8,0,0,1-7.48-14.14,59.33,59.33,0,0,1,55.48,0A8,8,0,0,1,159.07,169.74Zm32-56a8,8,0,0,1-10.83,3.29,110.62,110.62,0,0,0-104.46,0,8,8,0,0,1-7.54-14.12,126.67,126.67,0,0,1,119.54,0A8,8,0,0,1,191.06,113.76Zm-16,28a8,8,0,0,1-10.82,3.3,77,77,0,0,0-72.48,0,8,8,0,0,1-7.52-14.12,93,93,0,0,1,87.52,0A8,8,0,0,1,175.06,141.76Z" />
  ),
  github: (
    <path d="M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.83a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.83a8.09,8.09,0,0,0,1,7.65A41.72,41.72,0,0,1,200,104Z" />
  ),
  mail: (
    <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z" />
  ),
};

const FOOTER_LINKS: { label: string; href: string; icon: keyof typeof FOOTER_ICONS }[] = [
  { label: "Instagram", href: "https://instagram.com/lucy.gai", icon: "instagram" },
  { label: "Letterboxd", href: "https://letterboxd.com/lucy_gai/", icon: "letterboxd" },
  { label: "Spotify", href: "https://open.spotify.com/user/charlottefour", icon: "spotify" },
  { label: "GitHub", href: "https://github.com/lxgai", icon: "github" },
  { label: "Mail", href: "mailto:mail@lucyg.ai", icon: "mail" },
];

type SidebarItem = { title: string; meta: string; href: string };

// "China ’25"
function travelSidebarTitle(place: string, date: string) {
  const year = date.match(/(\d{4})/)?.[1];
  return year ? `${place} ’${year.slice(-2)}` : place;
}

async function getSidebarItems() {
  const travels: SidebarItem[] = [...TRAVEL_ENTRIES]
    .sort((a, b) => dateSortValue(b.date) - dateSortValue(a.date))
    .slice(0, SIDEBAR_ITEM_COUNT)
    .map((trip) => ({
      title: travelSidebarTitle(trip.place, trip.date),
      meta: formatDisplayDate(trip.date),
      href: trip.hasDetail ? `/travels/${trip.id}` : "/travels",
    }));

  const writing: SidebarItem[] = (await getBlogEntries()).slice(0, SIDEBAR_ITEM_COUNT).map((entry) => ({
    title: entry.title,
    meta: formatDisplayDate(entry.date),
    href: `/blog/${entry.slug}`,
  }));

  return { travels, writing };
}

// The three-column page frame: sidebar, main column, optional TOC column, and
// footer. Pages pass their content as children and an optional TOC.
export default async function SiteShell({ children, toc }: { children: ReactNode; toc?: TocItem[] }) {
  const { travels, writing } = await getSidebarItems();
  const hasToc = Boolean(toc && toc.length > 0);
  // In the sidebar on desktop; under the asterisks once the site is one column.
  const lists = (
    <>
      <SidebarSection title="Recent Travels" items={travels} seeAll={{ label: "See all travels →", href: "/travels" }} />
      <SidebarSection title="Selected Writing" items={writing} seeAll={{ label: "See all writing →", href: "/blog" }} />
    </>
  );

  return (
    <div className={styles.root}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.titleRow}>
            <p className={styles.siteTitle}>
              <Link href="/">Lucy Gai</Link>
            </p>
            <ThemeToggle />
          </div>

          {hasToc && (
            <div className={styles.tocInSidebar}>
              <Toc items={toc!} />
            </div>
          )}

          <div className={styles.sideLists}>{lists}</div>
        </aside>

        <main className={styles.main}>
          {children}
          <div className={styles.endSpacer} />
          <Asterisks />
          <div className={styles.mainLists}>{lists}</div>
          <div className={styles.bottomSpacer} />
        </main>

        {hasToc && (
          <aside className={styles.tocColumn}>
            <Toc items={toc!} />
          </aside>
        )}

        <footer className={styles.footer}>
          <div className={styles.footerMeta}>
            <span>Lucy Gai</span>
            <span>© {new Date().getFullYear()}</span>
            <Clock />
          </div>
          <div className={cx(styles.footerLinks, hasToc && styles.footerLinksWithToc)}>
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={styles.footerLink}
                {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <svg className={styles.footerIcon} aria-hidden="true" width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
                  {FOOTER_ICONS[link.icon]}
                </svg>
                {link.label}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}

function SidebarSection({
  title,
  items,
  seeAll,
}: {
  title: string;
  items: SidebarItem[];
  seeAll: { label: string; href: string };
}) {
  return (
    <section className={styles.sideSection}>
      <h2 className={styles.sideHeading}>{title}</h2>
      {items.map((item) => (
        <Link key={item.href} href={item.href} className={styles.sideItem}>
          <span className={styles.sideItemTitle}>{item.title}</span>
          <span className={styles.sideItemMeta}>{item.meta}</span>
        </Link>
      ))}
      <Link href={seeAll.href} className={styles.seeAll}>
        {seeAll.label}
      </Link>
    </section>
  );
}
