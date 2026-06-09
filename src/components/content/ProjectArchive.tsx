"use client";

import { Box, Typography } from "@mui/material";
import NextLink from "next/link";
import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import PageShell from "@/components/design/PageShell";
import { tokens } from "@/components/design/tokens";
import type { Project } from "@/data/projects";

export function ProjectThumb({
  project,
  aspect = "16 / 10",
}: {
  project: Project;
  aspect?: string;
}) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: aspect,
        overflow: "hidden",
        background:
          "linear-gradient(135deg, rgba(0,0,0,0.18), rgba(255,255,255,0.08)), " +
          "repeating-linear-gradient(135deg, rgba(255,255,255,0.07) 0 10px, rgba(0,0,0,0.04) 10px 22px), " +
          project.color,
        filter: "sepia(0.08) saturate(0.92)",
      }}
      aria-hidden
    >
      <Typography
        component="div"
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: tokens.serif,
          fontStyle: "italic",
          fontSize: { xs: 92, md: 150 },
          lineHeight: 1,
          color: "rgba(255,255,255,0.9)",
          textShadow: "0 2px 12px rgba(0,0,0,0.18)",
        }}
      >
        {project.name[0]}
      </Typography>
      <Box
        sx={{
          position: "absolute",
          top: 10,
          left: 10,
          fontFamily: tokens.mono,
          fontSize: 9,
          letterSpacing: "1.6px",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.85)",
          px: 0.9,
          py: 0.4,
          background: "rgba(0,0,0,0.18)",
          backdropFilter: "blur(2px)",
        }}
      >
        {project.year}
      </Box>
    </Box>
  );
}

export function StatusDot({ project }: { project: Project }) {
  const active = project.status === "live" || project.status === "shipping";

  return (
    <Box
      component="span"
      sx={{
        fontFamily: tokens.mono,
        fontSize: 9,
        letterSpacing: "1.4px",
        textTransform: "uppercase",
        color: active ? tokens.accent : tokens.ink60,
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        whiteSpace: "nowrap",
      }}
    >
      <Box
        component="span"
        sx={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: active ? tokens.accent : tokens.ink40,
          boxShadow: active ? `0 0 0 3px color-mix(in srgb, ${tokens.accent} 15%, transparent)` : "none",
        }}
      />
      {project.status}
    </Box>
  );
}

