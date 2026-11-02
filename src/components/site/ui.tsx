import { cx } from "@/lib/cx";
import type { ReactNode } from "react";
import styles from "./ui.module.css";

export const linkClass = styles.link;
export const mutedClass = styles.muted;
export const pageTitleClass = styles.pageTitle;

// Opens in a new tab and marks itself with an ArrowSquareOut after the text.
export function ExternalLink({
  href,
  className = styles.link,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cx(className, styles.external)}>
      {children}
    </a>
  );
}

export function Tag({ children, large = false, title }: { children: ReactNode; large?: boolean; title?: string }) {
  return (
    <span className={cx(styles.tag, large && styles.tagLarge)} title={title}>
      {children}
    </span>
  );
}

export function TagRow({
  tags,
  large = false,
  layout = "wrap",
  className,
}: {
  tags: Array<{ label: string; title?: string }>;
  large?: boolean;
  // "inline": one right-aligned line (list rows); "stacked": right-aligned column.
  layout?: "wrap" | "inline" | "stacked";
  className?: string;
}) {
  return (
    <ul
      className={cx(
        styles.tagRow,
        layout === "inline" && styles.tagRowInline,
        layout === "stacked" && styles.tagRowStacked,
        className,
      )}
    >
      {tags.map((tag) => (
        <li key={tag.label}>
          <Tag large={large} title={tag.title}>
            {tag.label}
          </Tag>
        </li>
      ))}
    </ul>
  );
}

export function Asterisks({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cx(styles.asterisks, className)}>
      * * *
    </div>
  );
}
