"use client";
import { Box, Typography } from "@mui/material";
import PageShell from "@/components/design/PageShell";
import { tokens } from "@/components/design/tokens";
import { PROJECTS } from "@/data/content";

export default function ProjectsPage() {
  return (
    <PageShell
      section="SECTION B · PROJECTS"
      catNo="file: projects.idx"
      title={
        <>
          Things I&apos;ve <Box component="span" sx={{ fontStyle: "italic" }}>made.</Box>
        </>
      }
      subtitle={`${PROJECTS.length} entries · solo + collab`}
    >
      <Box
        sx={{
          display: { xs: "none", md: "grid" },
          gridTemplateColumns: "80px 2fr 1.4fr 1fr 0.9fr",
          gap: 3,
          p: "12px 0",
          borderBottom: `1px solid ${tokens.hairStrong}`,
          fontFamily: tokens.mono,
          fontSize: 9,
          letterSpacing: "1.4px",
          color: tokens.ink60,
          textTransform: "uppercase",
        }}
      >
        <span>Year</span>
        <span>Title / role</span>
        <span>Kind</span>
        <span>Stack</span>
        <span>Status</span>
      </Box>

      {PROJECTS.map((p) => {
        const statusLive = p.status === "live" || p.status === "shipping";
        return (
          <Box
            key={p.name}
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "80px 2fr 1.4fr 1fr 0.9fr",
              },
              gap: { xs: 1.25, md: 3 },
              p: "22px 0",
              borderBottom: `1px solid ${tokens.hair}`,
              alignItems: { md: "baseline" },
              cursor: "pointer",
              transition: "background 180ms",
              "&:hover": { background: "rgba(31,26,22,0.02)" },
            }}
          >
            <Box
              sx={{
                fontFamily: tokens.mono,
                fontSize: 11,
                color: tokens.ink60,
              }}
            >
              {p.year}
            </Box>

            <Box>
              <Typography
                component="div"
                sx={{
                  fontFamily: tokens.serif,
                  fontSize: 24,
                  fontStyle: "italic",
                  lineHeight: 1.1,
                }}
              >
                {p.name}
              </Typography>
              <Box
                sx={{
                  fontFamily: tokens.mono,
                  fontSize: 9,
                  color: tokens.ink60,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  mt: 0.5,
                }}
              >
                {p.role}
              </Box>
            </Box>

            <Box
              sx={{
                fontFamily: tokens.serif,
                fontSize: 15,
                color: tokens.ink,
              }}
            >
              {p.kind}
            </Box>

            <Box
              sx={{
                fontFamily: tokens.mono,
                fontSize: 10,
                color: tokens.ink60,
                lineHeight: 1.6,
              }}
            >
              {p.stack.join(" · ")}
            </Box>

            <Box
              sx={{
                fontFamily: tokens.mono,
                fontSize: 9,
                letterSpacing: "1.4px",
                textTransform: "uppercase",
                color: statusLive ? tokens.accent : tokens.ink60,
              }}
            >
              ● {p.status}
            </Box>
          </Box>
        );
      })}
    </PageShell>
  );
}
