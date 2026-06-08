"use client";

import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";
import { LAST_UPDATED, tokens } from "./tokens";

export const pageGutters = { xs: 4, md: 10, lg: 13 } as const;

export function PageContainer({
  children,
  sx,
}: {
  children: ReactNode;
  sx?: SxProps<Theme>;
}) {
  return (
    <Box
      sx={[
        {
          width: "100%",
          px: pageGutters,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {children}
    </Box>
  );
}

export function MetadataStrip({
  section,
  catNo,
  updatedLabel = `UPDATED ${LAST_UPDATED}`,
  extra,
  sx,
}: {
  section: ReactNode;
  catNo?: ReactNode;
  updatedLabel?: ReactNode;
  extra?: ReactNode;
  sx?: SxProps<Theme>;
}) {
  return (
    <PageContainer sx={sx}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          fontFamily: tokens.mono,
          fontSize: { xs: 9, md: 10 },
          letterSpacing: "1.6px",
          color: tokens.ink60,
          textTransform: "uppercase",
          py: 1,
          flexWrap: "wrap",
        }}
      >
        <Box
          component="span"
          sx={{
            background: tokens.accent,
            color: tokens.paperCard,
            px: "11px",
            py: "4px",
            letterSpacing: "1.6px",
            alignSelf: "center",
          }}
        >
          {section}
        </Box>
        <Box
          component="span"
          sx={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "flex-end" }}
        >
          {catNo && <Box component="span">{catNo}</Box>}
          {updatedLabel && (
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
              {updatedLabel}
            </Box>
          )}
          {extra && <Box component="span">{extra}</Box>}
        </Box>
      </Box>
    </PageContainer>
  );
}
