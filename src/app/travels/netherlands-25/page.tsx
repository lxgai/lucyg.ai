"use client";
import { Box, Link as MuiLink } from "@mui/material";
import NextLink from "next/link";
import PageShell from "@/components/design/PageShell";
import { tokens } from "@/components/design/tokens";

export default function Netherlands25Page() {
  return (
    <PageShell
      section="SECTION B · TRAVELS / NETHERLANDS"
      catNo="03 / 2025 · 7 days"
      title={
        <>
          Netherlands<Box component="span" sx={{ color: tokens.accent }}>.</Box>
        </>
      }
      subtitle="Amsterdam · Utrecht"
    >
      <Box
        sx={{
          fontFamily: tokens.serif,
          fontSize: 18,
          color: tokens.ink60,
          maxWidth: 560,
          lineHeight: 1.6,
        }}
      >
        This trip isn&apos;t filed yet. A week of canals, by bike, mostly — notes to
        follow.
      </Box>
      <Box sx={{ mt: 3 }}>
        <MuiLink
          component={NextLink}
          href="/travels"
          underline="none"
          sx={{
            fontFamily: tokens.mono,
            fontSize: 10,
            letterSpacing: "1.4px",
            color: tokens.ink60,
            textTransform: "uppercase",
          }}
        >
          ← back to travels
        </MuiLink>
      </Box>
    </PageShell>
  );
}
