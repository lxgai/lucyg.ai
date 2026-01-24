"use client";
import { Box, Stack, Typography, Link as MuiLink } from "@mui/material";
import Image from "next/image";
import Header from "@/components/Header";

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/lucy.gai",
    icon: "/images/about/instagram-logo.png",
  },
  {
    label: "Spotify",
    href: "https://open.spotify.com/user/charlottefour?si=dc89b15e82cf438b",
    icon: "/images/about/spotify-logo.png",
  },
  {
    label: "Letterboxd",
    href: "https://letterboxd.com/lucy_gai/",
    icon: "/images/about/letterboxd-logo.png",
  },
  {
    label: "Twitch",
    href: "https://www.twitch.tv/88lucie",
    icon: "/images/about/twitch-logo.png",
  },
  {
    label: "hello@lucygai.com",
    href: "mailto:hello@lucygai.com",
  },
];

export default function AboutPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        backgroundColor: "#f5ede6",
        overflow: "hidden",
      }}
    >
      <Header />

      <Box
        sx={{
          pt: { xs: 18, sm: 18, md: 20, lg: 20, xl: 20 },
          pb: { xs: 10, sm: 10, md: 12, lg: 12, xl: 12 },
          px: { xs: 3, sm: 4, md: 6, lg: 8, xl: 10 },
          width: "min(92vw, 1920px)",
          maxWidth: "100%",
          mx: "auto",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr",
            md: "1.05fr 0.95fr",
            lg: "1.2fr 0.8fr",
            xl: "1.25fr 0.75fr",
          },
          gap: { xs: 8, sm: 7, md: 4, lg: 3, xl: 2 },
        }}
      >
        <Box sx={{ position: "relative", pr: { xs: 0, sm: 0, md: 2, lg: 2, xl: 2 } }}>
          <Box
            sx={{
              position: "absolute",
              top: { xs: -70, sm: -70, md: -40, lg: -40, xl: -40 },
              left: { xs: -10, sm: -10, md: -20, lg: -20, xl: -20 },
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "clamp(140px, 24vw, 220px)",
                aspectRatio: "641 / 351",
              }}
            >
              <Image
                src="/images/about/cherries-heart.png"
                alt="Cherries and heart"
                fill
                sizes="(max-width: 900px) 45vw, (max-width: 1200px) 240px, 260px"
                quality={90}
                style={{ objectFit: "contain" }}
                priority
              />
            </Box>
          </Box>

          <Typography
            sx={{
              mt: { xs: 10, sm: 10, md: 14, lg: 14, xl: 14 },
              fontFamily: "var(--font-cooper-light), serif",
              fontSize: {
                xs: "1.5rem",
                sm: "1.75rem",
                md: "2.05rem",
                lg: "2.35rem",
                xl: "2.6rem",
              },
              lineHeight: 1.5,
              maxWidth: { xs: 520, sm: 520, md: 600, lg: 720, xl: 820 },
              color: "#2a2521",
            }}
          >
            Hi! I&apos;m Lucy. This site is a collective space on the things I
            love and things I&apos;m working on, in an effort to keep track of it
            all.
          </Typography>

          <Box
            sx={{
              mt: { xs: 6, sm: 6, md: 8, lg: 8, xl: 8 },
              width: "clamp(180px, 28vw, 260px)",
              aspectRatio: "1 / 1",
              position: "relative",
            }}
          >
            <Image
              src="/images/about/napkin.png"
              alt="Napkin note"
              fill
              sizes="(max-width: 900px) 45vw, (max-width: 1200px) 260px, 280px"
              quality={90}
              style={{ objectFit: "contain" }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: { xs: "flex-start", sm: "flex-start", md: "flex-end", lg: "flex-end", xl: "flex-end" },
            pl: { xs: 0, sm: 0, md: 2, lg: 2, xl: 2 },
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: {
                xs: "clamp(300px, 70vw, 440px)",
                sm: "clamp(320px, 62vw, 500px)",
                md: "clamp(320px, 54vw, 560px)",
                lg: "clamp(420px, 46vw, 640px)",
                xl: "clamp(520px, 40vw, 720px)",
              },
              aspectRatio: "27 / 32",
            }}
          >
            <Image
              src="/images/about/about-paper-background.png"
              alt="Contact paper background"
              fill
              sizes="(max-width: 900px) 78vw, (max-width: 1200px) 50vw, 42vw"
              quality={92}
              style={{ objectFit: "contain" }}
              priority
            />

            <Box
              sx={{
                position: "absolute",
                top: { xs: "29%", sm: "29%", md: "31%", lg: "31%", xl: "31%" },
                left: { xs: "23%", sm: "23%", md: "25%", lg: "25%", xl: "25%" },
                right: { xs: "0%", sm: "0%", md: "0%", lg: "0%", xl: "0%" },
                textAlign: "left",
              }}
            >
              <Stack spacing={{ xs: 3}} alignItems="flex-start">
                {socials.map((social) => (
                  <Stack
                    key={social.label}
                    component={MuiLink}
                    href={social.href}
                    underline="none"
                    color="inherit"
                    target="_blank"
                    rel="noreferrer"
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ justifyContent: "flex-start" }}
                  >
                    {social.icon ? (
                      <Box
                        sx={{
                          position: "relative",
                          width: "clamp(18px, 3vw, 26px)",
                          aspectRatio: "1 / 1",
                        }}
                      >
                        <Image
                          src={social.icon}
                          alt={`${social.label} logo`}
                          fill
                          sizes="(max-width: 900px) 5vw, 28px"
                          quality={90}
                          style={{ objectFit: "contain" }}
                        />
                      </Box>
                    ) : null}
                    <Typography
                      sx={{
                        fontFamily: "var(--font-vt323), monospace",
                        fontSize: { xs: "1.1rem", md: "1.6rem", lg: "1.6rem", xl: "1.6rem" },
                        letterSpacing: "0.6px",
                        color: "#2a2521",
                        minWidth: { xs: 150, md: 180, lg: 180, xl: 180 },
                        textAlign: "left",
                      }}
                    >
                      {social.label}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
