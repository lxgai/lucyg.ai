import Image from "next/image";
import { notFound } from "next/navigation";
import Article, { closingClass, proseClass } from "@/components/site/Article";
import SiteShell from "@/components/site/SiteShell";
import { linkClass } from "@/components/site/ui";
import { PROJECTS, type Project } from "@/data/projects";
import { formatDisplayDate } from "@/lib/dates";
import { resolveSiteImageSrc } from "@/lib/images";
import { getProjectMarkdown } from "@/lib/projectContent";
import ProjectMarkdown, { markdownHeadings, splitOverview } from "./ProjectMarkdown";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

function toHref(value: string) {
  return value.startsWith("http") ? value : `https://${value}`;
}

// "Live at lucyg.ai · source on GitHub"
function ProjectLinks({ links }: { links: NonNullable<Project["links"]> }) {
  const parts = links.map(([kind, value]) => {
    const href = toHref(value);
    const label = href.includes("github.com") ? "GitHub" : value.replace(/^https?:\/\//, "");
    const prefix = kind === "live" ? "Live at" : kind === "source" ? "source on" : `${kind}:`;
    return { prefix, href, label };
  });

  return (
    <p className={closingClass}>
      {parts.map((part, index) => (
        <span key={part.href}>
          {index > 0 && " · "}
          {index === 0 ? part.prefix.charAt(0).toUpperCase() + part.prefix.slice(1) : part.prefix}{" "}
          <a href={part.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {part.label}
          </a>
        </span>
      ))}
    </p>
  );
}

export default async function ProjectDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((candidate) => candidate.slug === slug);

  if (!project) {
    notFound();
  }

  const { lede, body } = splitOverview(await getProjectMarkdown(project.slug));
  const tags = [...project.stack, project.status].filter(Boolean);

  return (
    <SiteShell toc={[{ href: "#top", label: project.name, children: markdownHeadings(body) }]}>
      <Article
        title={`${project.name}.`}
        meta={formatDisplayDate(project.first_published)}
        tags={tags}
        lede={lede ? <ProjectMarkdown markdown={lede} /> : undefined}
      >
        <div className={proseClass}>
          <figure>
            <Image
              src={resolveSiteImageSrc(project.image)}
              alt={`${project.name} homepage`}
              width={0}
              height={0}
              sizes="(max-width: 904px) 100vw, 720px"
              priority
            />
          </figure>
          <ProjectMarkdown markdown={body} />
        </div>
        {project.links && project.links.length > 0 && <ProjectLinks links={project.links} />}
      </Article>
    </SiteShell>
  );
}
