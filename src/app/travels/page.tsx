import Link from "next/link";
import SiteShell from "@/components/site/SiteShell";
import listStyles from "@/components/site/list.module.css";
import { TagRow, pageTitleClass } from "@/components/site/ui";
import { TRAVEL_ENTRIES } from "@/data/travelEntries";
import { dateSortValue, formatDisplayDate } from "@/lib/dates";

export const revalidate = 3600;

// First city as a tag, plus a "+N" tag whose tooltip lists the rest.
function cityTags(citySummary: string) {
  const cities = citySummary
    .split("·")
    .map((city) => city.trim())
    .filter(Boolean);
  if (cities.length === 0) return [];

  const [first, ...rest] = cities;
  return rest.length > 0 ? [{ label: first }, { label: `+${rest.length}`, title: rest.join(", ") }] : [{ label: first }];
}

export default function TravelsPage() {
  const trips = [...TRAVEL_ENTRIES].sort((a, b) => dateSortValue(b.date) - dateSortValue(a.date));

  return (
    <SiteShell>
      <h1 className={pageTitleClass} style={{ marginBottom: 28 }}>
        Travel Log
      </h1>
      <ul className={listStyles.list}>
        {trips.map((trip) => (
          <li key={trip.id} className={listStyles.item}>
            <div className={listStyles.row}>
              <p className={listStyles.date}>{formatDisplayDate(trip.date)}</p>
              <h2 className={listStyles.title}>
                {trip.hasDetail ? <Link href={`/travels/${trip.id}`}>{trip.place}</Link> : trip.place}
              </h2>
              <TagRow tags={cityTags(trip.sub)} large layout="inline" />
            </div>
          </li>
        ))}
      </ul>
    </SiteShell>
  );
}
