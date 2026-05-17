"use client";

import { Box, Typography } from "@mui/material";
import NextLink from "next/link";
import PageShell from "@/components/design/PageShell";
import { tokens } from "@/components/design/tokens";
import type { Project } from "@/data/content";

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
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {projects.map((project, index) => {
        const reverse = index % 2 === 1;

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
              borderTop: index === 0 ? `1px solid ${tokens.hairStrong}` : `1px solid ${tokens.hair}`,
              borderBottom: index === projects.length - 1 ? `1px solid ${tokens.hairStrong}` : "none",
              color: tokens.ink,
              textDecoration: "none",
              transition: "background 200ms",
              "&:hover": { background: "rgba(31,26,22,0.02)" },
            }}
          >
            <Box sx={{ order: { xs: 1, md: reverse ? 2 : 1 }, width: "100%" }}>
              <ProjectThumb project={project} />
            </Box>
            <Box sx={{ order: { xs: 2, md: reverse ? 1 : 2 } }}>
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
                Entry {String(index + 1).padStart(2, "0")} · {project.year}
              </Box>
              <Typography
                component="h2"
                sx={{
                  fontFamily: tokens.serif,
                  fontWeight: 400,
                  fontSize: { xs: 42, md: 52 },
                  lineHeight: 0.98,
                  letterSpacing: "-1px",
                  fontStyle: "italic",
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
                {project.role}
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
                <Box component="span" sx={{ width: 1, height: 14, background: tokens.hair }} />
                <Box
                  component="span"
                  sx={{
                    fontFamily: tokens.mono,
                    fontSize: 10,
                    color: tokens.ink60,
                    letterSpacing: "1.2px",
                  }}
                >
                  {project.stack.join(" · ")}
                </Box>
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
                  open file -&gt;
                </Box>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

function ProjectHero({ project }: { project: Project }) {
  return (
    <Box sx={{ mt: 3 }}>
      <ProjectThumb project={project} aspect="21 / 9" />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          mt: 3.5,
          gap: 4,
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            fontFamily: tokens.mono,
            fontSize: 10,
            letterSpacing: "1.8px",
            color: tokens.accent,
            textTransform: "uppercase",
          }}
        >
          {project.kind} · {project.role}
        </Box>
        <StatusDot project={project} />
      </Box>
      <Typography
        component="h1"
        sx={{
          fontFamily: tokens.serif,
          fontWeight: 400,
          fontStyle: "italic",
          fontSize: { xs: 56, md: 92 },
          lineHeight: 0.95,
          letterSpacing: { xs: "-1.2px", md: "-2.4px" },
          mt: 1.75,
          mb: 0,
        }}
      >
        {project.name}.
      </Typography>
      <Typography
        component="div"
        sx={{
          fontFamily: tokens.serif,
          fontSize: { xs: 19, md: 22 },
          lineHeight: 1.45,
          mt: 2.75,
          maxWidth: 680,
          color: tokens.ink,
        }}
      >
        {project.tagline}
      </Typography>
    </Box>
  );
}

function ProjectSpecs({ project }: { project: Project }) {
  const cells = [
    ["Started", project.started],
    ["Filed", project.filed],
    ["Stack", project.stack.join(" · ")],
    ["Status", project.status],
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr 1fr", md: `repeat(${cells.length}, 1fr)` },
        gap: { xs: 2.5, md: 3 },
        py: 2.5,
        borderTop: `1px solid ${tokens.hairStrong}`,
        borderBottom: `1px solid ${tokens.hair}`,
      }}
    >
      {cells.map(([label, value]) => (
        <Box key={label}>
          <Box
            sx={{
              fontFamily: tokens.mono,
              fontSize: 9,
              letterSpacing: "1.4px",
              color: tokens.ink60,
              textTransform: "uppercase",
            }}
          >
            {label}
          </Box>
          <Box sx={{ fontFamily: tokens.serif, fontSize: 16, mt: 0.5 }}>{value}</Box>
        </Box>
      ))}
    </Box>
  );
}

export function ProjectDetailReport({
  project,
  previous,
  next,
}: {
  project: Project;
  previous?: Project;
  next?: Project;
}) {
  const opening = project.entries[0]?.b.split(".")[0] ?? project.tagline;

  return (
    <PageShell
      section={`SECTION A · PROJECTS · ${project.slug}`}
      catNo={`file: ${project.slug}.entry`}
      updatedLabel={project.year}
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
          mb: 1,
          "&:hover": { color: tokens.accent },
        }}
      >
        &lt;- Projects
      </Box>

      <ProjectHero project={project} />

      <Box sx={{ mt: 6 }}>
        <ProjectSpecs project={project} />
      </Box>

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
        {project.entries.map((entry) => (
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
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: `repeat(${project.metrics.length}, 1fr)` }, gap: 4 }}>
            {project.metrics.map(([label, value]) => (
              <Box key={label}>
                <Box
                  sx={{
                    fontFamily: tokens.serif,
                    fontSize: { xs: 48, md: 64 },
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
              <Box key={label} sx={{ px: 2.25, py: 1.5, border: `1px solid ${tokens.hairStrong}` }}>
                <Box sx={{ fontFamily: tokens.mono, fontSize: 9, letterSpacing: "1.4px", color: tokens.ink60, textTransform: "uppercase" }}>
                  {label}
                </Box>
                <Box sx={{ fontFamily: tokens.serif, fontSize: 16, fontStyle: "italic", mt: 0.5 }}>
                  {value} -&gt;
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
        pt: 3,
        borderTop: `1px solid ${tokens.hairStrong}`,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 4,
      }}
    >
      {previous ? (
        <Box component={NextLink} href={`/projects/${previous.slug}`} sx={{ color: tokens.ink, textDecoration: "none" }}>
          <Box sx={{ fontFamily: tokens.mono, fontSize: 9, letterSpacing: "1.6px", color: tokens.ink60, textTransform: "uppercase" }}>
            &lt;- Previous
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
            Next -&gt;
          </Box>
          <Box sx={{ fontFamily: tokens.serif, fontSize: 22, fontStyle: "italic", mt: 0.5 }}>{next.name}</Box>
        </Box>
      ) : (
        <Box />
      )}
    </Box>
  );
}
