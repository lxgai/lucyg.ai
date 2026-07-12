export type Trip = {
  id: string;
  cover: string;
  // Optional fallbacks for a trip that does not yet have a detail page. When a
  // detail exists it is the single source of truth for these fields — see
  // resolveTravelEntry in @/data/travelEntries — so they are left unset here.
  place?: string;
  sub?: string;
  date?: string;
  duration?: string;
};

export const TRIPS: Trip[] = [
  {
    id: "china-24",
    cover: "/images/travels/china-24/west-lake-2.jpg",
  },
  {
    id: "japan-24",
    cover: "/images/travels/japan-24/japan-index.jpeg",
  },
  {
    id: "netherlands-25",
    cover: "/images/travels/netherlands-25/canal-cruise.jpg",
  },
  {
    id: "china-25",
    cover: "/images/travels/china-25/shanghai-bund.jpg",
  },
];
