import SiteShell from "@/components/site/SiteShell";
import { siteNavWith } from "@/components/site/siteNav";
import { pageTitleClass } from "@/components/site/ui";
import { ALBUMS, FEATURED_TRACK_AUDIO, MOVIES, TRACKLISTS } from "@/data/favorites";
import { filmSlugFromReviewUrl, getLetterboxdFavoriteMovieEntries, getLetterboxdFilmSynopsis } from "@/lib/letterboxd";
import { slugify } from "@/lib/slug";
import { ALBUMS_ID, FILMS_ID } from "./anchors";
import FavoritesAccordions, { type AlbumRow, type FilmRow } from "./FavoritesAccordions";

export const revalidate = 3600;

const REVIEW_EXCERPT_LENGTH = 200;

// Cut at the last word break within the limit.
function excerpt(text: string, max = REVIEW_EXCERPT_LENGTH) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max + 1);
  const end = cut.lastIndexOf(" ");
  return `${(end > 0 ? cut.slice(0, end) : text.slice(0, max)).replace(/[\s.,;:!?–—-]+$/, "")}…`;
}

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

  const films: FilmRow[] = await Promise.all(
    MOVIES.map(async (movie) => {
      const synced = letterboxdByKey.get(`${slugify(movie.title)}-${movie.year}`);
      const filmSlug = filmSlugFromReviewUrl(synced?.sourceUrl) ?? slugify(movie.title);
      const review = synced?.note && synced.sourceUrl ? synced.note : undefined;
      return {
        title: movie.title,
        director: movie.director,
        year: movie.year,
        poster: movie.src,
        synopsis: await getLetterboxdFilmSynopsis(filmSlug),
        review: review ? excerpt(review) : undefined,
        reviewUrl: review ? synced?.sourceUrl : undefined,
      };
    }),
  );

  // Site nav with the two sections under Favorites.
  const toc = siteNavWith("/favorites", [
    { href: `#${ALBUMS_ID}`, label: "Albums" },
    { href: `#${FILMS_ID}`, label: "Films" },
  ]);

  return (
    <SiteShell toc={toc}>
      <h1 id="top" className={pageTitleClass} style={{ marginBottom: 32, scrollMarginTop: 80 }}>
        Favorites
      </h1>
      <FavoritesAccordions albums={albums} films={films} />
    </SiteShell>
  );
}
