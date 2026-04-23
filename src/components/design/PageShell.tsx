"use client";
import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";
import Nav from "./Nav";
import { LAST_UPDATED, tokens } from "./tokens";

type PageShellProps = {
  children: ReactNode;
  section?: string;
  catNo?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  updatedLabel?: string;
};

export default function PageShell({
  children,
  section,
  catNo,
  title,
  subtitle,
  updatedLabel = `UPDATED ${LAST_UPDATED}`,
}: PageShellProps) {
  return (
    <Box
      className="page-fade paper-a"
      sx={{
        minHeight: "100svh",
        fontFamily: tokens.serif,
        color: tokens.ink,
      }}
    >
      <Nav />

      {section && (
        <Box sx={{ px: { xs: 4, md: 10, lg: 13 }, pt: { xs: 3, md: 4.5 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
              fontFamily: tokens.mono,
              fontSize: { xs: 9, md: 10 },
              letterSpacing: "1.6px",
              color: tokens.ink60,
              textTransform: "uppercase",
              py: 1,
              borderTop: `1px solid ${tokens.hairStrong}`,
              borderBottom: `1px solid ${tokens.hairStrong}`,
              flexWrap: "wrap",
            }}
          >
            <Box component="span" sx={{ color: tokens.accent }}>
              {section}
            </Box>
            {catNo && <Box component="span">{catNo}</Box>}
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
              {updatedLabel}
            </Box>
          </Box>
        </Box>
      )}

      {(title || subtitle) && (
        <Box sx={{ px: { xs: 4, md: 10, lg: 13 }, pt: { xs: 5, md: 6 }, pb: { xs: 3, md: 4 } }}>
          {title && (
            <Typography
              component="h1"
              sx={{
                fontFamily: tokens.serif,
                fontWeight: 400,
                fontSize: { xs: 48, sm: 64, md: 84 },
                lineHeight: 0.95,
                letterSpacing: "-2px",
                color: tokens.ink,
                m: 0,
              }}
            >
              {title}
            </Typography>
          )}
          {subtitle && (
            <Box
              sx={{
                fontFamily: tokens.mono,
                fontSize: 11,
                color: tokens.ink60,
                mt: 2,
                letterSpacing: "1.4px",
                textTransform: "uppercase",
              }}
            >
              {subtitle}
            </Box>
          )}
        </Box>
      )}

      <Box
        sx={{
          px: { xs: 4, md: 10, lg: 13 },
          pt: title || subtitle ? 0 : { xs: 3, md: 3 },
          pb: { xs: 8, md: 10 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
