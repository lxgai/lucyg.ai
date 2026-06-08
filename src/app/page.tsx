"use client";
import { Box, Typography, Link as MuiLink } from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import Nav from "@/components/design/Nav";
import { MetadataStrip } from "@/components/design/layout";
import { CardLabel } from "@/components/design/primitives";
import { getPageUpdatedLabel } from "@/data/page-updated";
import { tokens } from "@/components/design/tokens";
import { resolveSiteImageSrc } from "@/lib/images";

const QUICK_LINKS = [
  { label: "Latest writing", sub: "on keeping a slow internet", to: "/blog" },
  { label: "Recently played", sub: "nolimit, — Knock2", to: "/favorites" },
  { label: "Where I've been", sub: "Amsterdam, Mar 2025", to: "/travels" },
  { label: "What I'm making", sub: "this site, Fieldnotes", to: "/projects" },
];

export default function Home() {
  const updatedLabel = getPageUpdatedLabel("/");

  return (
    <Box
      className="page-fade paper-a"
      sx={{ minHeight: "100svh", fontFamily: tokens.serif, color: tokens.ink }}
    >
      <Nav />

      <MetadataStrip
        section="Personal archive · vol. 01"
        catNo="REF. 00"
        updatedLabel={updatedLabel}
        sx={{ pt: { xs: 3, md: 4 } }}
      />

      <Box
        sx={{
          px: { xs: 4, md: 10, lg: 13 },
          pt: { xs: 6, md: 9 },
          pb: { xs: 8, md: 10 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 620px) 1fr" },
          columnGap: { md: 9 },
          rowGap: { xs: 4, md: 0 },
          alignItems: "start",
        }}
      >
        {/* Intro text — column 1, row 1 on desktop */}
        <Box sx={{ gridColumn: { md: "1" }, minWidth: 0 }}>
          <Box
            sx={{
              fontFamily: tokens.mono,
              fontSize: 10,
              letterSpacing: "2px",
              color: tokens.accent,
              textTransform: "uppercase",
              mb: 3.5,
            }}
          >
            ENTRY 001 ·····  A COLLECTION
          </Box>

          <Typography
            component="div"
            sx={{
              fontFamily: tokens.serif,
              fontSize: { xs: 72, sm: 96, md: 128 },
              lineHeight: 0.92,
              letterSpacing: "-3px",
              fontWeight: 400,
              color: tokens.ink,
            }}
          >
            Hi,
            <br />
            <Box component="span">I&apos;m Lucy.</Box>
          </Typography>

          <Typography
            sx={{
              fontFamily: tokens.serif,
              mt: 5,
              maxWidth: 480,
              fontSize: { xs: 17, md: 19 },
              lineHeight: 1.55,
              color: tokens.ink,
            }}
          >
            A software engineer cataloging the things I love — trips, records, films, and
            the small projects in between. This site is a room I keep returning to.
          </Typography>
        </Box>

        {/* Frameless dithered photo — column 2 on desktop (spans the two text rows);
            in source order between the intro and the CTA on mobile */}
        <Box
          sx={{
            gridColumn: { md: "2" },
            gridRow: { md: "1 / span 2" },
            alignSelf: "start",
            justifySelf: { md: "center" },
            pt: { xs: 0, md: 5 },
            width: "100%",
            maxWidth: { xs: 360, md: 700 },
            mx: { xs: "auto", md: 0 },
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "1 / 1",
              overflow: "hidden",
              background: tokens.paperDeep,
            }}
          >
            <Image
              src={resolveSiteImageSrc("/images/home/selfie_dithered.png")}
              alt="Self-portrait"
              fill
              sizes="(max-width: 900px) 90vw, 700px"
              unoptimized
              style={{
                objectFit: "cover",
                objectPosition: "center 42%",
                imageRendering: "pixelated",
              }}
              priority
            />
          </Box>
          <Box
            sx={{
              mt: 1.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 2,
            }}
          >
            <Box
              sx={{
                fontFamily: tokens.mono,
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: tokens.ink60,
              }}
            >
              Archivist.png, 8x8 Bayer Dither
            </Box>
            <CardLabel cat="A" no="001" />
          </Box>
        </Box>

        {/* CTA + Lately — column 1, row 2 on desktop */}
        <Box sx={{ gridColumn: { md: "1" }, minWidth: 0 }}>
          <Box
            sx={{
              mt: 5.5,
              display: "flex",
              gap: 2.5,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <MuiLink
              component={NextLink}
              href="/about"
              underline="none"
              sx={{
                px: 3.5,
                py: 1.75,
                background: tokens.ink,
                color: tokens.paper,
                fontFamily: tokens.mono,
                fontSize: 11,
                letterSpacing: "1.6px",
                textTransform: "uppercase",
                transition: "opacity 180ms",
                "&:hover": { opacity: 0.88 },
              }}
            >
              More about me →
            </MuiLink>
          </Box>

          <Box sx={{ mt: 8 }}>
            <Box
              sx={{
                fontFamily: tokens.mono,
                fontSize: 10,
                letterSpacing: "1.6px",
                color: tokens.ink60,
                textTransform: "uppercase",
                mb: 2,
              }}
            >
              ━━ Lately
            </Box>
            <Box>
              {QUICK_LINKS.map((q) => (
                <MuiLink
                  key={q.to}
                  component={NextLink}
                  href={q.to}
                  underline="none"
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    alignItems: "baseline",
                    color: tokens.ink,
                    p: "14px 0",
                    borderBottom: `1px solid ${tokens.hair}`,
                    transition: "background 180ms",
                    "&:hover": { background: "rgba(31,26,22,0.04)" },
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        fontFamily: tokens.serif,
                        fontSize: 22,
                        fontStyle: "italic",
                        color: tokens.ink,
                      }}
                    >
                      {q.label}
                    </Box>
                    <Box
                      sx={{
                        fontFamily: tokens.mono,
                        fontSize: 10,
                        color: tokens.ink60,
                        mt: 0.5,
                        letterSpacing: "1px",
                      }}
                    >
                      {q.sub}
                    </Box>
                  </Box>
                  <Box
                    component="span"
                    sx={{ fontFamily: tokens.mono, fontSize: 12, color: tokens.accent }}
                  >
                    ↗
                  </Box>
                </MuiLink>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
