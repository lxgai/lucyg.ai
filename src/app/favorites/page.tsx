"use client";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";

const CANVAS_WIDTH = 1240;
const CANVAS_HEIGHT = 760;
const CONTENT_SHIFT = -100;
const CONTENT_SHIFT_Y = 0;
const HEADER_GAP = 40;
const GUTTER_MIN = CANVAS_HEIGHT / 3;
const GUTTER_MAX = CANVAS_HEIGHT * 1.2;
const LINE_TOP = -60;
const LINE_HEIGHT = 900;
const LINE_BLEED = 470;
const LINE_SHIFT_X = 220;
const PAGE_BOTTOM_PADDING = 180;
const MOVIES_BG_WIDTH = 1200;
const MOVIES_BG_HEIGHT = 610;
const MOVIE_POSTER_SIZE = 120;
const MOBILE_SHIFT_X = 18;

type AlbumItem = {
  src: string;
  title: string;
  artist: string;
  top: number;
  left: number;
  size: number;
};

type MovieItem = {
  src: string;
  title: string;
  top: number;
  left: number;
  size: number;
};

const albums: AlbumItem[] = [
  {
    src: "/images/favorites/albums/album-no-limit-knock2.png",
    title: "nolimit,",
    artist: "Knock2",
    top: 260,
    left: 90,
    size: 140,
  },
  {
    src: "/images/favorites/albums/album-smile-porter.png",
    title: "SMILE! :D,",
    artist: "Porter Robinson",
    top: 260,
    left: 300,
    size: 140,
  },
  {
    src: "/images/favorites/albums/album-killswitch-melodies-flawed.jpg",
    title: "Killswitch Melodies,",
    artist: "Flawed Mangoes",
    top: 500,
    left: 90,
    size: 140,
  },
  {
    src: "/images/favorites/albums/album-meta-ego-lexi.jpg",
    title: "无限意识 Meta Ego,",
    artist: "Lexie Liu",
    top: 500,
    left: 300,
    size: 140,
  },
  {
    src: "/images/favorites/albums/album-comfort-in-chaos-john.jpg",
    title: "Comfort in Chaos,",
    artist: "John Summit",
    top: 390,
    left: 530,
    size: 140,
  },
  {
    src: "/images/favorites/albums/album-130mood-dean.jpg",
    title: "130 Mood: TRBL,",
    artist: "Dean",
    top: 190,
    left: 1090,
    size: 140,
  },
  {
    src: "/images/favorites/albums/album-demidevil-ashnikko.jpg",
    title: "Demidevil,",
    artist: "Ashnikko",
    top: 390,
    left: 1090,
    size: 140,
  },
  {
    src: "/images/favorites/albums/album-alone-at-prom-tory.png",
    title: "Alone At Prom,",
    artist: "Tory Lanez",
    top: 620,
    left: 530,
    size: 140,
  },
  {
    src: "/images/favorites/albums/album-come-over-sober-lilpeep.jpg",
    title: "Come Over When You're Sober, Pt. 1,",
    artist: "Lil Peep",
    top: 620,
    left: 715,
    size: 140,
  },
  {
    src: "/images/favorites/albums/album-carrie-lowell-sufjan.jpg",
    title: "Carrie & Lowell,",
    artist: "Sufjan Stevens",
    top: 620,
    left: 900,
    size: 140,
  },
  {
    src: "/images/favorites/albums/album-wiped-out-neighbourhood.jpg",
    title: "Wiped Out!,",
    artist: "The Neighbourhood",
    top: 620,
    left: 1090,
    size: 140,
  },
];

const movies: MovieItem[] = [
  {
    src: "/images/favorites/movies/movie-marty-supreme.jpg",
    title: "Marty Supreme (2025)",
    top: 290,
    left: 150,
    size: MOVIE_POSTER_SIZE,
  },
  {
    src: "/images/favorites/movies/movie-anora.jpg",
    title: "Anora (2024)",
    top: 290,
    left: 310,
    size: MOVIE_POSTER_SIZE,
  },
  {
    src: "/images/favorites/movies/movie-blade_runner.jpg",
    title: "Blade Runner (1982)",
    top: 290,
    left: 470,
    size: MOVIE_POSTER_SIZE,
  },
  {
    src: "/images/favorites/movies/movie-train-dragon.jpg",
    title: "How to Train Your Dragon (2010)",
    top: 520,
    left: 150,
    size: MOVIE_POSTER_SIZE,
  },
  {
    src: "/images/favorites/movies/movie-eternal-sunshine.jpg",
    title: "Eternal Sunshine of the Spotless Mind (2004)",
    top: 520,
    left: 310,
    size: MOVIE_POSTER_SIZE,
  },
  {
    src: "/images/favorites/movies/movie-perks-wallflower.jpg",
    title: "The Perks of Being a Wallflower (2010)",
    top: 520,
    left: 470,
    size: MOVIE_POSTER_SIZE,
  },
];

