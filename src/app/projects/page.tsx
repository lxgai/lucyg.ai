"use client";

import { ProjectsSpreadList } from "@/components/content/ProjectArchive";
import PageShell from "@/components/design/PageShell";
import { PROJECTS } from "@/data/projects";

export default function ProjectsPage() {
  const entryLabel = `${PROJECTS.length} ${PROJECTS.length === 1 ? "entry" : "entries"}`;

  return (
    <PageShell
      section="SECTION A · PROJECTS"
      catNo="REF. A-IDX"
      title={<>Things I&apos;ve made.</>}
      subtitle={entryLabel}
    >
      <ProjectsSpreadList projects={PROJECTS} />
    </PageShell>
  );
}
