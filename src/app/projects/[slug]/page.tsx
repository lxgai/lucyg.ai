import { notFound } from "next/navigation";
import { ProjectDetailReport } from "@/components/content/ProjectArchive";
import { PROJECTS } from "@/data/projects";
import { getProjectMarkdown } from "@/lib/projectContent";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = PROJECTS.findIndex((project) => project.slug === slug);

  if (index === -1) {
    notFound();
  }

  const projectMarkdown = await getProjectMarkdown(PROJECTS[index].slug);

  return (
    <ProjectDetailReport
      project={PROJECTS[index]}
      projectMarkdown={projectMarkdown}
      previous={PROJECTS[index - 1]}
      next={PROJECTS[index + 1]}
    />
  );
}
