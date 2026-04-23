"use client";
import { Box } from "@mui/material";
import PageShell from "@/components/design/PageShell";
import { tokens } from "@/components/design/tokens";

export default function LinksPage() {
  return (
    <PageShell
      section="SECTION G · LINKS"
      catNo="file: links.idx"
      title="Links"
      subtitle="The contact index lives on About."
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
        Head to <Box component="span" sx={{ fontStyle: "italic" }}>About</Box> for
        Instagram, Letterboxd, Spotify, Twitch, and email.
      </Box>
    </PageShell>
  );
}