export function ProjectsSpreadList({ projects }: { projects: Project[] }) {
  const [sortOrder, setSortOrder] = React.useState<"newest" | "oldest">("newest");
  const chronologicalProjects = React.useMemo(
    () => [...projects].sort((a, b) => getProjectSortValue(a) - getProjectSortValue(b)),
    [projects],
  );
  const entryNumbers = React.useMemo(
    () => new Map(chronologicalProjects.map((project, index) => [project.slug, index + 1])),
    [chronologicalProjects],
  );
  const sortedProjects = React.useMemo(
    () => (sortOrder === "oldest" ? chronologicalProjects : [...chronologicalProjects].reverse()),
    [chronologicalProjects, sortOrder],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 1,
          pb: 2,
          borderBottom: `1px solid ${tokens.hair}`,
        }}
      >
        {(["newest", "oldest"] as const).map((order) => {
          const active = sortOrder === order;

          return (
            <Box
              key={order}
              component="button"
              type="button"
              onClick={() => setSortOrder(order)}
              sx={{
                fontFamily: tokens.mono,
                fontSize: 9,
                letterSpacing: "1.4px",
                textTransform: "uppercase",
                color: active ? tokens.paperCard : tokens.ink60,
                background: active ? tokens.accent : "transparent",
                border: `1px solid ${active ? tokens.accent : tokens.hair}`,
                px: 1.25,
                py: 0.75,
                cursor: "pointer",
              }}
            >
              {order}
            </Box>
          );
        })}
      </Box>

      {sortedProjects.map((project, index) => {
        const reverse = index % 2 === 1;
        const entryNumber = entryNumbers.get(project.slug) ?? index + 1;

        return (
          <Box
            key={project.slug}
            component={NextLink}
            href={`/projects/${project.slug}`}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: reverse ? "1fr 1.1fr" : "1.1fr 1fr" },
              gap: { xs: 3, md: 7 },
              alignItems: "center",
              py: { xs: 4, md: 5.5 },
              borderTop: index === 0 ? "none" : `1px solid ${tokens.hair}`,
              borderBottom: index === sortedProjects.length - 1 ? `1px solid ${tokens.hair}` : "none",
              color: tokens.ink,
              textDecoration: "none",
              transition: "background 200ms",
              "&:hover": { background: "rgba(31,26,22,0.02)" },
            }}
          >
            <Box sx={{ order: { xs: 2, md: reverse ? 2 : 1 }, width: "100%" }}>
              <ProjectThumb project={project} />
            </Box>
            <Box sx={{ order: { xs: 1, md: reverse ? 1 : 2 } }}>
              <Box
                sx={{
                  fontFamily: tokens.mono,
                  fontSize: 10,
                  letterSpacing: "1.8px",
                  textTransform: "uppercase",
                  color: tokens.accent,
                  mb: 1.5,
                }}
              >
                Entry {String(entryNumber).padStart(2, "0")} · {project.year}
              </Box>
              <Typography
                component="h2"
                sx={{
                  fontFamily: tokens.serif,
                  fontWeight: 400,
                  fontSize: { xs: 42, md: 52 },
                  lineHeight: 0.98,
                  letterSpacing: "-1px",
                  m: 0,
                }}
              >
                {project.name}
              </Typography>
              <Box
                sx={{
                  fontFamily: tokens.mono,
                  fontSize: 10,
                  color: tokens.ink60,
                  textTransform: "uppercase",
                  letterSpacing: "1.4px",
                  mt: 1.75,
                }}
              >
                {project.stack.join(" · ")}
              </Box>
              <Typography
                component="div"
                sx={{
                  fontFamily: tokens.serif,
                  fontSize: 18,
                  color: tokens.ink,
                  mt: 2.75,
                  lineHeight: 1.5,
                  maxWidth: 420,
                }}
              >
                {project.kind}.
              </Typography>
              <Box sx={{ display: "flex", gap: 3, alignItems: "center", mt: 3.5, flexWrap: "wrap" }}>
                <StatusDot project={project} />
                <Box component="span" sx={{ flex: 1, display: { xs: "none", md: "block" } }} />
                <Box
                  component="span"
                  sx={{
                    fontFamily: tokens.mono,
                    fontSize: 10,
                    color: tokens.accent,
                    letterSpacing: "1.4px",
                    textTransform: "uppercase",
                  }}
                >
                  open file →
                </Box>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

function getProjectSortValue(project: Project) {
  const dateSource = project.published ?? project.started ?? project.year;
  const yearMatch = dateSource.match(/\d{4}/);
  const monthMatch = dateSource.match(/[A-Za-z]{3,}/);
  const monthIndex = monthMatch
    ? ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(
        monthMatch[0].slice(0, 3).toLowerCase(),
      )
    : -1;
  const year = yearMatch ? Number(yearMatch[0]) : Number(project.year) || 0;

  return year * 12 + Math.max(monthIndex, 0);
}

function ProjectHero({ project }: { project: Project }) {
  return (
    <Box sx={{ mt: 1.5 }}>
      <ProjectThumb project={project} aspect="21 / 9" />
      <Typography
        component="h1"
        sx={{
          fontFamily: tokens.serif,
          fontWeight: 400,
          fontStyle: "italic",
          fontSize: { xs: 56, md: 92 },
          lineHeight: 0.95,
          letterSpacing: { xs: "-1.2px", md: "-2.4px" },
          mt: 3.5,
          mb: 0,
        }}
      >
        {project.name}.
      </Typography>
    </Box>
  );
}

function ProjectSpecs({ project }: { project: Project }) {
  const published = project.published ?? project.started;
  const lastUpdated = project.updated && project.updated !== published ? project.updated : "—";
  const isLive = project.status === "live" || project.status === "shipping";
  const cells = [
    ["First published", compactProjectDate(published)],
    ["Updated", compactProjectDate(lastUpdated)],
    ["Stack", project.stack.join(" · ")],
    ["Status", project.status],
  ];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "stretch",
        width: "min(100%, max(50%, 620px))",
        maxWidth: "100%",
        mr: "auto",
        py: 1,
        "@media (max-width: 560px)": {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "26px 28px",
          width: "100%",
          alignItems: "start",
        },
      }}
    >
      {cells.map(([label, value], index) => {
        const isStatus = label === "Status";

        return (
          <React.Fragment key={label}>
            {index > 0 && (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 22,
                  px: 2.75,
                  "@media (max-width: 560px)": { display: "none" },
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: tokens.ink20,
                  }}
                />
              </Box>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.125, minWidth: 0 }}>
              <Box
                sx={{
                  fontFamily: tokens.mono,
                  fontSize: 9,
                  letterSpacing: "1.6px",
                  color: tokens.ink40,
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </Box>
              {isStatus ? (
                <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                  <Box
                    component="span"
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      flex: "0 0 auto",
                      background: isLive ? tokens.accent : tokens.ink40,
                      boxShadow: isLive ? `0 0 0 3px color-mix(in srgb, ${tokens.accent} 15%, transparent)` : "none",
                    }}
                  />
                  <Box
                    component="span"
                    sx={{
                      fontFamily: tokens.mono,
                      fontSize: 12,
                      letterSpacing: "0.4px",
                      lineHeight: 1,
                      color: tokens.ink,
                      textTransform: "uppercase",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {value}
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    fontFamily: tokens.mono,
                    fontSize: 12,
                    letterSpacing: "0.3px",
                    lineHeight: 1.4,
                    color: tokens.ink,
                    overflowWrap: "anywhere",
                  }}
                >
                  {value}
                </Box>
              )}
            </Box>
          </React.Fragment>
        );
      })}
    </Box>
  );
}

