"use client";
import { useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import PageShell from "@/components/design/PageShell";
import { tokens } from "@/components/design/tokens";
import { POSTS } from "@/data/content";

export default function BlogPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    POSTS.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return ["all", ...Array.from(s)];
  }, []);

  const filtered =
    activeTag && activeTag !== "all"
      ? POSTS.filter((p) => p.tags.includes(activeTag))
      : POSTS;

  return (
    <PageShell
      section="SECTION A · BLOG"
      catNo="file: blog.idx"
      title={
        <>
          Notes, filed by <Box component="span" sx={{ fontStyle: "italic" }}>date.</Box>
        </>
      }
      subtitle={`${POSTS.length} entries · most recent first`}
    >
      <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mb: 4 }}>
        {allTags.map((t) => {
          const active = t === activeTag || (t === "all" && !activeTag);
          return (
            <Box
              key={t}
              component="span"
              onClick={() => setActiveTag(t === activeTag ? null : t)}
              sx={{
                fontFamily: tokens.mono,
                fontSize: 9,
                letterSpacing: "1.4px",
                textTransform: "uppercase",
                padding: "5px 12px",
                cursor: "pointer",
                border: `1px solid ${active ? tokens.accent : tokens.hair}`,
                background: active ? tokens.accent : "transparent",
                color: active ? tokens.paper : tokens.ink,
                transition: "all 180ms",
              }}
            >
              {t}
            </Box>
          );
        })}
      </Box>

      {filtered.map((p) => {
        const number = String(POSTS.length - POSTS.indexOf(p)).padStart(3, "0");
        return (
          <Box
            key={p.title}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "120px 1fr 160px" },
              gap: { xs: 1.5, md: 4 },
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
                fontSize: 10,
                letterSpacing: "1.6px",
                color: tokens.ink60,
                textTransform: "uppercase",
              }}
            >
              <Box>№ {number}</Box>
              <Box sx={{ mt: 0.5 }}>{p.date}</Box>
            </Box>
            <Box>
              <Typography
                component="div"
                sx={{
                  fontFamily: tokens.serif,
                  fontSize: { xs: 24, md: 28 },
                  lineHeight: 1.1,
                  fontStyle: "italic",
                }}
              >
                {p.title}
              </Typography>
              <Typography
                component="div"
                sx={{
                  fontFamily: tokens.serif,
                  fontSize: 15,
                  color: tokens.ink60,
                  mt: 1,
                  lineHeight: 1.5,
                  maxWidth: 660,
                }}
              >
                {p.excerpt}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 0.75,
                flexWrap: "wrap",
                justifyContent: { xs: "flex-start", md: "flex-end" },
              }}
            >
              {p.tags.map((t) => (
                <Box
                  key={t}
                  component="span"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTag(t);
                  }}
                  sx={{
                    fontFamily: tokens.mono,
                    fontSize: 8,
                    letterSpacing: "1.4px",
                    color: tokens.accent,
                    border: `1px solid ${tokens.accent}`,
                    padding: "2px 8px",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  {t}
                </Box>
              ))}
            </Box>
          </Box>
        );
      })}
    </PageShell>
  );
}
