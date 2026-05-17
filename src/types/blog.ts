import type { PostBodyBlock } from "@/data/content";

export type BlogEntrySource = "local" | "substack";

export type BlogEntry = {
  slug: string;
  date: string;
  title: string;
  tags: string[];
  excerpt: string;
  source: BlogEntrySource;
  sourceUrl?: string;
  publishedAt?: string;
  wordCount?: number;
  html?: string;
  text?: string;
  hero?: string;
  heroCaption?: string;
  body?: PostBodyBlock[];
  foot?: string[];
};
