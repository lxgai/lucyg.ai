"use client";

import { Box } from "@mui/material";
import Header from "@/components/Header";
import CollageLayout from "@/components/CollageLayout";
import layoutData from "@/data/travels/japan-24.json";
import { CollageLayoutData } from "@/types/collage";

export default function Japan24Page() {
  return (
    <Box
      sx={{
        minHeight: "100svh",
        width: "100vw",
        position: "relative",
        backgroundColor: "#f5ede6",
        overflowX: "hidden",
      }}
    >
      <Header />

      <Box
        sx={{
          px: { xs: "24px", md: "72px" },
          pt: { xs: 4, md: 12 },
          boxSizing: "border-box",
        }}
      >
        <Box sx={{ maxWidth: `${1920 * 1.6}px`, mx: "auto" }}>
          <CollageLayout layout={layoutData as CollageLayoutData} />
        </Box>
      </Box>
    </Box>
  );
}
