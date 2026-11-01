import type { ReactNode } from "react";
import { TagRow } from "./ui";
import styles from "./article.module.css";

export const proseClass = styles.prose;
export const tableWrapClass = styles.tableWrap;
export const closingClass = styles.closing;

// Article header (title, handwritten meta line, tags, optional italic lede)
// followed by the body. The <h1 id="top"> is the TOC's first entry.
export default function Article({
  title,
  meta,
  tags,
  lede,
  children,
}: {
  title: string;
  meta?: string;
  tags: string[];
  lede?: ReactNode;
  children: ReactNode;
}) {
  return (
    <article>
      <h1 id="top" className={styles.title}>
        {title}
      </h1>
      {meta && <p className={styles.meta}>{meta}</p>}
      {tags.length > 0 && (
        <div className={styles.tags}>
          <TagRow tags={tags.map((label) => ({ label }))} />
        </div>
      )}
      {lede && <div className={styles.lede}>{lede}</div>}
      {children}
    </article>
  );
}
