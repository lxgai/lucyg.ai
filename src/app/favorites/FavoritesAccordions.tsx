"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Asterisks, ExternalLink, Tag, linkClass } from "@/components/site/ui";
import type { Track } from "@/data/favorites";
import articleStyles from "@/components/site/article.module.css";
import { cx } from "@/lib/cx";
import { ALBUMS_ID, FILMS_ID } from "./anchors";
import styles from "./favorites.module.css";

const SPOTIFY_PROFILE = "https://open.spotify.com/user/charlottefour";
const LETTERBOXD_PROFILE = "https://letterboxd.com/lucy_gai/";

export type AlbumRow = {
  title: string;
  artist: string;
  year: string;
  cover: string;
  tracks?: Track[];
  featured?: Track;
  featuredAudio?: string;
};

export type FilmRow = {
  title: string;
  director: string;
  year: string;
  poster: string;
  synopsis?: string;
  review?: string;
  reviewUrl?: string;
};

// One open row per section; nothing open by default.
export default function FavoritesAccordions({ albums, films }: { albums: AlbumRow[]; films: FilmRow[] }) {
  const [openAlbum, setOpenAlbum] = useState<string | null>(null);
  const [openFilm, setOpenFilm] = useState<string | null>(null);
  const audio = useFeaturedAudio();

  const toggleAlbum = (title: string) => {
    audio.stop();
    setOpenAlbum((current) => (current === title ? null : title));
  };

  return (
    <>
      <section className={styles.section}>
        <h2 id={ALBUMS_ID} className={styles.sectionHeading}>
          Albums
        </h2>
        <ul className={styles.list}>
          {albums.map((album) => (
            <AccordionItem
              key={album.title}
              title={album.title}
              chips={[album.artist, album.year]}
              open={openAlbum === album.title}
              onToggle={() => toggleAlbum(album.title)}
            >
              <AlbumDetails
                album={album}
                playing={audio.playingSrc !== null && audio.playingSrc === album.featuredAudio}
                onTogglePlay={() => album.featuredAudio && audio.toggle(album.featuredAudio)}
              />
            </AccordionItem>
          ))}
        </ul>
        <p className={styles.sectionFooter}>
          More picks and playlists on{" "}
          <ExternalLink href={SPOTIFY_PROFILE}>
            Spotify
          </ExternalLink>
          .
        </p>
      </section>

      <Asterisks className={styles.divider} />

      <section className={styles.sectionLast}>
        <h2 id={FILMS_ID} className={styles.sectionHeading}>
          Films
        </h2>
        <ul className={styles.list}>
          {films.map((film) => (
            <AccordionItem
              key={film.title}
              title={film.title}
              chips={[film.director, film.year]}
              open={openFilm === film.title}
              onToggle={() => setOpenFilm((current) => (current === film.title ? null : film.title))}
            >
              <FilmDetails film={film} />
            </AccordionItem>
          ))}
        </ul>
        <p className={styles.sectionFooter}>
          Read all reviews on{" "}
          <ExternalLink href={LETTERBOXD_PROFILE}>
            Letterboxd
          </ExternalLink>
          .
        </p>
      </section>
    </>
  );
}

function AccordionItem({
  title,
  chips,
  open,
  onToggle,
  children,
}: {
  title: string;
  chips: string[];
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <li>
      <button type="button" className={styles.rowButton} aria-expanded={open} onClick={onToggle}>
        <span className={styles.rowTitle}>{title}</span>
        <span style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
          {chips.map((chip) => (
            <Tag key={chip}>{chip}</Tag>
          ))}
        </span>
      </button>
      {/* Always mounted so the open/close transition can run; hidden from AT while closed. */}
      <div className={cx(styles.panel, open && styles.panelOpen)} aria-hidden={!open} inert={!open}>
        <div className={styles.panelInner}>{children}</div>
      </div>
    </li>
  );
}

