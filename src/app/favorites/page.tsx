"use client";
import { useEffect, useMemo, useState } from "react";
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
  type Movie,
  type Track,
} from "@/data/content";

type Tab = "music" | "films";
type AlbumSort = "new" | "old" | "title";
type SyncedMovie = Movie & {
  sourceUrl?: string;
};
type LetterboxdMovie = {
  key: string;
  rating?: number;
  date?: string;
  note?: string;
  sourceUrl?: string;
};

const SORT_OPTIONS: { value: AlbumSort; label: string }[] = [
  { value: "new", label: "new -> old" },
  { value: "old", label: "old -> new" },
  { value: "title", label: "title (a-z)" },
];

export default function FavoritesPage() {
  const [tab, setTab] = useState<Tab>("music");
  const [sort, setSort] = useState<AlbumSort>("new");
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSrc, setSelectedSrc] = useState(ALBUMS[0].src);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [letterboxdMovies, setLetterboxdMovies] = useState<Record<string, LetterboxdMovie>>({});

  const sortedAlbums = useMemo(() => {
    return [...ALBUMS].sort((a, b) => {
      if (sort === "new") return Number(b.year) - Number(a.year);
      if (sort === "old") return Number(a.year) - Number(b.year);
      return a.title.localeCompare(b.title);
    });
  }, [sort]);

  const selectedAlbum =
    sortedAlbums.find((album) => album.src === selectedSrc) ?? sortedAlbums[0];
  const selectedIdx = sortedAlbums.indexOf(selectedAlbum);
  const tracks = TRACKLISTS[selectedAlbum.title] ?? DEFAULT_TRACKLIST;
  const movies = useMemo<SyncedMovie[]>(() => {
    return MOVIES.map((movie) => {
      const synced = letterboxdMovies[movieKey(movie.title, movie.year)];

      if (!synced) {
        return {
          ...movie,
          note: "Review coming soon",
        };
      }

      return {
        ...movie,
        rating: synced.rating ?? movie.rating,
        date: synced.date ?? movie.date,
        note: synced.note || "Review coming soon",
        sourceUrl: synced.sourceUrl,
      };
    });
  }, [letterboxdMovies]);

  useEffect(() => {
    setPlaying(false);
    setProgress(0);
  }, [selectedSrc]);

  useEffect(() => {
    if (!sortOpen) return;

    const close = () => setSortOpen(false);
    const id = window.setTimeout(() => document.addEventListener("click", close), 0);

    return () => {
      window.clearTimeout(id);
      document.removeEventListener("click", close);
    };
  }, [sortOpen]);

  useEffect(() => {
    if (!playing) return;

    const id = window.setInterval(() => {
      setProgress((p) => (p + 0.5) % 100);
    }, 200);

    return () => window.clearInterval(id);
  }, [playing]);

  useEffect(() => {
    let active = true;

    async function loadLetterboxdMovies() {
      try {
        const response = await fetch("/api/letterboxd/favorites");

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { movies?: LetterboxdMovie[] };
        const moviesByKey = Object.fromEntries(
          (data.movies ?? []).map((movie) => [movie.key, movie])
        );

        if (active) {
          setLetterboxdMovies(moviesByKey);
        }
      } catch {
        // Local movie data is the fallback when Letterboxd is unavailable.
      }
    }

    loadLetterboxdMovies();

    return () => {
      active = false;
    };
  }, []);

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
                playing={playing}
                progress={progress}
                onTogglePlay={() => setPlaying((p) => !p)}
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
              <SortMenu
                sort={sort}
                open={sortOpen}
                onSortChange={setSort}
                onOpenChange={setSortOpen}
              />
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1.25,
              }}
            >
              {sortedAlbums.map((a, i) => {
                const isSelected = i === selectedIdx;
                return (
                  <Box
                    key={a.src}
                    onClick={() => setSelectedSrc(a.src)}
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
                flexWrap: "wrap",
                textAlign: "center",
              }}
            >
              <span>Check out more of my picks and playlists on</span>
              <MuiLink
                href="https://open.spotify.com/user/charlottefour"
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
                <span>spotify</span>
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
                    src="/images/about/spotify-logo.png"
                    alt="Spotify"
                    fill
                    sizes="20px"
                    style={{ objectFit: "contain" }}
                  />
                </Box>
              </MuiLink>
            </Box>
          </Box>
        </Box>
      ) : (
        <MoviesBlock movies={movies} />
      )}
    </PageShell>
  );
}

