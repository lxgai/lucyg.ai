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
  const normalizedUpdatedLabel =
    typeof updatedLabel === "string"
      ? updatedLabel.replace(/\s*·\s*/g, "·")
      : updatedLabel;

  return (
    <PageContainer sx={sx}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          fontFamily: tokens.mono,
          fontSize: 10,
          letterSpacing: "1.6px",
          color: tokens.ink60,
          textTransform: "uppercase",
          py: 1,
          flexWrap: "nowrap",
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
            whiteSpace: "nowrap",
          }}
        >
          {section}
        </Box>
        <Box
          component="span"
          sx={{
            display: "flex",
            gap: 1.5,
            alignItems: "center",
            justifyContent: "flex-end",
            minWidth: 0,
          }}
        >
          {catNo && (
            <Box
              component="span"
              sx={{ display: { xs: "none", md: "inline" }, whiteSpace: "nowrap" }}
            >
              {catNo}
            </Box>
          )}
          {catNo && updatedLabel && (
            <Box
              component="span"
              aria-hidden
              sx={{
                display: { xs: "none", md: "inline-block" },
                width: 11,
                borderBottom: `1px dotted ${tokens.hairStrong}`,
                transform: "translateY(1px)",
                flex: "0 0 auto",
              }}
            />
          )}
          {updatedLabel && (
            <Box
              component="span"
              sx={{ display: { xs: "none", md: "inline" }, whiteSpace: "nowrap" }}
            >
              {normalizedUpdatedLabel}
            </Box>
          )}
          {extra && <Box component="span">{extra}</Box>}
        </Box>
      </Box>
    </PageContainer>
  );
}
