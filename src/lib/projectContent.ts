import { readFile } from "node:fs/promises";
import path from "node:path";

const PROJECT_CONTENT_DIR = path.join(process.cwd(), "src/content/projects");
const PROJECT_SLUG_PATTERN = /^[a-z0-9-]+$/;

export async function getProjectMarkdown(slug: string): Promise<string> {
  if (!PROJECT_SLUG_PATTERN.test(slug)) {
    return "";
  }

  try {
    return await readFile(path.join(PROJECT_CONTENT_DIR, `${slug}.md`), "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return "";
    }

    throw error;
  }
}
