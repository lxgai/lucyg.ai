"use client";
import { Box, Typography, Link as MuiLink } from "@mui/material";
import Image from "next/image";
import PageShell from "@/components/design/PageShell";
import { CardLabel, Hair } from "@/components/design/primitives";
import { tokens } from "@/components/design/tokens";
import { resolveSiteImageSrc } from "@/lib/images";

const SOCIALS = [
  { label: "Instagram", handle: "@lucy.gai",         url: "https://instagram.com/lucy.gai" },
  { label: "Letterboxd", handle: "lucy_gai",         url: "https://letterboxd.com/lucy_gai/" },
  { label: "Spotify",   handle: "charlottefour",     url: "https://open.spotify.com/user/charlottefour" },
  { label: "Twitch",    handle: "88lucie",           url: "https://twitch.tv/88lucie" },
  { label: "Email",     handle: "hello@lucygai.com", url: "mailto:hello@lucygai.com" },
];

const CURRENTLY: Array<[string, React.ReactNode]> = [
  ["Reading",   <><em>Neuromancer</em> — William Gibson</>],
  ["Listening", "nolimit, — Knock2"],
  ["Building",  "this site, and a minimal app for planning"],
  ["Planning",  "London in June, China in October"],
];

export default function AboutPage() {
  return (
    <PageShell section="SECTION E · ABOUT" catNo="file: about.idx">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
          gap: { xs: 5, md: 7 },
          pt: { xs: 3, md: 4 },
        }}
      >
        <Box>
          <Typography
            component="div"
            sx={{
              fontFamily: tokens.serif,
              fontSize: { xs: 30, sm: 36, md: 48 },
              lineHeight: 1.2,
              letterSpacing: "-0.6px",
              fontWeight: 400,
              color: tokens.ink,
            }}
          >
            Hi! I&apos;m <Box component="span" sx={{ fontStyle: "italic" }}>Lucy</Box> — a
            software engineer in{" "}
            <Box component="span" sx={{ fontStyle: "italic" }}>the US</Box>,
            currently building tools and cataloging the things I love
            here.
          </Typography>

          <Hair style={{ margin: "40px 0" }} />

          <Box
            sx={{
              fontFamily: tokens.mono,
              fontSize: 11,
              letterSpacing: "1.2px",
              color: tokens.ink60,
              textTransform: "uppercase",
              mb: 1.75,
            }}
          >
            Currently
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "100px 1fr", md: "120px 1fr" },
              gap: { xs: "10px 20px", md: "12px 28px" },
              fontSize: 15,
              lineHeight: 1.5,
            }}
          >
            {CURRENTLY.map(([k, v], i) => (
              <Box key={`${k}-${i}`} sx={{ display: "contents" }}>
                <Box
                  component="span"
                  sx={{
                    fontFamily: tokens.mono,
                    fontSize: 10,
                    color: tokens.ink60,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    pt: 0.4,
                  }}
                >
                  {k}
                </Box>
                <Box component="span">{v}</Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            background: tokens.paperCard,
            border: `1px solid ${tokens.hairStrong}`,
            p: { xs: 3, md: 4 },
            position: "relative",
            height: "fit-content",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -12,
              left: 20,
              background: tokens.paper,
              padding: "2px 12px",
              fontFamily: tokens.mono,
              fontSize: 9,
              letterSpacing: "1.6px",
              color: tokens.ink60,
              textTransform: "uppercase",
              border: `1px solid ${tokens.hairStrong}`,
            }}
          >
            Contact index
          </Box>

          <CardLabel cat="E" no="001" date="04 · 22 · 26" />

          <Box
            sx={{
              display: "block",
              width: 350,
              maxWidth: "100%",
              mt: 2.25,
            }}
          >
            <Image
              src={resolveSiteImageSrc("/images/home/selfie2_dithered.png")}
              alt="Self-portrait"
              width={350}
              height={350}
              unoptimized
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                imageRendering: "pixelated",
              }}
            />
          </Box>

          <Hair style={{ margin: "22px 0" }} />

          {SOCIALS.map((s, i) => (
            <MuiLink
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              underline="none"
              sx={{
                display: "grid",
                gridTemplateColumns: "110px 1fr auto",
                alignItems: "baseline",
                color: tokens.ink,
                p: "12px 0",
                borderBottom:
                  i < SOCIALS.length - 1 ? `1px dashed ${tokens.hair}` : "none",
                "&:hover": {
                  "& .handle": { color: tokens.accent },
                },
              }}
            >
              <Box
                component="span"
                sx={{
                  fontFamily: tokens.mono,
                  fontSize: 9,
                  letterSpacing: "1.4px",
                  color: tokens.ink60,
                  textTransform: "uppercase",
                }}
              >
                {s.label}
              </Box>
              <Box
                className="handle"
                sx={{
                  fontFamily: tokens.serif,
                  fontSize: 16,
                  fontStyle: "italic",
                  transition: "color 180ms",
                }}
              >
                {s.handle}
              </Box>
              <Box
                component="span"
                sx={{ fontFamily: tokens.mono, fontSize: 11, color: tokens.accent }}
              >
                ↗
              </Box>
            </MuiLink>
          ))}
        </Box>
      </Box>
    </PageShell>
  );
}
