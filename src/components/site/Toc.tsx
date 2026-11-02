"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./site.module.css";

export type TocItem = {
  href: string;
  label: string;
  children?: TocItem[];
};

// Matches the .tocCollapse transition in site.module.css.
const COLLAPSE_MS = 240;
// A heading is "in" once its top passes this far down the viewport.
const ACTIVE_OFFSET = 120;

// The previous page's TOC. Each page mounts a fresh Toc, so this module-level
// copy (which survives client-side navigation) lets the new one start from the
// old sections and slide them closed while its own slide open.
let previousItems: TocItem[] | null = null;

// Quartz-style collapsible table of contents, open by default.
export default function Toc({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const activeHref = useActiveAnchor(items);
  // Read once, before this page's effect overwrites it. The column and sidebar
  // copies mount in the same commit, so both see the old value.
  const [previous] = useState(() => previousItems);

  useEffect(() => {
    previousItems = items;
  }, [items]);

  return (
    <nav className={styles.toc} aria-label="Table of contents">
      <button type="button" className={styles.tocToggle} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <span>Table of Contents</span>
        <svg
          className={cx(styles.tocChevron, !open && styles.tocChevronClosed)}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <Collapse open={open}>
        <ul className={cx(styles.tocList, styles.tocRoot)}>
          {items.map((item) => {
            const previousChildren = previous?.find((candidate) => candidate.href === item.href)?.children;
            return (
              <li key={item.href}>
                <TocLink item={item} pathname={pathname} activeHref={activeHref} />
                <AnimatedChildren
                  target={item.children ?? []}
                  initial={previous ? (previousChildren ?? []) : (item.children ?? [])}
                  pathname={pathname}
                  activeHref={activeHref}
                />
              </li>
            );
          })}
        </ul>
      </Collapse>
    </nav>
  );
}

// Grid-rows accordion: 0fr closed, 1fr open, content clipped while it moves.
function Collapse({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div className={cx(styles.tocCollapse, open && styles.tocCollapseOpen)} inert={!open}>
      <div className={styles.tocCollapseInner}>{children}</div>
    </div>
  );
}

const signature = (items: TocItem[]): string =>
  items.map((item) => `${item.href}|${item.label}(${signature(item.children ?? [])})`).join(",");

// A nav link's nested contents. Starts as the previous page's contents, then
// closes them and opens the new ones; a link that keeps the same contents
// doesn't move.
function AnimatedChildren({
  target,
  initial,
  pathname,
  activeHref,
}: {
  target: TocItem[];
  initial: TocItem[];
  pathname: string;
  activeHref: string | null;
}) {
  const [shown, setShown] = useState(initial);
  const [open, setOpen] = useState(initial.length > 0);
  const shownRef = useRef(shown);
  const openRef = useRef(open);
  shownRef.current = shown;
  openRef.current = open;
  const targetKey = signature(target);

  useEffect(() => {
    if (targetKey === signature(shownRef.current)) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer = 0;
    let frame = 0;
    const swap = () => {
      setShown(target);
      setOpen(false);
      // Paint the new contents closed, then open them so the transition runs.
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => setOpen(target.length > 0));
      });
    };

    if (openRef.current && shownRef.current.length > 0 && !reduced) {
      setOpen(false);
      timer = window.setTimeout(swap, COLLAPSE_MS);
    } else {
      swap();
    }

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on content, not array identity
  }, [targetKey]);

  if (shown.length === 0) return null;

  return (
    <Collapse open={open}>
      <TocList items={shown} pathname={pathname} activeHref={activeHref} />
    </Collapse>
  );
}

function TocList({ items, pathname, activeHref }: { items: TocItem[]; pathname: string; activeHref: string | null }) {
  return (
    <ul className={styles.tocList}>
      {items.map((item) => (
        <li key={item.href}>
          <TocLink item={item} pathname={pathname} activeHref={activeHref} />
          {item.children && item.children.length > 0 && (
            <TocList items={item.children} pathname={pathname} activeHref={activeHref} />
          )}
        </li>
      ))}
    </ul>
  );
}

// A nav link is current on its own page and every page under it.
function isCurrentPage(href: string, pathname: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

// An anchor is current when it's the heading in view, or contains it (the page
// title stays highlighted while you read its sections).
function containsAnchor(item: TocItem, activeHref: string | null): boolean {
  if (!activeHref) return false;
  return item.href === activeHref || (item.children ?? []).some((child) => containsAnchor(child, activeHref));
}

function TocLink({ item, pathname, activeHref }: { item: TocItem; pathname: string; activeHref: string | null }) {
  if (item.href.startsWith("#")) {
    const current = containsAnchor(item, activeHref);
    return (
      <a
        href={item.href}
        className={cx(styles.tocLink, current && styles.tocLinkCurrent)}
        aria-current={item.href === activeHref ? "location" : undefined}
      >
        {item.label}
      </a>
    );
  }

  const current = isCurrentPage(item.href, pathname);
  return (
    <Link
      href={item.href}
      className={cx(styles.tocLink, current && styles.tocLinkCurrent)}
      aria-current={pathname === item.href ? "page" : current ? "true" : undefined}
    >
      {item.label}
    </Link>
  );
}

function anchorHrefs(items: TocItem[]): string[] {
  return items.flatMap((item) => [...(item.href.startsWith("#") ? [item.href] : []), ...anchorHrefs(item.children ?? [])]);
}

// The last heading whose top has scrolled past ACTIVE_OFFSET; the first one
// before any has, and the last one once the page bottoms out.
function useActiveAnchor(items: TocItem[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = anchorHrefs(items).join(",");

  useEffect(() => {
    const hrefs = key ? key.split(",") : [];
    const targets = hrefs
      .map((href) => ({ href, element: document.getElementById(decodeURIComponent(href.slice(1))) }))
      .filter((target): target is { href: string; element: HTMLElement } => target.element !== null);
    if (targets.length === 0) {
      setActive(null);
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const atBottom =
        window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActive(targets[targets.length - 1].href);
        return;
      }
      let current = targets[0].href;
      for (const target of targets) {
        if (target.element.getBoundingClientRect().top > ACTIVE_OFFSET) break;
        current = target.href;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [key]);

  return active;
}
