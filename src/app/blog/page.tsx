import PageShell from "@/components/design/PageShell";
import BlogIndexClient from "./BlogIndexClient";
import { getBlogEntries } from "@/lib/substack";

export const revalidate = 3600;

export default async function BlogPage() {
  const entries = await getBlogEntries();

  return (
    <PageShell
      section="SECTION D · BLOG"
      catNo="REF. D-IDX"
      title={<>Notes, filed by date.</>}
      subtitle={`${entries.length} entries · most recent first`}
    >
      <BlogIndexClient entries={entries} />
    </PageShell>
  );
}
