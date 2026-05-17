"use client";
import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { getPageUpdatedLabel } from "@/data/page-updated";
import Nav from "./Nav";
import { MetadataStrip, PageContainer } from "./layout";
import { tokens } from "./tokens";

type PageShellProps = {
  children: ReactNode;
  section?: string;
  catNo?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  updatedLabel?: string;
  metadataExtra?: ReactNode;
  contentPadding?: boolean;
  contentSx?: SxProps<Theme>;
};

export default function PageShell({
  children,
  section,
  catNo,
  title,
  subtitle,
  updatedLabel,
  metadataExtra,
  contentPadding = true,
  contentSx,
}: PageShellProps) {
  const pathname = usePathname();
  const resolvedUpdatedLabel = updatedLabel ?? getPageUpdatedLabel(pathname);

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
        <MetadataStrip
          section={section}
          catNo={catNo}
          updatedLabel={resolvedUpdatedLabel}
          extra={metadataExtra}
          sx={{ pt: { xs: 3, md: 4.5 } }}
        />
      )}

      {(title || subtitle) && (
        <PageContainer sx={{ pt: { xs: 5, md: 6 }, pb: { xs: 3, md: 4 } }}>
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
        </PageContainer>
      )}

      <Box sx={contentSx}>
        {contentPadding ? (
          <PageContainer
            sx={{
              pt: title || subtitle ? 0 : { xs: 3, md: 3 },
              pb: { xs: 8, md: 10 },
            }}
          >
            {children}
          </PageContainer>
        ) : (
          children
        )}
      </Box>
    </Box>
  );
}
