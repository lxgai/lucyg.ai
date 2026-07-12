import { TRIPS, type Trip } from "@/data/travels";
import china24 from "@/data/travel-details/china-24.json";
import china25 from "@/data/travel-details/china-25.json";
import japan24 from "@/data/travel-details/japan-24.json";
import netherlands25 from "@/data/travel-details/netherlands-25.json";
import { getTravelDetailIndexMeta, reportTravelDetailIndexDrift } from "@/lib/travelDetailIndex";
import type { TravelDetailData } from "@/types/travelDetail";

// A trip's detail page is the single source of truth for its place, city list,
// start date, and duration. Register every trip's detail here; the travels
// index, the home page, and the cover editor all derive their display metadata
// through resolveTravelEntry, so none of it is duplicated in travels.ts.
export const TRAVEL_DETAILS: Partial<Record<string, TravelDetailData>> = {
  "china-24": china24 as TravelDetailData,
  "japan-24": japan24 as TravelDetailData,
  "netherlands-25": netherlands25 as TravelDetailData,
  "china-25": china25 as TravelDetailData,
};

export type ResolvedTravelEntry = {
  id: string;
  place: string;
  sub: string;
  date: string;
  duration: string;
  cover: string;
  hasDetail: boolean;
};

// Merges a trip's unique fields (id, cover) with the display metadata derived
// from its detail page. Falls back to the optional travels.ts fields only for a
// trip that has no detail page yet.
export function resolveTravelEntry(trip: Trip): ResolvedTravelEntry {
  const detail = TRAVEL_DETAILS[trip.id];

  if (!detail) {
    return {
      id: trip.id,
      place: trip.place ?? "",
      sub: trip.sub ?? "",
      date: trip.date ?? "",
      duration: trip.duration ?? "",
      cover: trip.cover,
      hasDetail: false,
    };
  }

  reportTravelDetailIndexDrift(trip.id, detail);
  const meta = getTravelDetailIndexMeta(detail);

  return {
    id: trip.id,
    place: detail.metadata.place || trip.place || "",
    sub: meta.citySummary || trip.sub || "",
    date: meta.date || trip.date || "",
    duration: meta.duration || trip.duration || "",
    cover: trip.cover,
    hasDetail: true,
  };
}

export const TRAVEL_ENTRIES: ResolvedTravelEntry[] = TRIPS.map(resolveTravelEntry);
