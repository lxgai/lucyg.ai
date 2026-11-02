import { TRIPS, type Trip } from "@/data/travels";
import china24 from "@/data/travel-articles/china-24.json";
import china25 from "@/data/travel-articles/china-25.json";
import japan24 from "@/data/travel-articles/japan-24.json";
import netherlands25 from "@/data/travel-articles/netherlands-25.json";
import { parseDateParts } from "@/lib/dates";
import type { TravelArticle } from "@/types/travelArticle";

// A trip's article is the single source of truth for its place, city list,
// start date, and duration. Register every trip's article here; the travels
// index and the home page derive their display metadata through
// resolveTravelEntry, so none of it is duplicated in travels.ts. Articles are
// edited in /admin/travel-detail-editor.
export const TRAVEL_ARTICLES: Partial<Record<string, TravelArticle>> = {
  "china-24": china24 as TravelArticle,
  "japan-24": japan24 as TravelArticle,
  "netherlands-25": netherlands25 as TravelArticle,
  "china-25": china25 as TravelArticle,
};

// Inclusive day count between "MM / DD / YYYY" dates, e.g. "14 days".
function articleDuration(article: TravelArticle) {
  const start = parseDateParts(article.startDate);
  const end = parseDateParts(article.endDate);
  if (!start || !end) return "";

  const days =
    Math.round(
      (Date.UTC(end.year, end.month - 1, end.day) - Date.UTC(start.year, start.month - 1, start.day)) / 86_400_000,
    ) + 1;
  return days > 0 ? `${days} days` : "";
}

export type ResolvedTravelEntry = {
  id: string;
  place: string;
  sub: string;
  date: string;
  duration: string;
  hasDetail: boolean;
};

// Merges a trip's id with the display metadata derived
// from its article. Falls back to the optional travels.ts fields only for a
// trip that has no article yet.
export function resolveTravelEntry(trip: Trip): ResolvedTravelEntry {
  const article = TRAVEL_ARTICLES[trip.id];

  if (!article) {
    return {
      id: trip.id,
      place: trip.place ?? "",
      sub: trip.sub ?? "",
      date: trip.date ?? "",
      duration: trip.duration ?? "",
      hasDetail: false,
    };
  }

  return {
    id: trip.id,
    place: article.place,
    sub: article.tags.join(" · "),
    date: article.startDate,
    duration: articleDuration(article),
    hasDetail: true,
  };
}

export const TRAVEL_ENTRIES: ResolvedTravelEntry[] = TRIPS.map(resolveTravelEntry);