function SortMenu({
  sort,
  open,
  onSortChange,
  onOpenChange,
}: {
  sort: AlbumSort;
  open: boolean;
  onSortChange: (sort: AlbumSort) => void;
  onOpenChange: (open: boolean | ((open: boolean) => boolean)) => void;
}) {
  const current = SORT_OPTIONS.find((option) => option.value === sort) ?? SORT_OPTIONS[0];

  return (
    <Box
      sx={{ position: "relative" }}
      onClick={(event) => event.stopPropagation()}
    >
      <Box
        component="button"
        type="button"
        onClick={() => onOpenChange((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        sx={{
          appearance: "none",
          border: 0,
          background: "transparent",
          p: "2px 0",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 0.75,
          fontFamily: tokens.mono,
          fontSize: 10,
          letterSpacing: "1.4px",
          color: tokens.ink60,
          textTransform: "uppercase",
        }}
      >
        <span>sort:</span>
        <Box component="span" sx={{ color: tokens.ink }}>
          {current.label}
        </Box>
        <Box
          component="span"
          sx={{
            fontSize: 8,
            color: tokens.ink60,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 150ms",
          }}
        >
          ▾
        </Box>
      </Box>

      {open && (
        <Box
          role="listbox"
          aria-label="Sort record rack"
          sx={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            zIndex: 10,
            background: tokens.paperCard,
            border: `1px solid ${tokens.hairStrong}`,
            boxShadow: "0 8px 24px rgba(31, 26, 22, 0.12)",
            minWidth: 160,
          }}
        >
          {SORT_OPTIONS.map((option, i) => {
            const active = option.value === sort;
            return (
              <Box
                key={option.value}
                role="option"
                aria-selected={active}
                onClick={() => {
                  onSortChange(option.value);
                  onOpenChange(false);
                }}
                sx={{
                  p: "10px 14px",
                  fontFamily: tokens.mono,
                  fontSize: 10,
                  letterSpacing: "1.4px",
                  textTransform: "uppercase",
                  color: active ? tokens.accent : tokens.ink,
                  cursor: "pointer",
                  borderTop: i > 0 ? `1px solid ${tokens.hair}` : "none",
                  background: active ? "rgba(31, 26, 22, 0.04)" : "transparent",
                  transition: "background 120ms",
                  "&:hover": {
                    background: active
                      ? "rgba(31, 26, 22, 0.04)"
                      : "rgba(31, 26, 22, 0.03)",
                  },
                }}
              >
                {option.label}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

function PlayGlyph({
  size = 14,
  color,
  playing = false,
}: {
  size?: number;
  color: string;
  playing?: boolean;
}) {
  if (playing) {
    return (
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          gap: "2px",
          width: size,
          height: size,
          alignItems: "center",
        }}
      >
        <Box component="span" sx={{ width: size * 0.3, height: size, background: color }} />
        <Box component="span" sx={{ width: size * 0.3, height: size, background: color }} />
      </Box>
    );
  }

  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        width: 0,
        height: 0,
        borderTop: `${size / 2}px solid transparent`,
        borderBottom: `${size / 2}px solid transparent`,
        borderLeft: `${size * 0.85}px solid ${color}`,
      }}
    />
  );
}

function getFeaturedTrack(tracks: Track[]) {
  return (
    tracks.find((track) => track.featured) ??
    tracks.find((track) => track.fav) ??
    tracks[0]
  );
}

function TracklistView({
  tracks,
  playing,
  progress,
  onTogglePlay,
}: {
  tracks: Track[];
  playing: boolean;
  progress: number;
  onTogglePlay: () => void;
}) {
  const favCount = tracks.filter((track) => track.fav).length;
  const featured = getFeaturedTrack(tracks);

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
        Featured cut
      </Box>

      <Box
        onClick={onTogglePlay}
        sx={{
          display: "grid",
          gridTemplateColumns: "32px 1fr",
          gap: 1.75,
          alignItems: "center",
          cursor: "pointer",
          p: "14px 14px 14px 12px",
          background: "rgba(31, 26, 22, 0.04)",
          borderLeft: `2px solid ${tokens.accent}`,
          transition: "background 180ms",
          "&:hover": { background: "rgba(31, 26, 22, 0.065)" },
        }}
      >
        <Box
          component="span"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PlayGlyph size={16} color={tokens.accent} playing={playing} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: tokens.serif,
              fontStyle: "italic",
              fontSize: 24,
              lineHeight: 1.1,
              color: tokens.ink,
            }}
          >
            {featured.name}
          </Typography>
          <Box
            sx={{
              fontFamily: tokens.mono,
              fontSize: 9,
              color: tokens.ink60,
              letterSpacing: "1.4px",
              textTransform: "uppercase",
              mt: 0.5,
            }}
          >
            Track {String(featured.n).padStart(2, "0")} · {featured.time} ·{" "}
            {playing ? "now playing" : "press to play"}
          </Box>
        </Box>
      </Box>

      <Box sx={{ height: 2, mb: 2.25, position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${playing ? progress : 0}%`,
            background: tokens.accent,
            transition: "width 200ms linear",
          }}
        />
      </Box>

      <Box
        sx={{
          fontFamily: tokens.mono,
          fontSize: 9,
          letterSpacing: "1.6px",
          color: tokens.ink60,
          textTransform: "uppercase",
          mb: 1,
        }}
      >
        Full tracklist · {favCount} pick{favCount === 1 ? "" : "s"}
      </Box>
      <Box sx={{ columnCount: { xs: 1, sm: 2 }, columnGap: 2.25 }}>
        {tracks.map((tr) => {
          const isFeatured = tr === featured;
          const isPicked = Boolean(tr.fav);
          return (
            <Box
              key={tr.n}
              sx={{
                display: "grid",
                gridTemplateColumns: "20px 1fr auto",
                gap: 1,
                alignItems: "baseline",
                p: "3px 0",
                color: isFeatured ? tokens.accent : tokens.ink60,
                fontFamily: tokens.mono,
                fontSize: 10.5,
                breakInside: "avoid",
              }}
            >
              <Box
                component="span"
                sx={{ color: isFeatured ? tokens.accent : tokens.ink40, fontSize: 9 }}
              >
                {String(tr.n).padStart(2, "0")}
              </Box>
              <Box
                component="span"
                sx={{
                  color: isFeatured ? tokens.accent : isPicked ? tokens.ink : tokens.ink60,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  minWidth: 0,
                }}
              >
                {tr.name}
                {isPicked && (
                  <Box component="span" sx={{ ml: 0.625, color: tokens.accent }}>
                    ★
                  </Box>
                )}
              </Box>
              <Box component="span" sx={{ fontSize: 9 }}>
                {tr.time}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

function MoviesBlock({ movies }: { movies: SyncedMovie[] }) {
  return (
    <Box>
      <MoviesCards movies={movies} />
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

function MoviesCards({ movies }: { movies: SyncedMovie[] }) {
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
      {movies.map((m) => (
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
            {m.sourceUrl && (
              <MuiLink
                href={m.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                sx={{
                  display: "inline-flex",
                  mt: 1,
                  fontFamily: tokens.mono,
                  fontSize: 8,
                  color: tokens.accent,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  borderBottom: `1px solid ${tokens.accent}`,
                }}
              >
                Letterboxd review
              </MuiLink>
            )}
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

function movieKey(title: string, year: string) {
  return `${slugify(title)}-${year}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
