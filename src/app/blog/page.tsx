import { Box } from "@mui/material";
import PageShell from "@/components/design/PageShell";
import BlogIndexClient from "./BlogIndexClient";
import { getBlogEntries } from "@/lib/substack";

export const revalidate = 3600;

export default async function BlogPage() {
  const entries = await getBlogEntries();

  return (
    <PageShell
      section="SECTION D · BLOG"
      catNo="file: blog.idx"
      title={
        <>
          Notes, filed by <Box component="span" sx={{ fontStyle: "italic" }}>date.</Box>
        </>
      }
      subtitle={`${entries.length} entries · most recent first`}
    >
      <BlogIndexClient entries={entries} />
    </PageShell>
  );
}