const movieList = [
  "Marty Supreme (2025)",
  "Anora (2024)",
  "Blade Runner (1982)",
  "How to Train Your Dragon (2010)",
  "Eternal Sunshine of the Spotless Mind (2004)",
  "The Perks of Being a Wallflower (2010)",
];

export default function FavoritesPage() {
  const [isAlbumsHovered, setIsAlbumsHovered] = useState(false);
  const [isAlbumsPinned, setIsAlbumsPinned] = useState(true);
  const isAlbumsView = isAlbumsHovered ? !isAlbumsPinned : isAlbumsPinned;
  const isMoviesView = !isAlbumsView;
  const [mobileView, setMobileView] = useState<"albums" | "movies">("albums");

  return (
    <Box
      sx={{
        minHeight: "100svh",
        width: "100vw",
        position: "relative",
        backgroundColor: "#f5ede6",
        overflowX: "hidden",
      }}
    >
      <Header />

      <Box
        sx={{
          pt: { xs: 12, md: 0 },
          px: { xs: 3, md: 0 },
          display: { xs: "block", sm: "block", md: "none" },
          minHeight: "100svh",
        }}
      >
        <Box sx={{ ml: `${MOBILE_SHIFT_X}px` }}>
          <Typography
            sx={{
              fontFamily: "var(--font-cooper-light), serif",
              fontSize: "1.8rem",
              fontWeight: 400,
              color: "#2a2521",
              mb: 2,
            }}
          >
            Some of my favorite
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 6 }}>
            {(["albums", "movies"] as const).map((label) => {
              const isActive = mobileView === label;
              return (
                <Box
                  key={label}
                  component="button"
                  onClick={() => setMobileView(label)}
                  sx={{
                    border: "none",
                    background: "transparent",
                    p: 0,
                    m: 0,
                    cursor: "pointer",
                    fontFamily: "var(--font-cooper-light), serif",
                    fontSize: "1.6rem",
                    color: isActive ? "#d26aa7" : "#2a2521",
                    textShadow: isActive ? "0 0 10px rgba(210, 106, 167, 0.5)" : "none",
                    px: isActive ? 1.6 : 0,
                    py: isActive ? 0.6 : 0,
                    borderRadius: isActive ? "999px" : 0,
                    backgroundColor: isActive ? "rgba(210, 106, 167, 0.2)" : "transparent",
                    transition: "all 0.2s ease",
                  }}
                >
                  {label}
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box sx={{ position: "relative", height: "80svh" }}>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              bottom: 10,
              right: -160,
              width: 400,
              height: "auto",
              opacity: 0.20,
              pointerEvents: "none",
            }}
          >
            <Image
              src="/images/favorites/angels-kissing.png"
              alt="Angels kissing mobile"
              fill
              sizes="400px"
              style={{ objectFit: "contain" }}
            />
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "100vw",
              height: "100%",
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            {mobileView === "albums" && (
              <Box
                sx={{
                  position: "absolute",
                  top: -140,
                  left: 36 + MOBILE_SHIFT_X,
                  width: 96,
                  height: "calc(100% + 280px)",
                  opacity: 0.9,
                }}
              >
                <Box
                  component="svg"
                  viewBox="0 0 96 1000"
                  preserveAspectRatio="none"
                  shapeRendering="crispEdges"
                  sx={{ width: "100%", height: "100%", display: "block" }}
                >
                  <line
                    x1="30"
                    y1="0"
                    x2="30"
                    y2="1000"
                    stroke="#ab0000"
                    strokeWidth="2.9"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeDasharray="6 7"
                  />
                  <line
                    x1="52"
                    y1="0"
                    x2="52"
                    y2="1000"
                    stroke="#bccfdd"
                    strokeWidth="2.9"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeDasharray="6 7"
                  />
                </Box>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              position: "relative",
              height: "100%",
              overflow: "hidden",
              pr: 2,
              pb: 4,
              mt: 5.5,
              ml: `${MOBILE_SHIFT_X}px`,
              zIndex: 1,
            }}
          >
            {mobileView === "albums" ? (
              <Box
                sx={{
                  position: "relative",
                  height: "100%",
                  overflowY: "auto",
                  overflowX: "hidden",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                <Box sx={{ position: "relative", display: "grid", gap: 6, pr: 2 }}>
                  {albums.map((item) => (
                    <Box
                      key={item.src}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "120px 1fr",
                        gap: 2,
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          width: 120,
                          height: 120,
                        }}
                      >
                        <Image
                          src={item.src}
                          alt={`${item.title} cover`}
                          fill
                          sizes="120px"
                          style={{ objectFit: "cover" }}
                          quality={100}
                          unoptimized
                        />
                      </Box>
                      <Box sx={{ pl: 2 }}>
                        <Typography
                          sx={{
                            fontFamily: "var(--font-roboto-mono), monospace",
                            fontSize: "0.75rem",
                            color: "#c94b62",
                            letterSpacing: "0.3px",
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "var(--font-roboto-mono), monospace",
                            fontSize: "0.75rem",
                            color: "#2a2521",
                            letterSpacing: "0.2px",
                          }}
                        >
                          {item.artist}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "auto",
                  overflowX: "hidden",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                <Box
                  sx={{
                    height: "64svh",
                    minHeight: 360,
                    overflowY: "auto",
                    overflowX: "hidden",
                    pr: 0,
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 4,
                      px: 1,
                      maxWidth: 420,
                      mx: "auto",
                    }}
                  >
                    {movies.map((item) => (
                      <Box
                        key={item.src}
                        sx={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: "2 / 3",
                        }}
                      >
                        <Image
                          src={item.src}
                          alt={`${item.title} cover`}
                          fill
                          sizes="(max-width: 600px) 42vw, 220px"
                          style={{ objectFit: "cover" }}
                          quality={100}
                          unoptimized
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mt: 4, mb: 4, px: 2, textAlign: "left" }}>
                  {movieList.map((movie) => (
                    <Typography
                      key={movie}
                      sx={{
                        fontFamily: "var(--font-roboto-mono), monospace",
                        fontSize: "0.75rem",
                        color: "#2a2521",
                        letterSpacing: "0.3px",
                        lineHeight: 2.1,
                        maxWidth: 460,
                      }}
                    >
                      - {movie}
                    </Typography>
                  ))}
                </Box>

                <Box
                  component="a"
                  href="https://letterboxd.com/lucy_gai/"
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    mt: "auto",
                    pt: 1,
                    px: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 1,
                    fontFamily: "var(--font-roboto-mono), monospace",
                    fontSize: "0.75rem",
                    color: "#2a2521",
                    textDecoration: "none",
                    textAlign: "right",
                  }}
                >
                  <Box sx={{ position: "relative", width: 16, height: 16 }}>
                    <Image
                      src="/images/about/letterboxd-logo.png"
                      alt="Letterboxd logo"
                      fill
                      sizes="16px"
                      style={{ objectFit: "contain" }}
                    />
                  </Box>
                  check out more here
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          "--gutter": {
            md: `clamp(${GUTTER_MIN}px, 28vw, ${GUTTER_MAX}px)`,
            lg: `clamp(${GUTTER_MIN}px, 28vw, ${GUTTER_MAX}px)`,
            xl: `clamp(${GUTTER_MIN}px, 28vw, ${GUTTER_MAX}px)`,
          },
          "--canvas-scale": {
            md: `calc((100vw - var(--gutter)) / ${CANVAS_WIDTH}px)`,
            lg: `calc((100vw - var(--gutter)) / ${CANVAS_WIDTH}px)`,
            xl: `calc((100vw - var(--gutter)) / ${CANVAS_WIDTH}px)`,
          },
          "--canvas-width": {
            md: `${CANVAS_WIDTH}px`,
            lg: `${CANVAS_WIDTH}px`,
            xl: `${CANVAS_WIDTH}px`,
          },
          "--canvas-height": {
            md: `${CANVAS_HEIGHT}px`,
            lg: `${CANVAS_HEIGHT}px`,
            xl: `${CANVAS_HEIGHT}px`,
          },
          position: "relative",
          width: "calc(var(--canvas-width) * var(--canvas-scale))",
          height: "calc(var(--canvas-height) * var(--canvas-scale))",
          minHeight: "100svh",
          mx: "auto",
          px: { md: "calc(var(--gutter) / 2)" },
          display: { xs: "none", sm: "none", md: "block" },
          pb: { md: PAGE_BOTTOM_PADDING },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: `calc(${HEADER_GAP}px / var(--canvas-scale) + ${CONTENT_SHIFT_Y}px)`,
            left: 0,
            right: 0,
            bottom: 0,
            width: "var(--canvas-width)",
            height: "var(--canvas-height)",
            transform: "scale(var(--canvas-scale))",
            transformOrigin: "top left",
            zIndex: 1,
          }}
        >
          {!isMoviesView && (
            <Box
              sx={{
                position: "absolute",
                top: LINE_TOP,
                left: -LINE_BLEED + LINE_SHIFT_X,
                width: CANVAS_WIDTH + LINE_BLEED * 2,
                height: LINE_HEIGHT,
                pointerEvents: "none",
                opacity: 0.9,
                zIndex: 0,
                backgroundImage: "url(/images/favorites/albums/zig-zag-large.svg)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                overflow: "hidden",
              }}
            />
          )}
          <Typography
            component="h1"
            sx={{
              position: "absolute",
              top: 130,
              left: 70 + CONTENT_SHIFT,
              fontFamily: "var(--font-cooper-light), serif",
              fontSize: "2.0rem",
              fontWeight: 400,
              color: "#2a2521",
            }}
          >
            Some of my favorite{" "}
            <Box
              component="span"
              onMouseEnter={() => setIsAlbumsHovered(true)}
              onMouseLeave={() => setIsAlbumsHovered(false)}
              onClick={() => setIsAlbumsPinned(isAlbumsView)}
              sx={{
                color: "#d26aa7",
                fontStyle: "italic",
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
              }}
            >
              {isAlbumsView ? "albums:" : "movies:"}
            </Box>
          </Typography>

          {isMoviesView ? (
            <>
              <Box
                sx={{
                  position: "absolute",
                  top: 210,
                  left: 90 + CONTENT_SHIFT,
                  width: MOVIES_BG_WIDTH,
                  height: MOVIES_BG_HEIGHT,
                  overflow: "hidden",
                  opacity: 0.7,
                }}
              >
                <Image
                  src="/images/favorites/movies/movies-view-background.jpg"
                  alt="Movies background"
                  fill
                  sizes="1200px"
                  style={{ objectFit: "cover" }}
                  quality={100}
                  unoptimized
                  priority
                />
              </Box>

              {movies.map((movie) => (
                <MovieCard
                  key={movie.src}
                  {...movie}
                  left={movie.left + CONTENT_SHIFT}
                />
              ))}

              <Box
                sx={{
                  position: "absolute",
                  top: 330,
                  left: 870 + CONTENT_SHIFT,
                  width: 430,
                  color: "#f4eee7",
                }}
              >
                {movieList.map((movie) => (
                  <Typography
                    key={movie}
                    sx={{
                      fontFamily: "var(--font-roboto-mono), monospace",
                      fontSize: "0.7rem",
                      letterSpacing: "0.3px",
                      lineHeight: 2.4,
                    }}
                  >
                    - {movie}
                  </Typography>
                ))}
              </Box>

              <Box
                component="a"
                href="https://letterboxd.com/lucy_gai/"
                target="_blank"
                rel="noreferrer"
                sx={{
                  position: "absolute",
                  top: 610,
                  left: 1000 + CONTENT_SHIFT,
                  width: 430,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "#f4eee7",
                  textDecoration: "none",
                }}
              >
                <Box sx={{ position: "relative", width: 16, height: 16 }}>
                  <Image
                    src="/images/about/letterboxd-logo.png"
                    alt="Letterboxd logo"
                    fill
                    sizes="16px"
                    style={{ objectFit: "contain" }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontFamily: "var(--font-roboto-mono), monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.2px",
                  }}
                >
                  check out more here
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Box
                sx={{
                  position: "absolute",
                  top: 120,
                  left: 630 + CONTENT_SHIFT,
                  width: 470,
                  height: 610,
                  opacity: 0.3,
                }}
              >
                <Image
                  src="/images/favorites/angels-kissing.png"
                  alt="Angels kissing"
                  fill
                  sizes="610px"
                  style={{ objectFit: "contain" }}
                  priority
                />
              </Box>

              {albums.map((album) => (
                <AlbumCard key={album.src} {...album} left={album.left + CONTENT_SHIFT} />
              ))}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function AlbumCard({
  src,
  title,
  artist,
  top,
  left,
  size,
}: {
  src: string;
  title: string;
  artist: string;
  top: number;
  left: number;
  size: number;
}) {
  return (
    <Box
      sx={{
        position: "absolute",
        top,
        left,
        width: size,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: size,
          height: size,
        }}
      >
        <Image
          src={src}
          alt={`${title} album cover`}
          fill
          sizes={`${size}px`}
          style={{ objectFit: "cover" }}
        />
      </Box>
      <Box sx={{ mt: 1 }}>
        <Typography
          sx={{
            fontFamily: "var(--font-roboto-mono), monospace",
            fontSize: "0.7rem",
            color: "#c94b62",
            lineHeight: 1.0,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontFamily: "var(--font-roboto-mono), monospace",
            fontSize: "0.7rem",
            color: "#2a2521",
            lineHeight: 1.5,
          }}
        >
          {artist}
        </Typography>
      </Box>
    </Box>
  );
}

function MovieCard({
  src,
  title,
  top,
  left,
  size,
}: {
  src: string;
  title: string;
  top: number;
  left: number;
  size: number;
}) {
  return (
    <Box
      sx={{
        position: "absolute",
        top,
        left,
        width: size,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: size,
          height: size * 1.45,
          overflow: "hidden",
        }}
      >
        <Image
          src={src}
          alt={`${title} poster`}
          fill
          sizes={`${size}px`}
          style={{ objectFit: "cover" }}
          quality={100}
          unoptimized
        />
      </Box>
    </Box>
  );
}
