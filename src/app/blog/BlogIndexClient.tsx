"use client";

import { useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import NextLink from "next/link";
import { tokens } from "@/components/design/tokens";
import type { BlogEntry } from "@/types/blog";

function compactDate(date: string) {
  return date.replace(/\s*\/\s*/g, "/");
}

export default function BlogIndexClient({ entries }: { entries: BlogEntry[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    entries.forEach((entry) => entry.tags.forEach((tag) => tags.add(tag)));
    return ["all", ...Array.from(tags)];
  }, [entries]);

  const filtered =
    activeTag && activeTag !== "all"
      ? entries.filter((entry) => entry.tags.includes(activeTag))
      : entries;

  return (
    <>
      <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mb: 4 }}>
        {allTags.map((tag) => {
          const active = tag === activeTag || (tag === "all" && !activeTag);
          return (
            <Box
              key={tag}
              component="button"
              type="button"
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
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
              {tag}
            </Box>
          );
        })}
      </Box>

      {filtered.map((entry) => {
        const number = String(entries.length - entries.indexOf(entry)).padStart(3, "0");
        return (
          <Box
            key={entry.slug}
            component={NextLink}
            href={`/blog/${entry.slug}`}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "120px 1fr 160px" },
              gap: { xs: 1.5, md: 4 },
              p: "22px 0",
              borderBottom: `1px solid ${tokens.hair}`,
              alignItems: { md: "baseline" },
              cursor: "pointer",
              color: tokens.ink,
              textDecoration: "none",
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
              <Box>No. {number}</Box>
              <Box sx={{ mt: 0.5 }}>{compactDate(entry.date)}</Box>
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
                {entry.title}
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
                {entry.excerpt}
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
              {entry.tags.map((tag) => (
                <Box
                  key={tag}
                  component="span"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setActiveTag(tag);
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
                  {tag}
                </Box>
              ))}
            </Box>
          </Box>
        );
      })}
    </>
  );
}
