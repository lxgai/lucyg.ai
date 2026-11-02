"use client";

import { useState } from "react";
import { cx } from "@/lib/cx";
import { Tag } from "./ui";
import styles from "./ui.module.css";

// The first tag plus a "+N" tag. Hover (or a tap, which toggles) lays the full
// row over it inline, extending left over the title if it needs the room. The
// overlay is positioned against the nearest positioned ancestor, so the caller's
// row must set `position: relative`.
export default function ExpandableTags({ labels, large = false }: { labels: string[]; large?: boolean }) {
  const [open, setOpen] = useState(false);
  const [first, ...rest] = labels;
  if (!first) return null;

  if (rest.length === 0) {
    return (
      <ul className={cx(styles.tagRow, styles.tagRowInline)}>
        <li>
          <Tag large={large}>{first}</Tag>
        </li>
      </ul>
    );
  }

  return (
    <div className={cx(styles.expand, open && styles.expandOpen)}>
      <ul className={cx(styles.tagRow, styles.tagRowInline)}>
        <li>
          <Tag large={large}>{first}</Tag>
        </li>
        <li>
          <button
            type="button"
            className={styles.moreButton}
            aria-expanded={open}
            aria-label={`Show all ${labels.length}: ${labels.join(", ")}`}
            onClick={() => setOpen((value) => !value)}
          >
            <Tag large={large}>+{rest.length}</Tag>
          </button>
        </li>
      </ul>
      <div className={styles.expandOverlay} aria-hidden="true">
        <ul className={styles.tagRow} onClick={() => setOpen(false)}>
          {labels.map((label) => (
            <li key={label}>
              <Tag large={large}>{label}</Tag>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
