import Link from "next/link";
import SiteShell from "@/components/site/SiteShell";
import listStyles from "@/components/site/list.module.css";
import { TagRow, linkClass, pageTitleClass } from "@/components/site/ui";
import { formatDisplayDate } from "@/lib/dates";
import { getBlogEntries, getSubstackLinks } from "@/lib/substack";

export const revalidate = 3600;

export default async function BlogPage() {
  const entries = await getBlogEntries();
  const { publicationUrl } = getSubstackLinks();

  return (
    <SiteShell>
      <h1 className={pageTitleClass}>Blog</h1>
      <p style={{ margin: "12px 0 28px", fontSize: 16 }}>
        {publicationUrl ? (
          <>
            Also on{" "}
            <a href={publicationUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
              Substack
            </a>
            .
          </>
        ) : (
          "Also on Substack."
        )}
      </p>
      <ul className={listStyles.list}>
        {entries.map((entry) => (
          <li key={entry.slug} className={listStyles.item}>
            <div className={listStyles.row}>
              <p className={listStyles.date}>{formatDisplayDate(entry.date)}</p>
              <h2 className={listStyles.title}>
                <Link href={`/blog/${entry.slug}`}>{entry.title}</Link>
              </h2>
              <TagRow tags={entry.tags.map((tag) => ({ label: `#${tag}` }))} large layout="stacked" />
            </div>
          </li>
        ))}
      </ul>
    </SiteShell>
  );
}
