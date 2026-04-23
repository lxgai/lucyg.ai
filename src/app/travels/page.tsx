"use client";
import { Box, Typography, Link as MuiLink } from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import PageShell from "@/components/design/PageShell";
import { Hair } from "@/components/design/primitives";
import { tokens } from "@/components/design/tokens";
import { TRIPS } from "@/data/content";

function rotationFor(i: number) {
  if (i % 3 === 1) return "0.8deg";
  if (i % 3 === 0) return "-0.6deg";
  return "0.3deg";
}

export default function TravelsPage() {
  return (
    <PageShell
      section="SECTION C · TRAVELS"
      catNo="file: travels.idx"
      title={
        <>
          Places, <Box component="span" sx={{ fontStyle: "italic" }}>cataloged.</Box>
        </>
      }
      subtitle={`${TRIPS.length} entries · filed by date`}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 4,
        }}
      >
        {TRIPS.map((t, i) => {
          const restingRotate = rotationFor(i);
          return (
            <MuiLink
              key={t.id}
              component={NextLink}
              href={`/travels/${t.id}`}
              underline="none"
              sx={{
                position: "relative",
                background: tokens.paperCard,
                border: `1px solid ${tokens.hairStrong}`,
                p: 2.25,
                cursor: "pointer",
                transform: `rotate(${restingRotate})`,
                boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                color: tokens.ink,
                transition: "transform 260ms, box-shadow 260ms",
                "&:hover": {
                  transform: "rotate(0) translateY(-4px)",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  aspectRatio: "4 / 3",
                  position: "relative",
                  overflow: "hidden",
                  background: tokens.paperDeep,
                }}
              >
                <Image
                  src={t.cover}
                  alt={t.place}
                  fill
                  sizes="(max-width: 600px) 92vw, (max-width: 900px) 46vw, 32vw"
                  style={{
                    objectFit: "cover",
                    filter: "sepia(0.1) saturate(0.92)",
                  }}
                />
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  width: 60,
                  height: 72,
                  background: tokens.paper,
                  border: `1px dashed ${tokens.ink}`,
                  p: "4px",
                  fontFamily: tokens.mono,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `rotate(${i % 2 === 0 ? -6 : 5}deg)`,
                }}
              >
                <Box
                  sx={{
                    fontFamily: tokens.serif,
                    fontSize: 20,
                    fontStyle: "italic",
                  }}
                >
                  {t.stamp}
                </Box>
                <Box
                  sx={{
                    height: "1px",
                    width: "80%",
                    background: tokens.ink,
                    my: "3px",
                  }}
                />
                <Box sx={{ fontSize: 7, letterSpacing: "0.8px" }}>POSTED</Box>
                <Box sx={{ fontSize: 7, letterSpacing: "0.8px" }}>
                  {t.date.replace(" / ", "·")}
                </Box>
              </Box>

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontFamily: tokens.serif,
                      fontSize: 28,
                      fontStyle: "italic",
                      lineHeight: 1,
                    }}
                  >
                    {t.place}
                  </Typography>
                  <Box
                    sx={{
                      fontFamily: tokens.mono,
                      fontSize: 10,
                      color: tokens.ink60,
                      mt: 0.6,
                      letterSpacing: "0.6px",
                    }}
                  >
                    {t.sub}
                  </Box>
                </Box>
              </Box>

              <Hair style={{ margin: "14px 0 10px" }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: tokens.mono,
                  fontSize: 9,
                  letterSpacing: "1.4px",
                  color: tokens.ink60,
                  textTransform: "uppercase",
                }}
              >
                <span>{t.duration}</span>
                <Box component="span" sx={{ color: tokens.accent }}>
                  № {String(i + 1).padStart(3, "0")} →
                </Box>
              </Box>
            </MuiLink>
          );
        })}
      </Box>
    </PageShell>
  );
}
