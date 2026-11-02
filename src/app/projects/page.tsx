import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/site/SiteShell";
import { SITE_NAV } from "@/components/site/siteNav";
import { pageTitleClass } from "@/components/site/ui";
import { PROJECTS } from "@/data/projects";
import { formatDisplayDate } from "@/lib/dates";
import { resolveSiteImageSrc } from "@/lib/images";
import styles from "./projects.module.css";

export default function ProjectsPage() {
  return (
    <SiteShell toc={SITE_NAV}>
      <h1 className={pageTitleClass} style={{ marginBottom: 28 }}>
        Projects
      </h1>
      <ul className={styles.list}>
        {PROJECTS.map((project, index) => (
          <li key={project.slug}>
            <Link href={`/projects/${project.slug}`} className={styles.row}>
              <Image
                src={resolveSiteImageSrc(project.image)}
                alt={`${project.name} preview`}
                width={280}
                height={190}
                sizes="(max-width: 560px) 100vw, 280px"
                priority={index === 0}
                className={styles.thumb}
              />
              <span className={styles.text}>
                <span className={styles.name}>{project.name}</span>
                <span className={styles.detail}>
                  {project.kind}. {project.stack.join(" · ")}
                </span>
                <span className={styles.date}>{formatDisplayDate(project.first_published)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </SiteShell>
  );
}
