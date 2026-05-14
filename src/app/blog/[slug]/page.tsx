import { notFound } from "next/navigation";
import { BlogPostArticle } from "@/components/content/BlogPostArticle";
import { POSTS } from "@/data/content";

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = POSTS.findIndex((post) => post.slug === slug);

  if (index === -1) {
    notFound();
  }

  const post = POSTS[index];
  const related = POSTS.filter(
    (candidate) =>
      candidate.slug !== post.slug &&
      candidate.tags.some((tag) => post.tags.includes(tag)),
  ).slice(0, 3);

  return (
    <BlogPostArticle
      post={post}
      older={POSTS[index + 1]}
      newer={POSTS[index - 1]}
      related={related}
    />
  );
}
