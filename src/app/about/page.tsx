"use client";

import { Box, Link as MuiLink, Typography } from "@mui/material";
import Image from "next/image";
import PageShell from "@/components/design/PageShell";
import { Hair } from "@/components/design/primitives";
import { tokens } from "@/components/design/tokens";
import { resolveSiteImageSrc } from "@/lib/images";

const SOCIALS = [
  { label: "Instagram", url: "https://instagram.com/lucy.gai", logo: "/images/about/instagram-logo.png" },
  { label: "Letterboxd", url: "https://letterboxd.com/lucy_gai/", logo: "/images/about/letterboxd-logo.png" },
  { label: "Spotify", url: "https://open.spotify.com/user/charlottefour", logo: "/images/about/spotify-logo.png" },
  { label: "GitHub", url: "https://github.com/lxgai", icon: "github" },
  { label: "Email", url: "mailto:hello@lucygai.com", icon: "email" },
] as const;

const CURRENTLY: Array<[string, React.ReactNode]> = [
  ["Reading", <><em>Neuromancer</em> — William Gibson</>],
  ["Dreaming", "moving to New York City (one day)"],
  ["Building", "this site, and a minimal planning app"],
  ["Planning", "London in June, China in October"],
];

export default function AboutPage() {
  return (
    <PageShell
      section="SECTION E · ABOUT"
      catNo="REF. E-IDX"
      updatedLabel="UPDATED 06 · 12 · 26"
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 3fr) minmax(clamp(420px, 40vw, 800px), 1fr)",
          columnGap: 7,
          rowGap: 5,
          pt: { xs: 3.5, md: 4 },
          "@media (max-width: 767px)": {
            gridTemplateColumns: "1fr",
            gap: 5,
          },
        }}
      >
        <Box
          sx={{
            "@media (max-width: 767px)": {
              display: "contents",
            },
          }}
        >
          <Box
            sx={{
              "@media (max-width: 767px)": {
                order: 1,
              },
            }}
          >
            <Typography
              component="div"
              sx={{
                fontFamily: tokens.serif,
                fontSize: { xs: 28, md: 48 },
                lineHeight: 1.2,
                letterSpacing: "-0.6px",
                fontWeight: 400,
                color: tokens.ink,
              }}
            >
              Hi! My name is <Box component="span" sx={{ fontStyle: "italic" }}>Lucy Gai</Box>.
            </Typography>

            <Typography
              component="p"
              sx={{
                fontFamily: tokens.serif,
                fontSize: { xs: 18, md: 28 },
                lineHeight: { xs: 1.45, md: 1.35 },
                letterSpacing: { xs: 0, md: "-0.3px" },
                fontWeight: 400,
                color: tokens.ink,
                mt: 3,
                mb: 0,
              }}
            >
              I&apos;m currently a software engineer working in financial services, 
              but recently have started building and writing outside that.
               Previously, I was at the <Box component="span" sx={{ fontStyle: "italic" }}>University of California, San Diego</Box>.
               <br></br>
               <br></br>
               Consider this is an archive for a mind that wanders frequently, a fun external memory for the thoughts, trips, and projects I find noteworthy and want to write to disk.
            </Typography>
          </Box>

          <Box
            sx={{
              "@media (max-width: 767px)": {
                order: 3,
              },
            }}
          >
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
                gridTemplateColumns: { xs: "100px 1fr", sm: "120px 1fr" },
                gap: { xs: "10px 20px", md: "12px 28px" },
                fontSize: 15,
                lineHeight: 1.5,
              }}
            >
              {CURRENTLY.map(([label, value]) => (
                <Box key={label} sx={{ display: "contents" }}>
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
                    {label}
                  </Box>
                  <Box component="span">{value}</Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            background: tokens.paperCard,
            border: `1px solid ${tokens.hairStrong}`,
            p: { xs: 3, md: 4 },
            position: "relative",
            height: "fit-content",
            justifySelf: "center",
            boxSizing: "border-box",
            width: { xs: "100%", sm: 414 },
            maxWidth: "100%",
            "@media (max-width: 767px)": {
              order: 2,
            },
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

          <Box
            sx={{
              fontFamily: tokens.mono,
              fontSize: 9,
              letterSpacing: "1.6px",
              color: tokens.ink,
              display: "flex",
              gap: 1.25,
              textTransform: "uppercase",
              flexWrap: "wrap",
            }}
          >
            <span>REF. E-001</span>
            <span>LIKENESS.PNG</span>
          </Box>

          <Box
            sx={{
              display: "block",
              width: "100%",
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

          <Box
            sx={{
              fontFamily: tokens.serif,
              fontSize: 16,
              lineHeight: 1.5,
              mb: 2,
            }}
          >
            Feel free to reach out — I&apos;m also on:
          </Box>

          {SOCIALS.map((social) => (
            <MuiLink
              key={social.label}
              href={social.url}
              target={social.url.startsWith("mailto:") ? undefined : "_blank"}
              rel={social.url.startsWith("mailto:") ? undefined : "noreferrer"}
              underline="none"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.625,
                color: tokens.ink,
                py: 0.875,
                cursor: "pointer",
                "&:hover": {
                  "& .network": { color: tokens.accent },
                },
              }}
            >
              <Box
                component="span"
                sx={{
                  width: 22,
                  height: 22,
                  flex: "0 0 auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {"logo" in social ? (
                  <Image
                    src={resolveSiteImageSrc(social.logo)}
                    alt=""
                    width={22}
                    height={22}
                    unoptimized
                    style={{ display: "block", objectFit: "contain" }}
                  />
                ) : social.icon === "github" ? (
                  <GitHubLogo />
                ) : (
                  <EnvelopeIcon />
                )}
              </Box>
              <Box
                className="network"
                sx={{
                  fontFamily: tokens.mono,
                  fontSize: 11,
                  letterSpacing: "1.4px",
                  textTransform: "uppercase",
                  color: tokens.ink,
                  transition: "color 180ms ease",
                }}
              >
                {social.label}
              </Box>
            </MuiLink>
          ))}
        </Box>
      </Box>
    </PageShell>
  );
}

function GitHubLogo() {
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      sx={{ display: "block", width: 22, height: 22, fill: tokens.ink }}
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18A10.96 10.96 0 0 1 12 6.01c.98 0 1.96.13 2.88.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.05.78 2.12v3.19c0 .31.21.67.79.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </Box>
  );
}

function EnvelopeIcon() {
  return (
    <Box
      component="svg"
      viewBox="0 0 256 256"
      aria-hidden="true"
      sx={{ display: "block", width: 22, height: 22, fill: tokens.ink }}
    >
      <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z" />
    </Box>
  );
}
