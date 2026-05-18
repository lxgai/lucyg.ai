"use client";
import { Box } from "@mui/material";
import { ProjectsSpreadList } from "@/components/content/ProjectArchive";
import PageShell from "@/components/design/PageShell";
import { PROJECTS } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <PageShell
      section="SECTION A · PROJECTS"
      catNo="file: projects.idx"
      title={
        <>
          Things I&apos;ve <Box component="span" sx={{ fontStyle: "italic" }}>made.</Box>
        </>
      }
      subtitle={`${PROJECTS.length} entries · solo + collab · view: spread`}
    >
      <Box sx={{ height: 24 }} />
      <ProjectsSpreadList projects={PROJECTS} />
    </PageShell>
  );
}
