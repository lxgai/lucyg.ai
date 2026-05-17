"use client";
import { useEffect, useState } from "react";
import { Box, Link as MuiLink, Typography } from "@mui/material";
import Image from "next/image";
import PageShell from "@/components/design/PageShell";
import VinylPlayer from "@/components/design/VinylPlayer";
import { CardLabel, Hair } from "@/components/design/primitives";
import { tokens } from "@/components/design/tokens";
import {
  ALBUMS,
  DEFAULT_TRACKLIST,
  MOVIES,
  TRACKLISTS,
  type Track,
} from "@/data/content";

type Tab = "music" | "films";

export default function FavoritesPage() {
  const [tab, setTab] = useState<Tab>("music");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);

  const selectedAlbum = ALBUMS[selectedIdx];
  const tracks = TRACKLISTS[selectedAlbum.title] ?? DEFAULT_TRACKLIST;

  useEffect(() => {
    setTrackIdx(0);
  }, [selectedIdx]);

  return (
    <PageShell
      section="SECTION C · FAVORITES"
      catNo="file: favorites.idx"
      title={
        <>
          Personal favorites,{" "}
          <Box component="span" sx={{ fontStyle: "italic" }}>hand-picked</Box>.
        </>
      }
    >
      <Box sx={{ display: "flex", gap: 0.5, mb: 5 }}>
        {(["music", "films"] as Tab[]).map((t) => {
          const active = tab === t;
          return (
            <Box
              key={t}
              onClick={() => setTab(t)}
              sx={{
                p: "10px 22px",
                border: `1px solid ${active ? tokens.ink : tokens.hair}`,
                background: active ? tokens.ink : "transparent",
                color: active ? tokens.paper : tokens.ink,
                fontFamily: tokens.mono,
                fontSize: 10,
                letterSpacing: "1.6px",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 180ms",
              }}
            >
              {t}
            </Box>
          );
        })}
      </Box>

      {tab === "music" ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            columnGap: { xs: 5, md: 20, lg: 35 },
            rowGap: { xs: 5, md: 0 },
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 580, ml: { md: "auto" } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: { xs: 340, md: 440 },
                pb: 3.75,
              }}
            >
              <VinylPlayer
                album={selectedAlbum}
                playing={playing}
                onToggle={() => setPlaying((p) => !p)}
              />
            </Box>

            <Box
              sx={{
                background: tokens.paperCard,
                border: `1px solid ${tokens.hairStrong}`,
                p: 2.25,
                maxWidth: 580,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 2,
                  mb: 1.25,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontFamily: tokens.serif,
                      fontStyle: "italic",
                      fontSize: 22,
                      lineHeight: 1,
                    }}
                  >
                    {selectedAlbum.title}
                  </Typography>
                  <Box
                    sx={{
                      fontFamily: tokens.mono,
                      fontSize: 10,
                      color: tokens.ink60,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      mt: 0.5,
                    }}
                  >
                    {selectedAlbum.artist} · {selectedAlbum.year}
                  </Box>
                </Box>
                <CardLabel
                  cat="C.M"
                  no={String(selectedIdx + 1).padStart(3, "0")}
                />
              </Box>
              <Hair />
              <TracklistView
                tracks={tracks}
                trackIdx={trackIdx}
                playing={playing}
                onPick={(i) => {
                  setTrackIdx(i);
                  setPlaying(true);
                }}
              />
            </Box>
          </Box>

          <Box sx={{ width: "100%", maxWidth: 600, mr: { md: "auto" } }}>
            <Box
              sx={{
                fontFamily: tokens.mono,
                fontSize: 10,
                letterSpacing: "1.6px",
                color: tokens.ink60,
                textTransform: "uppercase",
                mb: 1.75,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Record rack</span>
              <span>{ALBUMS.length} records</span>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1.25,
              }}
            >
              {ALBUMS.map((a, i) => {
                const isSelected = i === selectedIdx;
                return (
                  <Box
                    key={a.src}
                    onClick={() => setSelectedIdx(i)}
                    sx={{
                      cursor: "pointer",
                      position: "relative",
                      p: "3px",
                      background: isSelected ? tokens.ink : "transparent",
                      transition: "all 200ms",
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "1 / 1",
                      }}
                    >
                      <Image
                        src={a.src}
                        alt={a.title}
                        fill
                        sizes="(max-width: 900px) 30vw, 120px"
                        style={{
                          objectFit: "cover",
                          filter: isSelected ? "none" : "saturate(0.9)",
                          transition: "filter 200ms",
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      ) : (
        <MoviesBlock />
      )}
    </PageShell>
  );
}

function TracklistView({
  tracks,
  trackIdx,
  playing,
  onPick,
}: {
  tracks: Track[];
  trackIdx: number;
  playing: boolean;
  onPick: (idx: number) => void;
}) {
  const favCount = tracks.filter((track) => track.fav).length;

  return (
    <Box sx={{ mt: 1.25 }}>
      <Box
        sx={{
          fontFamily: tokens.mono,
          fontSize: 9,
          letterSpacing: "1.6px",
          color: tokens.ink60,
          textTransform: "uppercase",
          mb: 1.25,
        }}
      >
        Tracklist · {favCount} pick{favCount === 1 ? "" : "s"}
      </Box>
      {tracks.map((tr, i) => {
        const isCurrent = i === trackIdx;
        const isPicked = Boolean(tr.fav);
        return (
          <Box
            key={tr.n}
            onClick={() => onPick(i)}
            sx={{
              display: "grid",
              gridTemplateColumns: "26px 1fr auto",
              gap: 1.75,
              alignItems: "baseline",
              cursor: "pointer",
              p: "6px 0",
              pl: "10px",
              ml: "-12px",
              borderLeft: `2px solid ${isCurrent ? tokens.accent : "transparent"}`,
              color: isCurrent ? tokens.accent : isPicked ? tokens.ink : tokens.ink60,
              opacity: isPicked || isCurrent ? 1 : 0.55,
              fontFamily: tokens.mono,
              fontSize: 11,
              transition: "all 180ms",
            }}
          >
            <Box component="span" sx={{ color: tokens.ink40, fontSize: 9 }}>
              {String(tr.n).padStart(2, "0")}
            </Box>
            <Box
              component="span"
              sx={{
                fontFamily: tokens.serif,
                fontSize: 15,
                fontStyle: isCurrent ? "italic" : "normal",
                minWidth: 0,
              }}
            >
              {isCurrent && playing && (
                <Box component="span" sx={{ mr: 0.75, color: tokens.accent }}>
                  ♪
                </Box>
              )}
              {isPicked && !isCurrent && (
                <Box component="span" sx={{ mr: 0.75, color: tokens.accent }}>
                  ★
                </Box>
              )}
              {tr.name}
            </Box>
            <Box component="span" sx={{ color: tokens.ink60, fontSize: 10 }}>
              {tr.time}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

function MoviesBlock() {
  return (
    <Box>
      <MoviesCards />
      <Box
        sx={{
          mt: 5,
          pt: 3,
          borderTop: `1px solid ${tokens.hair}`,
          fontFamily: tokens.mono,
          fontSize: 10,
          letterSpacing: "1.4px",
          textTransform: "uppercase",
          color: tokens.ink60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <span>Check out more on</span>
        <MuiLink
          href="https://letterboxd.com/lucy_gai/"
          target="_blank"
          rel="noopener noreferrer"
          underline="none"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            color: tokens.accent,
            borderBottom: `1px solid ${tokens.accent}`,
            paddingBottom: "1px",
            "&:hover": { opacity: 0.8 },
          }}
        >
          <span>letterboxd</span>
          <Box
            component="span"
            sx={{
              position: "relative",
              display: "inline-block",
              width: 20,
              height: 20,
            }}
          >
            <Image
              src="/images/about/letterboxd-logo.png"
              alt="Letterboxd"
              fill
              sizes="20px"
              style={{ objectFit: "contain" }}
            />
          </Box>
        </MuiLink>
      </Box>
    </Box>
  );
}

function MoviesCards() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        },
        gap: 2.5,
      }}
    >
      {MOVIES.map((m) => (
        <Box
          key={m.title}
          sx={{
            background: tokens.paperCard,
            border: `1px solid ${tokens.hairStrong}`,
            p: 1.75,
            display: "flex",
            gap: 1.75,
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: 84,
              height: 126,
              flex: "0 0 auto",
              overflow: "hidden",
            }}
          >
            <Image
              src={m.src}
              alt={m.title}
              fill
              sizes="84px"
              style={{ objectFit: "cover" }}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: tokens.serif,
                fontSize: 17,
                fontStyle: "italic",
                lineHeight: 1.1,
              }}
            >
              {m.title}
            </Typography>
            <Box
              sx={{
                fontFamily: tokens.mono,
                fontSize: 8,
                color: tokens.ink60,
                textTransform: "uppercase",
                letterSpacing: "1px",
                mt: 0.5,
              }}
            >
              {m.director} · {m.year}
            </Box>
            <Box
              sx={{
                mt: 1.25,
                fontFamily: tokens.mono,
                fontSize: 11,
                color: tokens.accent,
                letterSpacing: "1px",
              }}
            >
              {"★".repeat(Math.floor(m.rating))}
              {m.rating % 1 ? "½" : ""}
            </Box>
            <Hair style={{ margin: "10px 0" }} />
            <Box
              sx={{
                fontFamily: tokens.serif,
                fontSize: 12,
                color: tokens.ink60,
                fontStyle: "italic",
                lineHeight: 1.4,
              }}
            >
              &ldquo;{m.note}&rdquo;
            </Box>
            <Box
              sx={{
                fontFamily: tokens.mono,
                fontSize: 8,
                color: tokens.ink40,
                mt: 1,
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              LOGGED {m.date}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
