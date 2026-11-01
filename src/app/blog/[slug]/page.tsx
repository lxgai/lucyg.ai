import { notFound } from "next/navigation";
import Article, { closingClass, proseClass } from "@/components/site/Article";
import SiteShell from "@/components/site/SiteShell";
import { linkClass } from "@/components/site/ui";
import { prepareArticleHtml } from "@/lib/articleHtml";
import { formatDisplayDate } from "@/lib/dates";
import { getBlogEntries } from "@/lib/substack";
import type { BlogEntry } from "@/types/blog";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const entries = await getBlogEntries();
  return entries.map((entry) => ({ slug: entry.slug }));
}

function readMinutes(post: BlogEntry) {
  const words = post.wordCount ?? post.text?.split(/\s+/).filter(Boolean).length ?? 0;
  return Math.max(1, Math.round(words / 220));
}

export default async function BlogPostRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = (await getBlogEntries()).find((entry) => entry.slug === slug);

  if (!post) {
    notFound();
  }

  const { html, headings } = prepareArticleHtml(post.html ?? "");
  const meta = [post.date === "undated" ? "" : formatDisplayDate(post.date), `${readMinutes(post)} min read`]
    .filter(Boolean)
    .join(", ");

  return (
    <SiteShell toc={[{ href: "#top", label: post.title, children: headings }]}>
      <Article title={post.title} meta={meta} tags={post.tags.map((tag) => `#${tag}`)}>
        {/* Sanitized in lib/substack before it reaches the page. */}
        <div className={proseClass} dangerouslySetInnerHTML={{ __html: html }} />
        {post.sourceUrl && (
          <p className={closingClass}>
            Also on{" "}
            <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
              Substack
            </a>
            , where comments live.
          </p>
        )}
      </Article>
    </SiteShell>
  );
}
