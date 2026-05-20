"use client";
import { Box, Typography, Link as MuiLink } from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import Nav from "@/components/design/Nav";
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

      <Box sx={{ px: { xs: 4, md: 10, lg: 13 }, pt: { xs: 3, md: 4 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
            fontFamily: tokens.mono,
            fontSize: { xs: 9, md: 10 },
            letterSpacing: "1.6px",
            color: tokens.ink60,
            textTransform: "uppercase",
            py: 1,
            borderTop: `1px solid ${tokens.hairStrong}`,
            borderBottom: `1px solid ${tokens.hairStrong}`,
          }}
        >
          <Box component="span">Personal archive · vol. 01</Box>
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            file: home.idx
          </Box>
          <Box component="span">{updatedLabel}</Box>
        </Box>
      </Box>

      <Box
        sx={{
          px: { xs: 4, md: 10, lg: 13 },
          pt: { xs: 6, md: 9 },
          pb: { xs: 8, md: 10 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
          gap: { xs: 6, md: 9 },
        }}
      >
        <Box>
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
            <Box component="span" sx={{ fontStyle: "italic" }}>
              I&apos;m Lucy.
            </Box>
          </Typography>

          <Typography
            sx={{
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
            <Box
              sx={{
                fontFamily: tokens.mono,
                fontSize: 10,
                color: tokens.ink60,
                letterSpacing: "1.4px",
                textTransform: "uppercase",
              }}
            >
              5 sections · updated weekly
            </Box>
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

        <Box
          sx={{
            position: "relative",
            pt: { xs: 2, md: 5 },
            minHeight: { xs: 440, md: 560 },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 40,
              left: 50,
              right: 20,
              bottom: 60,
              background: tokens.paperDeep,
              transform: "rotate(-1.8deg)",
              border: `1px solid ${tokens.hairStrong}`,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 30,
              left: 20,
              right: 40,
              bottom: 80,
              background: "#eae1d2",
              transform: "rotate(1.4deg)",
              border: `1px solid ${tokens.hairStrong}`,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 10,
              left: 30,
              right: 10,
              bottom: 40,
              background: tokens.paperCard,
              border: `1px solid ${tokens.hairStrong}`,
              p: 2,
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                flex: 1,
                position: "relative",
                overflow: "hidden",
                background: tokens.paperDeep,
              }}
            >
              <Image
                src={resolveSiteImageSrc("/images/home/selfie1.png")}
                alt="Self-portrait"
                fill
                sizes="(max-width: 900px) 90vw, 420px"
                style={{ objectFit: "cover", filter: "sepia(0.15) saturate(0.9)" }}
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
                  fontFamily: tokens.serif,
                  fontStyle: "italic",
                  fontSize: 17,
                  color: tokens.ink,
                }}
              >
                Self-portrait, spring
              </Box>
              <CardLabel cat="A" no="001" />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
