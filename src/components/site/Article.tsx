import type { ReactNode } from "react";
import { TagRow } from "./ui";
import styles from "./article.module.css";

export const proseClass = styles.prose;
export const tableWrapClass = styles.tableWrap;
export const closingClass = styles.closing;

// Article header (optional hero, title, handwritten meta line, tags, optional
// italic lede) followed by the body. "#top" is the TOC's first entry: the hero
// when there is one, otherwise the <h1>.
export default function Article({
  title,
  meta,
  tags,
  lede,
  hero,
  children,
}: {
  title: string;
  meta?: string;
  tags: string[];
  lede?: ReactNode;
  hero?: ReactNode;
  children: ReactNode;
}) {
  return (
    <article>
      {hero && (
        <div id="top" className={styles.hero}>
          {hero}
        </div>
      )}
      <h1 id={hero ? undefined : "top"} className={styles.title}>
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