function AlbumDetails({
  album,
  playing,
  onTogglePlay,
}: {
  album: AlbumRow;
  playing: boolean;
  onTogglePlay: () => void;
}) {
  const spotifySearch = album.featured
    ? `https://open.spotify.com/search/${encodeURIComponent(`${album.featured.name} ${album.artist}`)}`
    : SPOTIFY_PROFILE;

  return (
    <div className={styles.albumDetails}>
      <Image src={album.cover} alt={`${album.title} cover`} width={180} height={180} className={styles.cover} />
      <div className={styles.albumText}>
        {album.featured &&
          (album.featuredAudio ? (
            <button type="button" className={styles.play} onClick={onTogglePlay} aria-pressed={playing}>
              <PlayIcon playing={playing} />
              <span>
                {playing ? "Pause" : "Play"} <span className={styles.playTrack}>{album.featured.name}</span>
              </span>
            </button>
          ) : (
            <ExternalLink href={spotifySearch} className={styles.play}>
              <PlayIcon playing={false} />
              <span>
                Play <span className={styles.playTrack}>{album.featured.name}</span>
              </span>
            </ExternalLink>
          ))}

        {album.tracks && album.tracks.length > 0 ? (
          <>
            <ol className={styles.tracks}>
              {album.tracks.map((track) => (
                <li key={track.n} className={styles.track}>
                  <span className={styles.trackMono}>{String(track.n).padStart(2, "0")}</span>
                  <span className={cx(track.featured && styles.trackFeatured)}>{track.name}</span>
                  <span className={styles.star}>{track.fav ? "★" : ""}</span>
                  <span className={styles.trackMono}>{track.time}</span>
                </li>
              ))}
            </ol>
            <p className={styles.legend}>
              <span className={styles.star} aria-hidden="true">★</span>{" "}
              <span className={styles.legendText}>favorites</span>
            </p>
          </>
        ) : (
          <ExternalLink href={SPOTIFY_PROFILE} className={cx(linkClass, styles.textLink)}>
            Listen on Spotify
          </ExternalLink>
        )}
      </div>
    </div>
  );
}

function FilmDetails({ film }: { film: FilmRow }) {
  return (
    <div className={styles.filmDetails}>
      <Image src={film.poster} alt={`${film.title} poster`} width={120} height={180} className={styles.poster} />
      <div className={styles.filmText}>
        {film.synopsis && <p className={cx(styles.filmDescription, styles.filmSynopsis)}>{film.synopsis}</p>}
        {film.review ? (
          <blockquote className={cx(articleStyles.quote, styles.filmReview)}>
            <p className={styles.filmDescription}>{film.review}</p>
            {film.reviewUrl && (
              <ExternalLink href={film.reviewUrl} className={cx(linkClass, styles.reviewLink)}>
                Read full review
              </ExternalLink>
            )}
          </blockquote>
        ) : (
          <p className={cx(styles.filmDescription, styles.filmReview)}>Review incoming!</p>
        )}
      </div>
    </div>
  );
}

// Phosphor PlayCircle / PauseCircle (fill), 22px.
function PlayIcon({ playing }: { playing: boolean }) {
  return (
    <svg className={styles.playIcon} width="22" height="22" viewBox="0 0 256 256" aria-hidden="true">
      {playing ? (
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM112,160a8,8,0,0,1-16,0V96a8,8,0,0,1,16,0Zm48,0a8,8,0,0,1-16,0V96a8,8,0,0,1,16,0Z" />
      ) : (
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm36.44,110.66-48,32A8,8,0,0,1,104,160V96a8,8,0,0,1,12.44-6.66l48,32a8,8,0,0,1,0,13.32Z" />
      )}
    </svg>
  );
}

// A single shared <audio> element for the featured-track clips in /public/audio.
function useFeaturedAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingSrc, setPlayingSrc] = useState<string | null>(null);

  useEffect(() => {
    const audio = new Audio();
    const handleEnded = () => setPlayingSrc(null);
    audio.addEventListener("ended", handleEnded);
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener("ended", handleEnded);
      audioRef.current = null;
    };
  }, []);

  const stop = () => {
    audioRef.current?.pause();
    setPlayingSrc(null);
  };

  const toggle = (src: string) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playingSrc === src) {
      stop();
      return;
    }

    if (!audio.src.endsWith(src)) {
      audio.src = src;
    }

    void audio
      .play()
      .then(() => setPlayingSrc(src))
      .catch(() => setPlayingSrc(null));
  };

  return { playingSrc, stop, toggle };
}