function compactProjectDate(date: string) {
  return date.replace(/\s*(?:Â·|·|\/|,)\s*/g, "·").replace(/\s+/g, "·");
}

function MarkdownImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src) {
    return null;
  }

  return (
    <Box component="figure" sx={{ my: { xs: 4, md: 5.5 }, mx: 0 }}>
      <Box
        component="img"
        src={src}
        alt={alt ?? ""}
        sx={{
          display: "block",
          width: "100%",
          height: "auto",
          border: `1px solid ${tokens.hair}`,
          filter: "sepia(0.08) saturate(0.92)",
        }}
      />
      {alt && (
        <Box
          component="figcaption"
          sx={{
            fontFamily: tokens.mono,
            fontSize: 9,
            color: tokens.ink60,
            letterSpacing: "1.4px",
            textTransform: "uppercase",
            mt: 1.25,
          }}
        >
          {alt}
        </Box>
      )}
    </Box>
  );
}

const markdownComponents: Components = {
  h1({ children }) {
    return (
      <Typography
        component="h2"
        sx={{
          fontFamily: tokens.serif,
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: { xs: 34, md: 42 },
          lineHeight: 1.12,
          letterSpacing: { xs: "-0.5px", md: "-0.8px" },
          color: tokens.ink,
          mt: { xs: 5, md: 7 },
          mb: 2,
        }}
      >
        {children}
      </Typography>
    );
  },
  h2({ children }) {
    return (
      <Typography
        component="h2"
        sx={{
          fontFamily: tokens.serif,
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: { xs: 30, md: 36 },
          lineHeight: 1.15,
          letterSpacing: "-0.5px",
          color: tokens.ink,
          mt: { xs: 4.5, md: 6 },
          mb: 2,
        }}
      >
        {children}
      </Typography>
    );
  },
  h3({ children }) {
    return (
      <Box
        component="h3"
        sx={{
          fontFamily: tokens.mono,
          fontSize: 10,
          letterSpacing: "1.8px",
          textTransform: "uppercase",
          color: tokens.accent,
          mt: 4,
          mb: 1.5,
        }}
      >
        {children}
      </Box>
    );
  },
  p({ children }) {
    const childArray = React.Children.toArray(children);

    if (
      childArray.length === 1 &&
      React.isValidElement(childArray[0]) &&
      childArray[0].type === MarkdownImage
    ) {
      return childArray[0];
    }

    return (
      <Typography
        component="p"
        sx={{
          fontFamily: tokens.serif,
          fontSize: { xs: 18, md: 19 },
          lineHeight: 1.68,
          color: tokens.ink,
          m: 0,
          mb: 2.5,
        }}
      >
        {children}
      </Typography>
    );
  },
  blockquote({ children }) {
    return (
      <Box
        component="blockquote"
        sx={{
          fontFamily: tokens.serif,
          fontStyle: "italic",
          fontSize: { xs: 25, md: 32 },
          lineHeight: 1.28,
          color: tokens.ink,
          my: { xs: 4, md: 5.5 },
          mx: 0,
          pl: { xs: 2.5, md: 3 },
          borderLeft: `1px solid ${tokens.hairStrong}`,
          "& p": {
            fontSize: "inherit",
            lineHeight: "inherit",
            mb: 0,
          },
        }}
      >
        {children}
      </Box>
    );
  },
  ul({ children }) {
    return (
      <Box
        component="ul"
        sx={{
          fontFamily: tokens.serif,
          fontSize: { xs: 18, md: 19 },
          lineHeight: 1.65,
          color: tokens.ink,
          mt: 0,
          mb: 3,
          pl: 3,
        }}
      >
        {children}
      </Box>
    );
  },
  ol({ children }) {
    return (
      <Box
        component="ol"
        sx={{
          fontFamily: tokens.serif,
          fontSize: { xs: 18, md: 19 },
          lineHeight: 1.65,
          color: tokens.ink,
          mt: 0,
          mb: 3,
          pl: 3,
        }}
      >
        {children}
      </Box>
    );
  },
  li({ children }) {
    return <Box component="li" sx={{ mb: 1 }}>{children}</Box>;
  },
  a({ children, href }) {
    return (
      <Box
        component="a"
        href={href}
        sx={{
          color: tokens.accent,
          textDecorationColor: "color-mix(in srgb, currentColor 45%, transparent)",
          textUnderlineOffset: "0.18em",
          "&:hover": { textDecorationColor: "currentColor" },
        }}
      >
        {children}
      </Box>
    );
  },
  img({ src, alt }) {
    return <MarkdownImage src={typeof src === "string" ? src : undefined} alt={alt} />;
  },
};

