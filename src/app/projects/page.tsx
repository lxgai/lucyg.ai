"use client";
import { Box, Typography } from "@mui/material";
import Header from "@/components/Header";

export default function ProjectsPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        backgroundColor: "#f5ede6",
        overflow: "hidden",
      }}
    >
      <Header />

      <Box
        sx={{
          pt: { xs: 16, sm: 16, md: 20, lg: 20, xl: 20 },
          display: "flex",
          justifyContent: "left",
          alignItems: "flex-start",
          ml: 12,
        }}
      >
        <Typography
          sx={{
            fontFamily: "var(--font-vt323), monospace",
            fontSize: { xs: ".5rem", sm: ".5rem", md: "1.2rem", lg: "1.2rem", xl: "1.2rem" },
          }}
        >
          Coming soon
        </Typography>
      </Box>
    </Box>
  );
}
