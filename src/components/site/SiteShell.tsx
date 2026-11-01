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

const FOOTER_LINKS = [
  { label: "Instagram", href: "https://instagram.com/lucy.gai" },
  { label: "Letterboxd", href: "https://letterboxd.com/lucy_gai/" },
  { label: "Spotify", href: "https://open.spotify.com/user/charlottefour" },
  { label: "GitHub", href: "https://github.com/lxgai" },
  { label: "Mail", href: "mailto:mail@lucyg.ai" },
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

          <SidebarSection title="Recent Travels" items={travels} seeAll={{ label: "See all travels →", href: "/travels" }} />
          <SidebarSection title="Selected Writing" items={writing} seeAll={{ label: "See all writing →", href: "/blog" }} />
        </aside>

        <main className={styles.main}>
          {children}
          <div className={styles.endSpacer} />
          <Asterisks />
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
                {link.label}
                {/* Phosphor ArrowUpRight (regular) */}
                <svg className={styles.footerArrow} aria-hidden="true" width="12" height="12" viewBox="0 0 256 256">
                  <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" />
                </svg>
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
