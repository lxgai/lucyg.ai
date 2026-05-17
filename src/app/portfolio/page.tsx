"use client";
import { Box } from "@mui/material";
import PageShell from "@/components/design/PageShell";
import { tokens } from "@/components/design/tokens";

export default function PortfolioPage() {
  return (
    <PageShell
      section="SECTION A · PORTFOLIO"
      catNo="file: portfolio.idx"
      title={
        <>
          The <Box component="span" sx={{ fontStyle: "italic" }}>long</Box> version.
        </>
      }
      subtitle="Being written."
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
        In the meantime, the shortlist lives under{" "}
        <Box component="span" sx={{ fontStyle: "italic" }}>Projects</Box>.
      </Box>
    </PageShell>
  );
}
