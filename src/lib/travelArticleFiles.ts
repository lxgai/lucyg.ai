import "server-only";
import path from "path";

// The only directory the dev editor may read or write.
export const travelArticleDir = path.join(process.cwd(), "src", "data", "travel-articles");

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Resolves a slug to its article file, or null if the slug could escape the directory.
export function resolveTravelArticlePath(slug: string) {
  if (!slugPattern.test(slug)) return null;

  const filePath = path.resolve(travelArticleDir, `${slug}.json`);
  const relative = path.relative(travelArticleDir, filePath);

  if (relative.startsWith("..") || path.isAbsolute(relative)) return null;
  return filePath;
}
