import { notFound } from "next/navigation";
import { BlogPostArticle } from "@/components/content/BlogPostArticle";
import { getBlogEntries, getSubstackLinks } from "@/lib/substack";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const entries = await getBlogEntries();
  return entries.map((entry) => ({ slug: entry.slug }));
}

export default async function BlogPostRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entries = await getBlogEntries();
  const index = entries.findIndex((entry) => entry.slug === slug);

  if (index === -1) {
    notFound();
  }

  const post = entries[index];
  const related = entries.filter(
    (candidate) =>
      candidate.slug !== post.slug &&
      candidate.tags.some((tag) => post.tags.includes(tag)),
  ).slice(0, 3);
  const substackLinks = getSubstackLinks();

  return (
    <BlogPostArticle
      post={post}
      older={entries[index + 1]}
      newer={entries[index - 1]}
      related={related}
      subscribeEmbedUrl={substackLinks.embedUrl}
      subscribeUrl={substackLinks.subscribeUrl}
    />
  );
}