const overviewMarkdownComponents: Components = {
  ...markdownComponents,
  p({ children }) {
    const childArray = React.Children.toArray(children);

    if (
      childArray.length === 1 &&
      React.isValidElement(childArray[0]) &&
      childArray[0].type === MarkdownImage
    ) {
      return childArray[0];
    }

    return (
      <Typography
        component="p"
        sx={{
          fontFamily: tokens.serif,
          fontSize: { xs: 22, md: 26 },
          lineHeight: 1.4,
          letterSpacing: 0,
          color: tokens.ink,
          m: 0,
          mb: 2.5,
        }}
      >
        {children}
      </Typography>
    );
  },
};

function splitOverviewMarkdown(markdown: string) {
  const trimmedMarkdown = markdown.trim();
  const overviewHeading = /^#\s+Overview\s*\n+/i.exec(trimmedMarkdown);

  if (!overviewHeading) {
    return { bodyMarkdown: trimmedMarkdown };
  }

  const markdownAfterHeading = trimmedMarkdown.slice(overviewHeading[0].length);
  const nextHeadingIndex = markdownAfterHeading.search(/\n#{1,6}\s+/);

  if (nextHeadingIndex === -1) {
    return {
      overviewMarkdown: markdownAfterHeading.trim(),
      bodyMarkdown: "",
    };
  }

  return {
    overviewMarkdown: markdownAfterHeading.slice(0, nextHeadingIndex).trim(),
    bodyMarkdown: markdownAfterHeading.slice(nextHeadingIndex).trim(),
  };
}

function ProjectMarkdown({ markdown }: { markdown: string }) {
  const { overviewMarkdown, bodyMarkdown } = splitOverviewMarkdown(markdown);

  return (
    <>
      {overviewMarkdown && (
        <Box sx={{ mt: { xs: 6, md: 9 }, mb: { xs: 5, md: 8 }, maxWidth: 720, mx: "auto" }}>
          <Box
            sx={{
              fontFamily: tokens.mono,
              fontSize: 10,
              letterSpacing: "2px",
              color: tokens.accent,
              textTransform: "uppercase",
              mb: 2.25,
            }}
          >
            ¶ Overview
          </Box>
          <ReactMarkdown components={overviewMarkdownComponents}>{overviewMarkdown}</ReactMarkdown>
        </Box>
      )}

      {bodyMarkdown && (
        <Box
          sx={{
            maxWidth: 720,
            mx: "auto",
            mt: overviewMarkdown ? 0 : { xs: 6, md: 8 },
          }}
        >
          <ReactMarkdown components={markdownComponents}>{bodyMarkdown}</ReactMarkdown>
        </Box>
      )}
    </>
  );
}

function ProjectLegacyEntries({ project }: { project: Project }) {
  const opening = project.entries?.[0]?.b.split(".")[0];

  return (
    <>
      <Box sx={{ my: { xs: 6, md: 8 }, maxWidth: 900 }}>
        <Box
          sx={{
            fontFamily: tokens.mono,
            fontSize: 10,
            letterSpacing: "2px",
            color: tokens.accent,
            textTransform: "uppercase",
            mb: 1.75,
          }}
        >
          Paragraph · opening
        </Box>
        <Typography
          component="div"
          sx={{
            fontFamily: tokens.serif,
            fontSize: { xs: 30, md: 42 },
            lineHeight: 1.18,
            letterSpacing: { xs: "-0.4px", md: "-0.8px" },
            fontStyle: "italic",
            color: tokens.ink,
          }}
        >
          &ldquo;{opening}.&rdquo;
        </Typography>
      </Box>

      <Box
        sx={{
          columnCount: { xs: 1, md: 2 },
          columnGap: 7,
          fontFamily: tokens.serif,
          fontSize: 17,
          lineHeight: 1.65,
          color: tokens.ink,
        }}
      >
        {project.entries?.map((entry) => (
          <Box key={`${entry.date}-${entry.h}`} sx={{ breakInside: "avoid", mb: 3.5 }}>
            <Box
              sx={{
                fontFamily: tokens.mono,
                fontSize: 9,
                letterSpacing: "1.6px",
                color: tokens.ink60,
                textTransform: "uppercase",
                mb: 0.75,
              }}
            >
              {entry.date} · {entry.h}
            </Box>
            <Box>{entry.b}</Box>
          </Box>
        ))}

        <Box sx={{ breakInside: "avoid", mb: 3.5 }}>
          <ProjectThumb project={project} aspect="4 / 3" />
          <Box
            sx={{
              fontFamily: tokens.mono,
              fontSize: 9,
              color: tokens.ink60,
              letterSpacing: "1.4px",
              textTransform: "uppercase",
              mt: 1,
            }}
          >
            Fig. 01 - {project.name.toLowerCase()}, in situ
          </Box>
        </Box>
      </Box>
    </>
  );
}

export function ProjectDetailReport({
  project,
  projectMarkdown,
  refNo,
  previous,
  next,
}: {
  project: Project;
  projectMarkdown?: string;
  refNo: string;
  previous?: Project;
  next?: Project;
}) {
  const hasMarkdown = Boolean(projectMarkdown?.trim());

  return (
    <PageShell
      section={`SECTION A · PROJECTS · ${project.slug}`}
      catNo={refNo}
      contentSx={{ width: "100%" }}
    >
      <Box
        component={NextLink}
        href="/projects"
        sx={{
          fontFamily: tokens.mono,
          fontSize: 11,
          letterSpacing: "1.6px",
          color: tokens.ink60,
          textTransform: "uppercase",
          textDecoration: "none",
          display: "inline-flex",
          gap: 1,
          alignItems: "center",
          mt: { xs: 2, md: 3 },
          mb: 0.5,
          "&:hover": { color: tokens.accent },
        }}
      >
        ← Projects
      </Box>

      <ProjectHero project={project} />

      <Box sx={{ mt: 6 }}>
        <ProjectSpecs project={project} />
      </Box>

      {hasMarkdown ? <ProjectMarkdown markdown={projectMarkdown ?? ""} /> : <ProjectLegacyEntries project={project} />}

      {project.metrics && (
        <Box
          sx={{
            mt: { xs: 6, md: 9 },
            py: 4,
            borderTop: `1px solid ${tokens.hairStrong}`,
            borderBottom: `1px solid ${tokens.hairStrong}`,
          }}
        >
          <Box
            sx={{
              fontFamily: tokens.mono,
              fontSize: 10,
              letterSpacing: "2px",
              color: tokens.accent,
              textTransform: "uppercase",
              mb: 3,
            }}
          >
            By the numbers
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: `repeat(${project.metrics.length}, minmax(0, 1fr))`,
              gap: { xs: 2, md: 4 },
              textAlign: "center",
            }}
          >
            {project.metrics.map(([label, value]) => (
              <Box key={label}>
                <Box
                  sx={{
                    fontFamily: tokens.serif,
                    fontSize: "clamp(30px, 10vw, 64px)",
                    lineHeight: 1,
                    letterSpacing: "-2px",
                    fontStyle: "italic",
                  }}
                >
                  {value}
                </Box>
                <Box
                  sx={{
                    fontFamily: tokens.mono,
                    fontSize: 9,
                    letterSpacing: "1.4px",
                    color: tokens.ink60,
                    textTransform: "uppercase",
                    mt: 1.25,
                  }}
                >
                  {label}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {project.links && (
        <Box sx={{ mt: 5 }}>
          <Box
            sx={{
              fontFamily: tokens.mono,
              fontSize: 10,
              letterSpacing: "1.6px",
              color: tokens.ink60,
              textTransform: "uppercase",
              mb: 1.75,
            }}
          >
            Where to find it
          </Box>
          <Box sx={{ display: "flex", gap: 2.25, flexWrap: "wrap" }}>
            {project.links.map(([label, value]) => (
              <Box key={label}>
                <Box sx={{ fontFamily: tokens.mono, fontSize: 9, letterSpacing: "1.4px", color: tokens.ink60, textTransform: "uppercase" }}>
                  {label}
                </Box>
                <Box sx={{ fontFamily: tokens.serif, fontSize: 16, fontStyle: "italic", mt: 0.5, color: tokens.accent }}>
                  {value} →
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <ProjectPrevNext previous={previous} next={next} />
    </PageShell>
  );
}

function ProjectPrevNext({ previous, next }: { previous?: Project; next?: Project }) {
  return (
    <Box
      sx={{
        mt: 9,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 4,
      }}
    >
      {previous ? (
        <Box component={NextLink} href={`/projects/${previous.slug}`} sx={{ color: tokens.ink, textDecoration: "none" }}>
          <Box sx={{ fontFamily: tokens.mono, fontSize: 9, letterSpacing: "1.6px", color: tokens.ink60, textTransform: "uppercase" }}>
            ← Previous
          </Box>
          <Box sx={{ fontFamily: tokens.serif, fontSize: 22, fontStyle: "italic", mt: 0.5 }}>{previous.name}</Box>
        </Box>
      ) : (
        <Box />
      )}
      {next ? (
        <Box
          component={NextLink}
          href={`/projects/${next.slug}`}
          sx={{ color: tokens.ink, textDecoration: "none", textAlign: { xs: "left", md: "right" } }}
        >
          <Box sx={{ fontFamily: tokens.mono, fontSize: 9, letterSpacing: "1.6px", color: tokens.ink60, textTransform: "uppercase" }}>
            Next →
          </Box>
          <Box sx={{ fontFamily: tokens.serif, fontSize: 22, fontStyle: "italic", mt: 0.5 }}>{next.name}</Box>
        </Box>
      ) : (
        <Box />
      )}
    </Box>
  );
}
