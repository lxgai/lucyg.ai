export type Trip = {
  id: string;
  // Optional fallbacks for a trip that does not yet have an article. When an
  // article exists it is the single source of truth for these fields — see
  // resolveTravelEntry in @/data/travelEntries — so they are left unset here.
  place?: string;
  sub?: string;
  date?: string;
  duration?: string;
};

export const TRIPS: Trip[] = [
  { id: "china-24" },
  { id: "japan-24" },
  { id: "netherlands-25" },
  { id: "china-25" },
];
