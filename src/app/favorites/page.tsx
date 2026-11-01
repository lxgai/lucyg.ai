import SiteShell from "@/components/site/SiteShell";
import { pageTitleClass } from "@/components/site/ui";
import { ALBUMS, FEATURED_TRACK_AUDIO, MOVIES, TRACKLISTS } from "@/data/favorites";
import { getLetterboxdFavoriteMovieEntries } from "@/lib/letterboxd";
import { slugify } from "@/lib/slug";
import FavoritesAccordions, { type AlbumRow, type FilmRow } from "./FavoritesAccordions";

export const revalidate = 3600;

const LETTERBOXD_PROFILE = "https://letterboxd.com/lucy_gai";

export default async function FavoritesPage() {
  const letterboxdEntries = await getLetterboxdFavoriteMovieEntries();
  const letterboxdByKey = new Map(letterboxdEntries.map((entry) => [entry.key, entry]));

  // Albums follow the custom order (higher customorder first).
  const albums: AlbumRow[] = [...ALBUMS]
    .sort((a, b) => b.customorder - a.customorder)
    .map((album) => {
      const tracks = TRACKLISTS[album.title];
      const featured = tracks?.find((track) => track.featured);
      return {
        title: album.title,
        artist: album.artist,
        year: album.year,
        cover: album.src,
        tracks,
        featured,
        featuredAudio: featured ? FEATURED_TRACK_AUDIO[album.title]?.[featured.n] : undefined,
      };
    });

  const films: FilmRow[] = MOVIES.map((movie) => {
    const synced = letterboxdByKey.get(`${slugify(movie.title)}-${movie.year}`);
    return {
      title: movie.title,
      director: movie.director,
      year: movie.year,
      poster: movie.src,
      description: synced?.note || movie.note,
      reviewUrl: synced?.sourceUrl ?? `${LETTERBOXD_PROFILE}/film/${slugify(movie.title)}/`,
    };
  });

  return (
    <SiteShell>
      <h1 className={pageTitleClass} style={{ marginBottom: 32 }}>
        Favorites
      </h1>
      <FavoritesAccordions albums={albums} films={films} />
    </SiteShell>
  );
}
