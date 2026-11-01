"use client";

import Link from "next/link";
import { useState } from "react";
import { cx } from "@/lib/cx";
import styles from "./site.module.css";

export type TocItem = {
  href: string;
  label: string;
  children?: TocItem[];
};

// Quartz-style collapsible table of contents, open by default.
export default function Toc({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(true);

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
      {open && <TocList items={items} />}
    </nav>
  );
}

function TocList({ items }: { items: TocItem[] }) {
  return (
    <ul className={styles.tocList}>
      {items.map((item) => (
        <li key={item.href}>
          {item.href.startsWith("#") ? (
            <a href={item.href} className={styles.tocLink}>
              {item.label}
            </a>
          ) : (
            <Link href={item.href} className={styles.tocLink}>
              {item.label}
            </Link>
          )}
          {item.children && item.children.length > 0 && <TocList items={item.children} />}
        </li>
      ))}
    </ul>
  );
}
