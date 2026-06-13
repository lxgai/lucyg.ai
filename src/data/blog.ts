export type Post = {
  slug: string;
  date: string;
  title: string;
  tags: string[];
  excerpt: string;
  hero?: string;
  heroCaption?: string;
  body: PostBodyBlock[];
  foot?: string[];
};

export type PostBodyBlock =
  | { kind: "p" | "h" | "pull"; text: string }
  | { kind: "img"; src?: string; color?: string; caption?: string; aspect?: string };

// Blog entries are sourced from the Substack feed via `getBlogEntries()` in
// `@/lib/substack`. This array is the local fallback used only when no feed is
// available; it is intentionally empty so the site shows live Substack posts.
export const POSTS: Post[] = [];
